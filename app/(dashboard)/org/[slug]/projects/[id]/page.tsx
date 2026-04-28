import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { db } from "@/lib/db/db";
import { organizations, organizationMembers, projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteProjectAlertDialog } from "@/components/projects/delete-project-alert-dialog";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/org/${slug}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{project[0].name}</h1>
            {project[0].description && (
              <p className="text-sm text-muted-foreground">{project[0].description}</p>
            )}
          </div>
        </div>
        {isOwnerOrAdmin && (
          <DeleteProjectAlertDialog
            projectId={project[0].id}
            orgSlug={slug}
            projectName={project[0].name}
          />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kanban Board</CardTitle>
          <CardDescription>
            Boards will be implemented in Phase 3.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is a placeholder for the Kanban board. In the next phase, you will be able to create boards,
            columns, and cards for this project.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
