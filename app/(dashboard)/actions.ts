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

    if (role === "owner") {
      await db
        .update(organizationMembers)
        .set({ role: "admin" })
        .where(
          and(
            eq(organizationMembers.organizationId, org[0].id),
            eq(organizationMembers.userId, user.id)
          )
        );
    }

    await db
      .update(organizationMembers)
      .set({ role })
      .where(
        and(
          eq(organizationMembers.organizationId, org[0].id),
          eq(organizationMembers.userId, userId)
        )
      );

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

    await db.delete(projects).where(eq(projects.id, projectId));

    revalidatePath(`/org/${orgSlug}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to delete project:", err);
    return { error: "Failed to delete project. Please try again." };
  }
}
