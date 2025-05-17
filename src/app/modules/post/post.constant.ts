export const postSearchableFields: string[] = [
  'title',
  'slug',
  'summary',
  'content',
  'category.name', // যদি category join করো
  'tags.name',     // যদি tag join করো
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

