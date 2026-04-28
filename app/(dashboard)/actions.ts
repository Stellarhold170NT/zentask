"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db/db";
import {
  organizations,
  organizationMembers,
  projects,
  profiles,
  boards,
  columns,
  cards,
  vaultEntries,
  vaultVersions,
} from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { generateUniqueSlug } from "@/lib/utils/slug";

export async function createOrganization(name: string, description?: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  if (!name || name.trim().length < 2) {
    return { error: "Organization name must be at least 2 characters" };
  }

  try {
    const slug = await generateUniqueSlug(name, async (s) => {
      const existing = await db
        .select({ id: organizations.id })
        .from(organizations)
        .where(eq(organizations.slug, s));
      return existing.length > 0;
    });

    const [org] = await db
      .insert(organizations)
      .values({
        name: name.trim(),
        slug,
        description: description?.trim() || null,
      })
      .returning();

    await db.insert(organizationMembers).values({
      organizationId: org.id,
      userId: user.id,
      role: "owner",
    });

    revalidatePath("/organizations");
    return { slug: org.slug };
  } catch (err) {
    console.error("Failed to create organization:", err);
    return { error: "Failed to create organization. Please try again." };
  }
}

export async function updateOrganization(
  slug: string,
  name?: string,
  description?: string
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, slug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const membership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (membership.length === 0) return { error: "Not a member of this organization" };
    if (membership[0].role !== "owner" && membership[0].role !== "admin") {
      return { error: "Only owners and admins can update organization settings" };
    }

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description.trim() || null;

    if (Object.keys(updates).length > 0) {
      await db
        .update(organizations)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(organizations.id, org[0].id));
    }

    revalidatePath(`/org/${slug}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to update organization:", err);
    return { error: "Failed to update organization. Please try again." };
  }
}

export async function deleteOrganization(slug: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, slug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const membership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (membership.length === 0) return { error: "Not a member of this organization" };
    if (membership[0].role !== "owner") {
      return { error: "Only owners can delete organizations" };
    }

    await db.delete(organizations).where(eq(organizations.id, org[0].id));

    revalidatePath("/organizations");
    return { success: true };
  } catch (err) {
    console.error("Failed to delete organization:", err);
    return { error: "Failed to delete organization. Please try again." };
  }
}

export async function inviteMember(orgSlug: string, email: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  if (!email || !email.trim()) {
    return { error: "Email is required" };
  }

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgSlug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const callerMembership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (callerMembership.length === 0) return { error: "Not a member of this organization" };
    if (callerMembership[0].role !== "owner" && callerMembership[0].role !== "admin") {
      return { error: "Only owners and admins can invite members" };
    }

    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.email, email.trim().toLowerCase()))
      .limit(1);

    if (profile.length === 0) {
      return { error: "User not found. They must create an account first." };
    }

    const existingMember = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, profile[0].userId)
        )
      )
      .limit(1);

    if (existingMember.length > 0) {
      return { error: "This user is already a member of this organization" };
    }

    if (profile[0].userId === user.id) {
      return { error: "You are already a member of this organization" };
    }

    await db.insert(organizationMembers).values({
      organizationId: org[0].id,
      userId: profile[0].userId,
      role: "member",
    });

    revalidatePath(`/org/${orgSlug}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to invite member:", err);
    return { error: "Failed to invite member. Please try again." };
  }
}

export async function removeMember(orgSlug: string, userId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgSlug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const callerMembership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (callerMembership.length === 0) return { error: "Not a member of this organization" };
    if (callerMembership[0].role !== "owner" && callerMembership[0].role !== "admin") {
      return { error: "Only owners and admins can remove members" };
    }

    const targetMembership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, userId)
        )
      )
      .limit(1);

    if (targetMembership.length === 0) {
      return { error: "Member not found" };
    }

    if (targetMembership[0].role === "owner") {
      const owners = await db
        .select()
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.organizationId, org[0].id),
            eq(organizationMembers.role, "owner")
          )
        );

      if (owners.length <= 1) {
        return { error: "Cannot remove the last owner. Transfer ownership first." };
      }
    }

    await db
      .delete(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, userId)
        )
      );

    revalidatePath(`/org/${orgSlug}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to remove member:", err);
    return { error: "Failed to remove member. Please try again." };
  }
}

export async function updateMemberRole(
  orgSlug: string,
  userId: string,
  role: "owner" | "admin" | "member"
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgSlug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const callerMembership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (callerMembership.length === 0) return { error: "Not a member of this organization" };
    if (callerMembership[0].role !== "owner") {
      return { error: "Only owners can change member roles" };
    }

    await db.transaction(async (tx) => {
      if (role === "owner") {
        await tx
          .update(organizationMembers)
          .set({ role: "admin" })
          .where(
            and(
              eq(organizationMembers.organizationId, org[0].id),
              eq(organizationMembers.userId, user.id)
            )
          );
      }

      await tx
        .update(organizationMembers)
        .set({ role })
        .where(
          and(
            eq(organizationMembers.organizationId, org[0].id),
            eq(organizationMembers.userId, userId)
          )
        );
    });

    revalidatePath(`/org/${orgSlug}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to update member role:", err);
    return { error: "Failed to update member role. Please try again." };
  }
}

