import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Book } from './book.model';
import { computed } from '@angular/core';

import { computeBookSortString } from '@utils/compute-book-sort-string';
import { SortDirection } from '@angular/material/sort';

interface BookListState {
  books: Book[];
  filter: { query: string; order: SortDirection };
}

const initialState: BookListState = {
  books: [],
  filter: { query: '', order: '' },
};

export const BookListStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ books, filter }) => ({
    booksCount: computed(() => books().length),
    sortedBooks: computed(() => {
      const filteredBooks = [...books()].filter((b) => b.title.toLowerCase().includes(filter.query().toLowerCase()));
      if (filter.order() === '') {
        return filteredBooks;
      }
      const direction = filter.order() === 'asc' ? 1 : -1;

      const sortedBooks = filteredBooks.sort((a, b) => {
        return direction * computeBookSortString(a).localeCompare(computeBookSortString(b));
      });

      return sortedBooks;
    }),
  })),
  withMethods(store => ({
    booksLoaded(books: Book[]): void {
      patchState(store, () => ({
        books: [...books],
      }));
    },
    addBook(book: Book): void {
      patchState(store, state => ({
        books: [...state.books, { ...book, id: store.booksCount()  }],
      }));
    },
    editBook(book: Book): void {
      patchState(store, state => {
        const bookId = book.id;
        const index = state.books.findIndex(b => b.id === bookId);

        if (index === -1) return state;

        return {
          books: state.books.with(index, {
            ...state.books[index],
            ...book,
          }),
        };
      });
    },
    updateQuery(query: string): void {
      patchState(store, state => ({
        filter: { ...state.filter, query },
      }));
    },
    updateOrder(order: SortDirection): void {
      patchState(store, state => ({
        filter: { ...state.filter, order },
      }));
    },
  })),
);
