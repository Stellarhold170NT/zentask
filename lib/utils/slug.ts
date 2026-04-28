export function slugify(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "organization";
}

export async function generateUniqueSlug(
  name: string,
  isSlugTaken: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = slugify(name);

  if (!(await isSlugTaken(slug))) {
    return slug;
  }

  let counter = 2;
  while (await isSlugTaken(`${slug}-${counter}`)) {
    counter++;
  }

  return `${slug}-${counter}`;
}
