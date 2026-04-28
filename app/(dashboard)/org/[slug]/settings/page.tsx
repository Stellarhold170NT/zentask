import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { db } from "@/lib/db/db";
import { organizations, organizationMembers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UpdateOrgForm } from "@/components/organizations/update-org-form";

export const dynamic = "force-dynamic";

interface OrgSettingsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function OrgSettingsPage({ params }: OrgSettingsPageProps) {
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
  if (membership[0].role !== "owner" && membership[0].role !== "admin") {
    redirect(`/org/${slug}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/org/${slug}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Organization Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>
            Update your organization name and description.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateOrgForm
            slug={slug}
            currentName={org[0].name}
            currentDescription={org[0].description || ""}
          />
        </CardContent>
      </Card>
    </div>
  );
}
