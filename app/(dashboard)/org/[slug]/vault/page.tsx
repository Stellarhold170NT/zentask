import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Shield, Plus, Pencil, Trash2, History } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { db } from "@/lib/db/db";
import { organizations, organizationMembers, projects, vaultEntries, vaultVersions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateVaultEntryDialog } from "@/components/vault/create-vault-entry-dialog";
import { UpdateVaultEntryDialog } from "@/components/vault/update-vault-entry-dialog";
import { DeleteVaultEntryAlert } from "@/components/vault/delete-vault-entry-alert";
import { VaultVersionHistory } from "@/components/vault/vault-version-history";

export const dynamic = "force-dynamic";

interface VaultPageProps {
  params: Promise<{ slug: string }>;
}

export default async function VaultPage({ params }: VaultPageProps) {
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
  if (!isOwnerOrAdmin) redirect(`/org/${slug}`);

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

  const orgProjects = await db
    .select({ id: projects.id, name: projects.name })
    .from(projects)
    .where(eq(projects.organizationId, org[0].id));

  const projectMap = new Map(orgProjects.map((p) => [p.id, p.name]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/org/${slug}`}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Vault</h2>
            <Badge variant="secondary" className="text-xs">{entries.length}</Badge>
          </div>
        </div>
        {isOwnerOrAdmin && (
          <CreateVaultEntryDialog orgSlug={slug} projects={orgProjects} />
        )}
      </div>

      {entries.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <CardTitle className="text-base">No env variables yet</CardTitle>
            <CardDescription>
              Store environment variables and secrets for your organization.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            {isOwnerOrAdmin && (
              <CreateVaultEntryDialog orgSlug={slug} projects={orgProjects} />
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <Card key={entry.id} className="group hover:shadow-md hover:border-primary/50 transition-all duration-200">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-semibold truncate">{entry.key}</CardTitle>
                  <CardDescription className="text-xs mt-1 truncate font-mono">
                    {entry.value}
                  </CardDescription>
                  {entry.projectId && (
                    <Badge variant="outline" className="text-[10px] mt-2">
                      {projectMap.get(entry.projectId) || "Unknown project"}
                    </Badge>
                  )}
                </div>
                {isOwnerOrAdmin && (
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <UpdateVaultEntryDialog
                      entryId={entry.id}
                      orgSlug={slug}
                      currentKey={entry.key}
                      currentValue={entry.value}
                    />
                    <VaultVersionHistory
                      entryId={entry.id}
                      orgSlug={slug}
                      entryKey={entry.key}
                    />
                    <DeleteVaultEntryAlert
                      entryId={entry.id}
                      orgSlug={slug}
                      entryKey={entry.key}
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <p className="text-[10px] text-muted-foreground">
                  Updated {entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString() : "—"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
