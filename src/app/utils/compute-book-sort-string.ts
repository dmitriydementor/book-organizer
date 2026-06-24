import { Book } from '../pages/book-list-viewer/store/book.model';

export const computeBookSortString = (book: Book): string => {
  return `${book.author} - ${book.title}`;
};
