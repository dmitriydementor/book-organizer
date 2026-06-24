import { Book } from '../pages/book-list-viewer/store/book.model';
import { computeBookSortString } from './compute-book-sort-string';

describe('Compute book sort string', () => {
  const b: Book = {
    author: 'TEST AUTHOR',
    title: 'TITLE',
    pages: 200,
    id: 0,
  };

  it('should return sort string', () => {
    expect(computeBookSortString(b)).toBe('TEST AUTHOR - TITLE');
  });
});
