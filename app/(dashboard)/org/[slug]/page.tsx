import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, FolderKanban, Plus, Trash2, Settings } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { db } from "@/lib/db/db";
import { organizations, organizationMembers, projects, profiles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { InviteMemberDialog } from "@/components/organizations/invite-member-dialog";
import { RemoveMemberButton } from "@/components/organizations/remove-member-button";
import { DeleteOrgAlertDialog } from "@/components/organizations/delete-org-alert-dialog";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { UpdateProjectDialog } from "@/components/projects/update-project-dialog";

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{org[0].name}</h1>
          {org[0].description && (
            <p className="text-sm text-muted-foreground">{org[0].description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isOwnerOrAdmin && (
            <Link href={`/org/${slug}/settings`}>
              <Button variant="outline" size="sm" className="h-8">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Members</h2>
          <Badge variant="secondary" className="text-xs">{members.length}</Badge>
          {isOwnerOrAdmin && <InviteMemberDialog orgSlug={slug} />}
        </div>

        <div className="grid gap-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {member.fullName?.charAt(0) || member.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{member.fullName || member.email}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={member.role === "owner" ? "default" : "secondary"} className="capitalize text-xs">
                  {member.role}
                </Badge>
                {isOwnerOrAdmin && (
                  <RemoveMemberButton
                    orgSlug={slug}
                    userId={member.userId}
                    isSelf={member.userId === user.id}
                    isLastOwner={member.role === "owner" && members.filter((m) => m.role === "owner").length <= 1}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Projects</h2>
            <Badge variant="secondary" className="text-xs">{orgProjects.length}</Badge>
          </div>
          {isOwnerOrAdmin && <CreateProjectDialog orgSlug={slug} />}
        </div>

        {orgProjects.length === 0 ? (
          <Card className="border-dashed">
            <CardHeader className="text-center">
              <CardTitle className="text-base">No projects yet</CardTitle>
              <CardDescription>
                Create your first project to start managing tasks.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-6">
              {isOwnerOrAdmin && <CreateProjectDialog orgSlug={slug} />}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orgProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-md hover:border-primary/50 transition-all duration-200">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <Link href={`/org/${slug}/projects/${project.id}`} className="flex-1 cursor-pointer min-w-0">
                    <div>
                      <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-2 text-xs mt-1">
                        {project.description || "No description"}
                      </CardDescription>
                    </div>
                  </Link>
                  {isOwnerOrAdmin && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <UpdateProjectDialog
                        projectId={project.id}
                        orgSlug={slug}
                        currentName={project.name}
                        currentDescription={project.description}
                      />
                    </div>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

      {isOwner && (
        <div className="space-y-4 pt-4 border-t">
          <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
          <Card className="border-destructive/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Delete Organization</CardTitle>
              <CardDescription className="text-xs">
                This will permanently delete the organization, all projects, and all data.
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
