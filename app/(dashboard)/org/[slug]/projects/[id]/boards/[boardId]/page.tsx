import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
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
import { eq, and, asc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { CreateColumnDialog } from "@/components/boards/create-column-dialog";
import { BoardColumns } from "@/components/boards/board-columns";
import { BoardRealtimeProvider } from "@/lib/realtime/board-realtime-context";
import { BoardAIWrapper } from "@/components/ai/board-ai-wrapper";

export const dynamic = "force-dynamic";

interface BoardPageProps {
  params: Promise<{ slug: string; id: string; boardId: string }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { slug, id, boardId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const org = await db
    .select()
    .from(organizations)
    .where(eq(organizations.slug, slug))
    .limit(1);

  if (org.length === 0) redirect("/organizations");

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

  if (membership.length === 0) redirect("/organizations");

  const project = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.organizationId, org[0].id)))
    .limit(1);

  if (project.length === 0) redirect(`/org/${slug}`);

  const board = await db
    .select()
    .from(boards)
    .where(and(eq(boards.id, boardId), eq(boards.projectId, id)))
    .limit(1);

  if (board.length === 0) redirect(`/org/${slug}/projects/${id}`);

  const boardColumns = await db
    .select()
    .from(columns)
    .where(eq(columns.boardId, boardId))
    .orderBy(asc(columns.order));

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
    .orderBy(asc(cards.order));

  const members = await db
    .select({
      userId: organizationMembers.userId,
      fullName: profiles.fullName,
      email: profiles.email,
    })
    .from(organizationMembers)
    .innerJoin(profiles, eq(organizationMembers.userId, profiles.userId))
    .where(eq(organizationMembers.organizationId, org[0].id));

  const userProfile = await db
    .select({ fullName: profiles.fullName })
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

  const formattedCards = boardCards.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    priority: c.priority,
    dueDate: c.dueDate,
    labels: c.labels,
    assigneeId: c.assigneeId,
    assigneeName: c.fullName,
    columnId: c.columnId,
  }));

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col -mx-6 -mt-6">
      <div className="flex items-center justify-between px-6 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <Link href={`/org/${slug}/projects/${id}`}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{board[0].name}</h1>
            {board[0].description && (
              <span className="text-sm text-muted-foreground hidden sm:inline">· {board[0].description}</span>
            )}
          </div>
        </div>
        <CreateColumnDialog orgSlug={slug} projectId={id} boardId={boardId} />
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <BoardRealtimeProvider
          boardId={boardId}
          userId={user.id}
          userName={userProfile[0]?.fullName ?? null}
          userEmail={user.email}
        >
          <BoardColumns
            orgSlug={slug}
            projectId={id}
            boardId={boardId}
            columns={boardColumns}
            cards={formattedCards}
            members={members}
          />
        </BoardRealtimeProvider>
      </div>

      <BoardAIWrapper
        boardId={boardId}
        orgSlug={slug}
        projectId={id}
        columns={boardColumns}
        cards={formattedCards}
        members={members}
      />
    </div>
  );
}
