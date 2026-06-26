import { inject, Injectable } from '@angular/core';
import { XMLParser } from 'fast-xml-parser';
import XMLBuilder from 'fast-xml-builder';
import { findArrayInNestedObject } from '@utils/validate-parsed';
import { BookListStore } from '../pages/book-list-viewer/store/book-list.store';
import { mapBooks } from '@utils/map-books';

const REQUIRED_FIELDS = ['title', 'author', 'pages'];

const parserOptions = {
  ignoreAttributes: true, // Preserve XML attributes (like id="101")
  attributeNamePrefix: '', // Remove prefixes like '@_' or '$' from attributes
  parseAttributeValue: true, // Convert numeric strings into numbers automatically
};

const builderOptions =  {
  arrayNodeName: 'book',
};


@Injectable()
export class BookProcessingService {
  bookListStore = inject(BookListStore);

  private parser = new XMLParser(parserOptions);

  processXmlFile(file: File) {
    if (file.type !== 'text/xml') {
      throw new Error('Wrong XML file type');
    }
    const reader = new FileReader();

    reader.onload = (ev: ProgressEvent<FileReader>) => {
      const xmlString = ev.target?.result;

      if (xmlString) {
        try {
          const parsedObject = this.parser.parse(xmlString as string);

          const validated = findArrayInNestedObject(parsedObject, REQUIRED_FIELDS);

          if (!validated?.length) {
            throw new Error('Cant find books in file');
          }

          const mappedBooks = mapBooks(validated);
          this.bookListStore.booksLoaded(mappedBooks);
        } catch (error) {
          console.error('Failed to parse XML:', error);
          throw error;
        }
      }
    };

    reader.readAsText(file);
  }

  saveToXml() {
    const books = this.bookListStore.sortedBooks()
          .map(({ title, author, pages }) => ({ title, author, pages })); // without id

    const builder = new XMLBuilder(builderOptions);

    const xmlStr = builder.build({ root: { books} });

    const blob = new Blob([
      `<?xml version="1.0" encoding="UTF-8" ?>\n` + xmlStr
    ], { type: 'application/xml;charset=utf-8;' });

    const objectUrl = window.URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = 'books.xml';

    // emulate click
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // clear resources
    window.URL.revokeObjectURL(objectUrl);
  }
}
