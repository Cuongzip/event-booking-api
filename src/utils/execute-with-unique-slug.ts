import slugify from 'slugify';

interface Operation<T> {
  (slug: string): Promise<T>;
}
export const executeWithUniqueSlug = async <T>(
  s: string,
  constraint: string,
  operation: Operation<T>,
): Promise<T> => {
  const originSlug = slugify(s);
  let slug = originSlug;
  let suffix = 1;
  while (true) {
    try {
      return await operation(slug);
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'sqlState' in error &&
        error.sqlState === '23505' &&
        'constraint' in error &&
        error.constraint === constraint
      ) {
        suffix++;
        slug = originSlug + '-' + suffix;
        continue;
      }
      throw error;
    }
  }
};
