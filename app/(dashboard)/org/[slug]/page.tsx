import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, FolderKanban, Plus, Trash2, MoreHorizontal } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { db } from "@/lib/db/db";
import { organizations, organizationMembers, projects, profiles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { InviteMemberDialog } from "@/components/organizations/invite-member-dialog";
import { DeleteOrgAlertDialog } from "@/components/organizations/delete-org-alert-dialog";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";

export const dynamic = "force-dynamic";

interface OrgPageProps {
  params: Promise<{ slug: string }>;
}

export default async function OrgPage({ params }: OrgPageProps) {
  const { slug } = await params;
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

  const isOwnerOrAdmin = membership[0].role === "owner" || membership[0].role === "admin";
  const isOwner = membership[0].role === "owner";

  const members = await db
    .select({
      id: organizationMembers.id,
      userId: organizationMembers.userId,
      role: organizationMembers.role,
      email: profiles.email,
      fullName: profiles.fullName,
    })
    .from(organizationMembers)
    .innerJoin(profiles, eq(organizationMembers.userId, profiles.userId))
    .where(eq(organizationMembers.organizationId, org[0].id));

  const orgProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.organizationId, org[0].id))
    .orderBy(projects.createdAt);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Members</h2>
            <Badge variant="secondary">{members.length}</Badge>
          </div>
          {isOwnerOrAdmin && <InviteMemberDialog orgSlug={slug} />}
        </div>

        <div className="grid gap-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {member.fullName?.charAt(0) || member.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{member.fullName || member.email}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <Badge variant={member.role === "owner" ? "default" : "secondary"} className="capitalize">
                {member.role}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Projects</h2>
            <Badge variant="secondary">{orgProjects.length}</Badge>
          </div>
          <CreateProjectDialog orgSlug={slug} />
        </div>

        {orgProjects.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No projects yet</CardTitle>
              <CardDescription>
                Create your first project to start managing tasks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateProjectDialog orgSlug={slug} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orgProjects.map((project) => (
              <Link key={project.id} href={`/org/${slug}/projects/${project.id}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {isOwner && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-destructive">Danger Zone</h2>
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle>Delete Organization</CardTitle>
              <CardDescription>
                This will permanently delete the organization, all projects, and all data. This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DeleteOrgAlertDialog orgName={org[0].name} orgSlug={slug} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