export async function createProject(
  orgSlug: string,
  name: string,
  description?: string
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  if (!name || name.trim().length < 1) {
    return { error: "Project name is required" };
  }

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgSlug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const membership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (membership.length === 0) return { error: "Not a member of this organization" };
    if (membership[0].role !== "owner" && membership[0].role !== "admin") {
      return { error: "Only owners and admins can create projects" };
    }

    const [project] = await db
      .insert(projects)
      .values({
        organizationId: org[0].id,
        name: name.trim(),
        description: description?.trim() || null,
      })
      .returning();

    revalidatePath(`/org/${orgSlug}`);
    return { projectId: project.id };
  } catch (err) {
    console.error("Failed to create project:", err);
    return { error: "Failed to create project. Please try again." };
  }
}

export async function updateProject(
  projectId: string,
  orgSlug: string,
  name?: string,
  description?: string
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgSlug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const membership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (membership.length === 0) return { error: "Not a member of this organization" };
    if (membership[0].role !== "owner" && membership[0].role !== "admin") {
      return { error: "Only owners and admins can update projects" };
    }

    const projectCheck = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.organizationId, org[0].id)))
      .limit(1);

    if (projectCheck.length === 0) return { error: "Project not found in this organization" };

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description.trim() || null;

    if (Object.keys(updates).length > 0) {
      await db
        .update(projects)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(projects.id, projectId));
    }

    revalidatePath(`/org/${orgSlug}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to update project:", err);
    return { error: "Failed to update project. Please try again." };
  }
}

export async function deleteProject(projectId: string, orgSlug: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgSlug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const membership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (membership.length === 0) return { error: "Not a member of this organization" };
    if (membership[0].role !== "owner" && membership[0].role !== "admin") {
      return { error: "Only owners and admins can delete projects" };
    }

    const projectCheck = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.organizationId, org[0].id)))
      .limit(1);

    if (projectCheck.length === 0) return { error: "Project not found in this organization" };

    await db.delete(projects).where(eq(projects.id, projectId));

    revalidatePath(`/org/${orgSlug}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to delete project:", err);
    return { error: "Failed to delete project. Please try again." };
  }
}

export async function createBoard(
  orgSlug: string,
  projectId: string,
  name: string,
  description?: string
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  if (!name || name.trim().length < 1) {
    return { error: "Board name is required" };
  }

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgSlug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const membership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (membership.length === 0) return { error: "Not a member of this organization" };
    if (membership[0].role !== "owner" && membership[0].role !== "admin") {
      return { error: "Only owners and admins can create boards" };
    }

    const project = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.organizationId, org[0].id)))
      .limit(1);

    if (project.length === 0) return { error: "Project not found" };

    const [board] = await db
      .insert(boards)
      .values({
        projectId,
        name: name.trim(),
        description: description?.trim() || null,
      })
      .returning();

    await db.insert(columns).values([
      { boardId: board.id, name: "To Do", order: 0 },
      { boardId: board.id, name: "In Progress", order: 1 },
      { boardId: board.id, name: "Done", order: 2 },
    ]);

    revalidatePath(`/org/${orgSlug}/projects/${projectId}`);
    return { boardId: board.id };
  } catch (err) {
    console.error("Failed to create board:", err);
    return { error: "Failed to create board. Please try again." };
  }
}

