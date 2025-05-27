export const opinionSearchableFields: string[] = [
  'title',
  'slug',
  'summary',
  'content',
  // Removed category.name and tags.name because they require nested filtering
];

export const opinionFilterableFields: string[] = [
  'title',
  'slug',
  'categoryId',
  'category',
  'authorId',
  'isPublished',  // true / false
  'createdAt',    // date range filtering
  'updatedAt',
];
