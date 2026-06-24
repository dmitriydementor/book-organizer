import { Book } from '../pages/book-list-viewer/store/book.model';

export function lowercaseKeys(obj: Record<string, any>): Record<string, any> {
  return Object.keys(obj).reduce(
    (acc, key) => {
      acc[key.toLowerCase()] = obj[key];
      return acc;
    },
    {} as Record<string, any>,
  );
}

export function mapBooks(rawBooks: any[]): Book[] {
  return rawBooks.map((rawBook, index) => {
    const lowercased = lowercaseKeys(rawBook);

    return {
      title: String(lowercased['title'] || ''),
      author: String(lowercased['author'] || ''),
      pages: Number(lowercased['pages'] || 0),
      id: index,
    };
  });
}