export async function updateBoard(
  boardId: string,
  orgSlug: string,
  projectId: string,
  name?: string,
  description?: string
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgSlug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const membership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (membership.length === 0) return { error: "Not a member of this organization" };
    if (membership[0].role !== "owner" && membership[0].role !== "admin") {
      return { error: "Only owners and admins can update boards" };
    }

    const board = await db
      .select()
      .from(boards)
      .innerJoin(projects, eq(boards.projectId, projects.id))
      .where(
        and(
          eq(boards.id, boardId),
          eq(projects.id, projectId),
          eq(projects.organizationId, org[0].id)
        )
      )
      .limit(1);

    if (board.length === 0) return { error: "Board not found" };

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description.trim() || null;

    if (Object.keys(updates).length > 0) {
      await db
        .update(boards)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(boards.id, boardId));
    }

    revalidatePath(`/org/${orgSlug}/projects/${projectId}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to update board:", err);
    return { error: "Failed to update board. Please try again." };
  }
}

export async function deleteBoard(
  boardId: string,
  orgSlug: string,
  projectId: string
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgSlug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const membership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (membership.length === 0) return { error: "Not a member of this organization" };
    if (membership[0].role !== "owner" && membership[0].role !== "admin") {
      return { error: "Only owners and admins can delete boards" };
    }

    const board = await db
      .select()
      .from(boards)
      .innerJoin(projects, eq(boards.projectId, projects.id))
      .where(
        and(
          eq(boards.id, boardId),
          eq(projects.id, projectId),
          eq(projects.organizationId, org[0].id)
        )
      )
      .limit(1);

    if (board.length === 0) return { error: "Board not found" };

    await db.delete(boards).where(eq(boards.id, boardId));

    revalidatePath(`/org/${orgSlug}/projects/${projectId}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to delete board:", err);
    return { error: "Failed to delete board. Please try again." };
  }
}

export async function createColumn(
  boardId: string,
  orgSlug: string,
  projectId: string,
  name: string
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  if (!name || name.trim().length < 1) {
    return { error: "Column name is required" };
  }

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgSlug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const membership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (membership.length === 0) return { error: "Not a member of this organization" };
    if (membership[0].role !== "owner" && membership[0].role !== "admin") {
      return { error: "Only owners and admins can create columns" };
    }

    const board = await db
      .select()
      .from(boards)
      .innerJoin(projects, eq(boards.projectId, projects.id))
      .where(
        and(
          eq(boards.id, boardId),
          eq(projects.id, projectId),
          eq(projects.organizationId, org[0].id)
        )
      )
      .limit(1);

    if (board.length === 0) return { error: "Board not found" };

    const existingColumns = await db
      .select()
      .from(columns)
      .where(eq(columns.boardId, boardId));

    const [column] = await db
      .insert(columns)
      .values({
        boardId,
        name: name.trim(),
        order: existingColumns.length,
      })
      .returning();

    revalidatePath(`/org/${orgSlug}/projects/${projectId}/boards/${boardId}`);
    return { columnId: column.id };
  } catch (err) {
    console.error("Failed to create column:", err);
    return { error: "Failed to create column. Please try again." };
  }
}

export async function updateColumn(
  columnId: string,
  boardId: string,
  orgSlug: string,
  projectId: string,
  name?: string
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgSlug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const membership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (membership.length === 0) return { error: "Not a member of this organization" };
    if (membership[0].role !== "owner" && membership[0].role !== "admin") {
      return { error: "Only owners and admins can update columns" };
    }

    const column = await db
      .select()
      .from(columns)
      .innerJoin(boards, eq(columns.boardId, boards.id))
      .innerJoin(projects, eq(boards.projectId, projects.id))
      .where(
        and(
          eq(columns.id, columnId),
          eq(boards.id, boardId),
          eq(projects.id, projectId),
          eq(projects.organizationId, org[0].id)
        )
      )
      .limit(1);

    if (column.length === 0) return { error: "Column not found" };

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name.trim();

    if (Object.keys(updates).length > 0) {
      await db
        .update(columns)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(columns.id, columnId));
    }

    revalidatePath(`/org/${orgSlug}/projects/${projectId}/boards/${boardId}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to update column:", err);
    return { error: "Failed to update column. Please try again." };
  }
}

export async function deleteColumn(
  columnId: string,
  boardId: string,
  orgSlug: string,
  projectId: string
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgSlug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const membership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (membership.length === 0) return { error: "Not a member of this organization" };
    if (membership[0].role !== "owner" && membership[0].role !== "admin") {
      return { error: "Only owners and admins can delete columns" };
    }

    const column = await db
      .select()
      .from(columns)
      .innerJoin(boards, eq(columns.boardId, boards.id))
      .innerJoin(projects, eq(boards.projectId, projects.id))
      .where(
        and(
          eq(columns.id, columnId),
          eq(boards.id, boardId),
          eq(projects.id, projectId),
          eq(projects.organizationId, org[0].id)
        )
      )
      .limit(1);

    if (column.length === 0) return { error: "Column not found" };

    await db.delete(columns).where(eq(columns.id, columnId));

    revalidatePath(`/org/${orgSlug}/projects/${projectId}/boards/${boardId}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to delete column:", err);
    return { error: "Failed to delete column. Please try again." };
  }
}

