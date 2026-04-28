"use server";

import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db/db";
import {
  organizations,
  organizationMembers,
  projects,
  boards,
  columns,
  cards,
  profiles,
} from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export async function aiMoveCard(
  cardId: string,
  targetColumnName: string,
  orgSlug: string,
  projectId: string,
  boardId: string
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
    if (!["owner", "admin", "member"].includes(membership[0].role)) {
      return { error: "You don't have permission to move cards" };
    }

    const targetColumn = await db
      .select()
      .from(columns)
      .where(
        and(
          eq(columns.boardId, boardId),
          eq(columns.name, targetColumnName)
        )
      )
      .limit(1);

    if (targetColumn.length === 0) {
      return { error: `Column "${targetColumnName}" not found` };
    }

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

    await db.transaction(async (tx) => {
      const targetCards = await tx
        .select()
        .from(cards)
        .where(eq(cards.columnId, targetColumn[0].id));

      await tx
        .update(cards)
        .set({ columnId: targetColumn[0].id, order: targetCards.length })
        .where(eq(cards.id, cardId));
    });

    revalidatePath(`/org/${orgSlug}/projects/${projectId}/boards/${boardId}`);
    return { success: true, message: `Card moved to "${targetColumnName}"` };
  } catch (err) {
    console.error("Failed to move card:", err);
    return { error: "Failed to move card" };
  }
}

export async function aiCreateCard(
  columnName: string,
  title: string,
  description: string | undefined,
  priority: "low" | "medium" | "high" | undefined,
  dueDate: string | undefined,
  labels: string[] | undefined,
  assigneeEmail: string | undefined,
  orgSlug: string,
  projectId: string,
  boardId: string
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
    if (!["owner", "admin", "member"].includes(membership[0].role)) {
      return { error: "You don't have permission to create cards" };
    }

    const targetColumn = await db
      .select()
      .from(columns)
      .where(
        and(
          eq(columns.boardId, boardId),
          eq(columns.name, columnName)
        )
      )
      .limit(1);

    if (targetColumn.length === 0) {
      return { error: `Column "${columnName}" not found` };
    }

    let assigneeId: string | null = null;
    if (assigneeEmail) {
      const profile = await db
        .select()
        .from(profiles)
        .where(eq(profiles.email, assigneeEmail.toLowerCase()))
        .limit(1);
      if (profile.length > 0) {
        assigneeId = profile[0].userId;
      }
    }

    const existingCards = await db
      .select()
      .from(cards)
      .where(eq(cards.columnId, targetColumn[0].id));

    const [card] = await db
      .insert(cards)
      .values({
        columnId: targetColumn[0].id,
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority || "medium",
        dueDate: dueDate ? new Date(dueDate) : null,
        labels: labels || [],
        assigneeId,
        order: existingCards.length,
      })
      .returning();

    revalidatePath(`/org/${orgSlug}/projects/${projectId}/boards/${boardId}`);
    return { success: true, cardId: card.id, message: `Created card "${title}" in "${columnName}"` };
  } catch (err) {
    console.error("Failed to create card:", err);
    return { error: "Failed to create card" };
  }
}

export async function aiUpdateCard(
  cardId: string,
  updates: {
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    dueDate?: string | null;
    labels?: string[];
    assigneeEmail?: string | null;
  },
  orgSlug: string,
  projectId: string,
  boardId: string
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
    if (!["owner", "admin", "member"].includes(membership[0].role)) {
      return { error: "You don't have permission to update cards" };
    }

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

    const setData: Record<string, unknown> = { updatedAt: new Date() };
    if (updates.title !== undefined) setData.title = updates.title.trim();
    if (updates.description !== undefined) setData.description = updates.description.trim() || null;
    if (updates.priority !== undefined) setData.priority = updates.priority;
    if (updates.dueDate !== undefined) setData.dueDate = updates.dueDate ? new Date(updates.dueDate) : null;
    if (updates.labels !== undefined) setData.labels = updates.labels;

    if (updates.assigneeEmail !== undefined) {
      if (updates.assigneeEmail === null) {
        setData.assigneeId = null;
      } else {
        const profile = await db
          .select()
          .from(profiles)
          .where(eq(profiles.email, updates.assigneeEmail.toLowerCase()))
          .limit(1);
        if (profile.length > 0) {
          setData.assigneeId = profile[0].userId;
        }
      }
    }

    await db
      .update(cards)
      .set(setData)
      .where(eq(cards.id, cardId));

    revalidatePath(`/org/${orgSlug}/projects/${projectId}/boards/${boardId}`);
    return { success: true, message: "Card updated" };
  } catch (err) {
    console.error("Failed to update card:", err);
    return { error: "Failed to update card" };
  }
}

export async function aiGetBoardStatus(
  orgSlug: string,
  projectId: string,
  boardId: string
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

    const boardColumns = await db
      .select()
      .from(columns)
      .where(eq(columns.boardId, boardId))
      .orderBy(columns.order);

    const boardCards = await db
      .select({
        id: cards.id,
        title: cards.title,
        description: cards.description,
        priority: cards.priority,
        dueDate: cards.dueDate,
        labels: cards.labels,
        assigneeId: cards.assigneeId,
        columnId: cards.columnId,
        fullName: profiles.fullName,
      })
      .from(cards)
      .innerJoin(columns, eq(cards.columnId, columns.id))
      .leftJoin(profiles, eq(cards.assigneeId, profiles.userId))
      .where(eq(columns.boardId, boardId))
      .orderBy(cards.order);

    const now = new Date();
    const overdueCards = boardCards.filter((c) => c.dueDate && new Date(c.dueDate) < now);
    const highPriorityCards = boardCards.filter((c) => c.priority === "high");

    return {
      success: true,
      data: {
        totalCards: boardCards.length,
        totalColumns: boardColumns.length,
        columns: boardColumns.map((col) => ({
          name: col.name,
          cardCount: boardCards.filter((c) => c.columnId === col.id).length,
        })),
        overdueCount: overdueCards.length,
        overdueCards: overdueCards.map((c) => ({
          title: c.title,
          dueDate: c.dueDate,
          assignee: c.fullName,
        })),
        highPriorityCount: highPriorityCards.length,
        highPriorityCards: highPriorityCards.map((c) => ({
          title: c.title,
          column: boardColumns.find((col) => col.id === c.columnId)?.name,
          assignee: c.fullName,
        })),
      },
    };
  } catch (err) {
    console.error("Failed to get board status:", err);
    return { error: "Failed to get board status" };
  }
}
