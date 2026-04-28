import { profiles, organizations, organizationMembers, projects, boards, columns, cards, vaultEntries, vaultVersions } from "@/lib/db/schema";

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;

export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type NewOrganizationMember = typeof organizationMembers.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Board = typeof boards.$inferSelect;
export type NewBoard = typeof boards.$inferInsert;

export type Column = typeof columns.$inferSelect;
export type NewColumn = typeof columns.$inferInsert;

export type Card = typeof cards.$inferSelect;
export type NewCard = typeof cards.$inferInsert;

export type VaultEntry = typeof vaultEntries.$inferSelect;
export type NewVaultEntry = typeof vaultEntries.$inferInsert;

export type VaultVersion = typeof vaultVersions.$inferSelect;
export type NewVaultVersion = typeof vaultVersions.$inferInsert;
