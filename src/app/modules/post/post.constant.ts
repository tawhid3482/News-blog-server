export const postSearchableFields: string[] = [
  'title',
  'slug',
  'summary',
  'content',
  // Removed category.name and tags.name because they require nested filtering
];

export const postFilterableFields: string[] = [
  'title',
  'slug',
  'categoryId',
  'authorId',
  'status',       // draft, published
  'isPublished',  // true / false
  'createdAt',    // date range filtering
  'updatedAt',
];