export async function createCard(
  columnId: string,
  boardId: string,
  orgSlug: string,
  projectId: string,
  title: string,
  description?: string,
  priority?: "low" | "medium" | "high",
  dueDate?: string,
  labels?: string[],
  assigneeId?: string
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  if (!title || title.trim().length < 1) {
    return { error: "Card title is required" };
  }

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgSlug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const membership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (membership.length === 0) return { error: "Not a member of this organization" };

    if (assigneeId) {
      const assigneeMember = await db
        .select()
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.organizationId, org[0].id),
            eq(organizationMembers.userId, assigneeId)
          )
        )
        .limit(1);
      if (assigneeMember.length === 0) {
        return { error: "Assignee is not a member of this organization" };
      }
    }

    const sanitizedLabels = labels
      ? labels.map((l) => l.trim()).filter(Boolean).slice(0, 10)
      : [];
    if (sanitizedLabels.some((l) => l.length > 50)) {
      return { error: "Each label must be 50 characters or less" };
    }

    const column = await db
      .select()
      .from(columns)
      .innerJoin(boards, eq(columns.boardId, boards.id))
      .innerJoin(projects, eq(boards.projectId, projects.id))
      .where(
        and(
          eq(columns.id, columnId),
          eq(boards.id, boardId),
          eq(projects.id, projectId),
          eq(projects.organizationId, org[0].id)
        )
      )
      .limit(1);

    if (column.length === 0) return { error: "Column not found" };

    const existingCards = await db
      .select()
      .from(cards)
      .where(eq(cards.columnId, columnId));

    const [card] = await db
      .insert(cards)
      .values({
        columnId,
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority || "medium",
        dueDate: dueDate ? new Date(dueDate) : null,
        labels: sanitizedLabels,
        assigneeId: assigneeId || null,
        order: existingCards.length,
      })
      .returning();

    revalidatePath(`/org/${orgSlug}/projects/${projectId}/boards/${boardId}`);
    return { cardId: card.id };
  } catch (err) {
    console.error("Failed to create card:", err);
    return { error: "Failed to create card. Please try again." };
  }
}

export async function updateCard(
  cardId: string,
  columnId: string,
  boardId: string,
  orgSlug: string,
  projectId: string,
  updates: {
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    dueDate?: string | null;
    labels?: string[];
    assigneeId?: string | null;
    columnId?: string;
  }
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgSlug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const membership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (membership.length === 0) return { error: "Not a member of this organization" };

    if (updates.assigneeId) {
      const assigneeMember = await db
        .select()
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.organizationId, org[0].id),
            eq(organizationMembers.userId, updates.assigneeId)
          )
        )
        .limit(1);
      if (assigneeMember.length === 0) {
        return { error: "Assignee is not a member of this organization" };
      }
    }

    if (updates.labels) {
      const sanitizedLabels = updates.labels.map((l) => l.trim()).filter(Boolean).slice(0, 10);
      if (sanitizedLabels.some((l) => l.length > 50)) {
        return { error: "Each label must be 50 characters or less" };
      }
      updates.labels = sanitizedLabels;
    }

    const card = await db
      .select()
      .from(cards)
      .innerJoin(columns, eq(cards.columnId, columns.id))
      .innerJoin(boards, eq(columns.boardId, boards.id))
      .innerJoin(projects, eq(boards.projectId, projects.id))
      .where(
        and(
          eq(cards.id, cardId),
          eq(columns.id, columnId),
          eq(boards.id, boardId),
          eq(projects.id, projectId),
          eq(projects.organizationId, org[0].id)
        )
      )
      .limit(1);

    if (card.length === 0) return { error: "Card not found" };

    const setData: Record<string, unknown> = { updatedAt: new Date() };
    if (updates.title !== undefined) setData.title = updates.title.trim();
    if (updates.description !== undefined) setData.description = updates.description.trim() || null;
    if (updates.priority !== undefined) setData.priority = updates.priority;
    if (updates.dueDate !== undefined) setData.dueDate = updates.dueDate ? new Date(updates.dueDate) : null;
    if (updates.labels !== undefined) setData.labels = updates.labels;
    if (updates.assigneeId !== undefined) setData.assigneeId = updates.assigneeId || null;
    if (updates.columnId !== undefined) setData.columnId = updates.columnId;

    await db
      .update(cards)
      .set(setData)
      .where(eq(cards.id, cardId));

    revalidatePath(`/org/${orgSlug}/projects/${projectId}/boards/${boardId}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to update card:", err);
    return { error: "Failed to update card. Please try again." };
  }
}

export async function deleteCard(
  cardId: string,
  columnId: string,
  boardId: string,
  orgSlug: string,
  projectId: string
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgSlug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const membership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (membership.length === 0) return { error: "Not a member of this organization" };

    const card = await db
      .select()
      .from(cards)
      .innerJoin(columns, eq(cards.columnId, columns.id))
      .innerJoin(boards, eq(columns.boardId, boards.id))
      .innerJoin(projects, eq(boards.projectId, projects.id))
      .where(
        and(
          eq(cards.id, cardId),
          eq(columns.id, columnId),
          eq(boards.id, boardId),
          eq(projects.id, projectId),
          eq(projects.organizationId, org[0].id)
        )
      )
      .limit(1);

    if (card.length === 0) return { error: "Card not found" };

    await db.delete(cards).where(eq(cards.id, cardId));

    revalidatePath(`/org/${orgSlug}/projects/${projectId}/boards/${boardId}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to delete card:", err);
    return { error: "Failed to delete card. Please try again." };
  }
}

