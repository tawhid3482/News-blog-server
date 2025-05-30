export const postSearchableFields: string[] = [
  "title",
  "slug",
  "summary",
  "content",
  // Removed category.name and tags.name because they require nested filtering
];

export const postFilterableFields: string[] = [
  "title",
  "slug",
  "categoryId",
  "category",
  "authorId",
  "status", // draft, published
  "isPublished", // true / false
  "createdAt", // date range filtering
  "updatedAt",
];

export const noImage =
  "https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg";
