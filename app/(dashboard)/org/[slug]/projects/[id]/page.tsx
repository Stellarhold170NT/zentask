import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Layout } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { db } from "@/lib/db/db";
import { organizations, organizationMembers, projects, boards } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteProjectAlertDialog } from "@/components/projects/delete-project-alert-dialog";
import { CreateBoardDialog } from "@/components/boards/create-board-dialog";
import { UpdateBoardDialog } from "@/components/boards/update-board-dialog";
import { DeleteBoardAlertDialog } from "@/components/boards/delete-board-alert-dialog";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ slug: string; id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug, id } = await params;
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

  const isOwnerOrAdmin = membership[0].role === "owner" || membership[0].role === "admin";

  const projectBoards = await db
    .select()
    .from(boards)
    .where(eq(boards.projectId, id))
    .orderBy(boards.createdAt);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/org/${slug}`}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{project[0].name}</h1>
            {project[0].description && (
              <p className="text-sm text-muted-foreground">{project[0].description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isOwnerOrAdmin && <CreateBoardDialog orgSlug={slug} projectId={id} />}
          {isOwnerOrAdmin && (
            <DeleteProjectAlertDialog
              projectId={project[0].id}
              orgSlug={slug}
              projectName={project[0].name}
            />
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layout className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Boards</h2>
          <Badge variant="secondary" className="text-xs">{projectBoards.length}</Badge>
        </div>

        {projectBoards.length === 0 ? (
          <Card className="border-dashed">
            <CardHeader className="text-center">
              <CardTitle className="text-base">No boards yet</CardTitle>
              <CardDescription>
                Create your first board to start organizing tasks.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-6">
              {isOwnerOrAdmin && <CreateBoardDialog orgSlug={slug} projectId={id} />}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projectBoards.map((board) => (
              <Card key={board.id} className="group hover:shadow-md hover:border-primary/50 transition-all duration-200">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <Link href={`/org/${slug}/projects/${id}/boards/${board.id}`} className="flex-1 cursor-pointer min-w-0">
                    <div>
                      <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">{board.name}</CardTitle>
                      <CardDescription className="line-clamp-2 text-xs mt-1">
                        {board.description || "No description"}
                      </CardDescription>
                    </div>
                  </Link>
                  {isOwnerOrAdmin && (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <UpdateBoardDialog
                        boardId={board.id}
                        orgSlug={slug}
                        projectId={id}
                        currentName={board.name}
                        currentDescription={board.description}
                      />
                      <DeleteBoardAlertDialog
                        boardId={board.id}
                        orgSlug={slug}
                        projectId={id}
                        boardName={board.name}
                      />
                    </div>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
