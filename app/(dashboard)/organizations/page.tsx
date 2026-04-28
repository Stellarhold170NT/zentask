import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Building2 } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { db } from "@/lib/db/db";
import { organizations, organizationMembers } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateOrgDialog } from "@/components/organizations/create-org-dialog";

export const dynamic = "force-dynamic";

export default async function OrganizationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const userOrgs = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      slug: organizations.slug,
      description: organizations.description,
      role: organizationMembers.role,
      createdAt: organizations.createdAt,
    })
    .from(organizationMembers)
    .innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
    .where(eq(organizationMembers.userId, user.id))
    .orderBy(desc(organizations.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Organizations</h1>
        <Link href="/organizations?create=true">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Organization
          </Button>
        </Link>
      </div>

      {userOrgs.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Create your first organization to start managing projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/organizations?create=true">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Organization
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userOrgs.map((org) => (
            <Link key={org.id} href={`/org/${org.slug}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{org.name}</CardTitle>
                    <CardDescription className="text-xs font-mono">/{org.slug}</CardDescription>
                  </div>
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {org.description ? (
                    <p className="text-sm text-muted-foreground line-clamp-2">{org.description}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No description</p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground capitalize">{org.role}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
      <CreateOrgDialog />
    </div>
  );
}