export async function moveCard(
  cardId: string,
  boardId: string,
  orgSlug: string,
  projectId: string,
  newColumnId: string,
  newOrder: number
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgSlug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const membership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (membership.length === 0) return { error: "Not a member of this organization" };

    const cardCheck = await db
      .select()
      .from(cards)
      .innerJoin(columns, eq(cards.columnId, columns.id))
      .innerJoin(boards, eq(columns.boardId, boards.id))
      .innerJoin(projects, eq(boards.projectId, projects.id))
      .where(
        and(
          eq(cards.id, cardId),
          eq(boards.id, boardId),
          eq(projects.id, projectId),
          eq(projects.organizationId, org[0].id)
        )
      )
      .limit(1);

    if (cardCheck.length === 0) return { error: "Card not found" };

    const newColumnCheck = await db
      .select()
      .from(columns)
      .innerJoin(boards, eq(columns.boardId, boards.id))
      .innerJoin(projects, eq(boards.projectId, projects.id))
      .where(
        and(
          eq(columns.id, newColumnId),
          eq(boards.id, boardId),
          eq(projects.id, projectId),
          eq(projects.organizationId, org[0].id)
        )
      )
      .limit(1);

    if (newColumnCheck.length === 0) return { error: "Target column not found" };

    const oldColumnId = cardCheck[0].cards.columnId;

    await db.transaction(async (tx) => {
      if (oldColumnId !== newColumnId) {
        await tx
          .update(cards)
          .set({ order: newOrder, columnId: newColumnId })
          .where(eq(cards.id, cardId));
      } else {
        await tx
          .update(cards)
          .set({ order: newOrder })
          .where(eq(cards.id, cardId));
      }
    });

    revalidatePath(`/org/${orgSlug}/projects/${projectId}/boards/${boardId}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to move card:", err);
    return { error: "Failed to move card. Please try again." };
  }
}

export async function getVaultEntries(orgSlug: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgSlug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const membership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (membership.length === 0) return { error: "Not a member of this organization" };
    if (membership[0].role !== "owner" && membership[0].role !== "admin") {
      return { error: "Only owners and admins can view vault" };
    }

    const entries = await db
      .select({
        id: vaultEntries.id,
        key: vaultEntries.key,
        value: vaultEntries.value,
        projectId: vaultEntries.projectId,
        createdAt: vaultEntries.createdAt,
        updatedAt: vaultEntries.updatedAt,
      })
      .from(vaultEntries)
      .where(eq(vaultEntries.organizationId, org[0].id))
      .orderBy(vaultEntries.key);

    return { entries };
  } catch (err) {
    console.error("Failed to get vault entries:", err);
    return { error: "Failed to get vault entries. Please try again." };
  }
}

export async function createVaultEntry(
  orgSlug: string,
  key: string,
  value: string,
  projectId?: string
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  if (!key || key.trim().length < 1) {
    return { error: "Key is required" };
  }
  if (!value || value.trim().length < 1) {
    return { error: "Value is required" };
  }

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgSlug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const membership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (membership.length === 0) return { error: "Not a member of this organization" };
    if (membership[0].role !== "owner" && membership[0].role !== "admin") {
      return { error: "Only owners and admins can manage vault" };
    }

    if (projectId) {
      const projectCheck = await db
        .select()
        .from(projects)
        .where(and(eq(projects.id, projectId), eq(projects.organizationId, org[0].id)))
        .limit(1);
      if (projectCheck.length === 0) {
        return { error: "Project not found in this organization" };
      }
    }

    const [entry] = await db
      .insert(vaultEntries)
      .values({
        organizationId: org[0].id,
        projectId: projectId || null,
        key: key.trim(),
        value: value.trim(),
      })
      .returning();

    await db.insert(vaultVersions).values({
      vaultEntryId: entry.id,
      value: value.trim(),
      changedBy: user.email,
    });

    revalidatePath(`/org/${orgSlug}/vault`);
    return { entryId: entry.id };
  } catch (err) {
    console.error("Failed to create vault entry:", err);
    return { error: "Failed to create vault entry. Please try again." };
  }
}

export async function updateVaultEntry(
  entryId: string,
  orgSlug: string,
  value: string
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  if (!value || value.trim().length < 1) {
    return { error: "Value is required" };
  }

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgSlug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const membership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (membership.length === 0) return { error: "Not a member of this organization" };
    if (membership[0].role !== "owner" && membership[0].role !== "admin") {
      return { error: "Only owners and admins can manage vault" };
    }

    const entry = await db
      .select()
      .from(vaultEntries)
      .where(and(eq(vaultEntries.id, entryId), eq(vaultEntries.organizationId, org[0].id)))
      .limit(1);

    if (entry.length === 0) return { error: "Vault entry not found" };

    await db
      .update(vaultEntries)
      .set({ value: value.trim(), updatedAt: new Date() })
      .where(eq(vaultEntries.id, entryId));

    await db.insert(vaultVersions).values({
      vaultEntryId: entryId,
      value: value.trim(),
      changedBy: user.email,
    });

    revalidatePath(`/org/${orgSlug}/vault`);
    return { success: true };
  } catch (err) {
    console.error("Failed to update vault entry:", err);
    return { error: "Failed to update vault entry. Please try again." };
  }
}

export async function deleteVaultEntry(entryId: string, orgSlug: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgSlug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const membership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (membership.length === 0) return { error: "Not a member of this organization" };
    if (membership[0].role !== "owner" && membership[0].role !== "admin") {
      return { error: "Only owners and admins can manage vault" };
    }

    const entry = await db
      .select()
      .from(vaultEntries)
      .where(and(eq(vaultEntries.id, entryId), eq(vaultEntries.organizationId, org[0].id)))
      .limit(1);

    if (entry.length === 0) return { error: "Vault entry not found" };

    await db.delete(vaultEntries).where(eq(vaultEntries.id, entryId));

    revalidatePath(`/org/${orgSlug}/vault`);
    return { success: true };
  } catch (err) {
    console.error("Failed to delete vault entry:", err);
    return { error: "Failed to delete vault entry. Please try again." };
  }
}

export async function getVaultVersions(entryId: string, orgSlug: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  try {
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgSlug))
      .limit(1);

    if (org.length === 0) return { error: "Organization not found" };

    const membership = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, user.id)
        )
      )
      .limit(1);

    if (membership.length === 0) return { error: "Not a member of this organization" };
    if (membership[0].role !== "owner" && membership[0].role !== "admin") {
      return { error: "Only owners and admins can view vault" };
    }

    const entry = await db
      .select()
      .from(vaultEntries)
      .where(and(eq(vaultEntries.id, entryId), eq(vaultEntries.organizationId, org[0].id)))
      .limit(1);

    if (entry.length === 0) return { error: "Vault entry not found" };

    const versions = await db
      .select()
      .from(vaultVersions)
      .where(eq(vaultVersions.vaultEntryId, entryId))
      .orderBy(vaultVersions.createdAt);

    return { versions };
  } catch (err) {
    console.error("Failed to get vault versions:", err);
    return { error: "Failed to get vault versions. Please try again." };
  }
}
