import { inject, Injectable } from '@angular/core';
import { XMLParser } from 'fast-xml-parser';
import { findArrayInNestedObject } from '@utils/validate-parsed';
import { BookListStore } from '../pages/book-list-viewer/store/book-list.store';
import { mapBooks } from '@utils/map-books';

const REQUIRED_FIELDS = ['title', 'author', 'pages'];

@Injectable()
export class BookProcessingService {
  bookListStore = inject(BookListStore);

  processXmlFile(file: File) {
    if (file.type !== 'text/xml') {
      throw new Error('Wrong XML file type');
    }
    const reader = new FileReader();

    reader.onload = (ev: ProgressEvent<FileReader>) => {
      const xmlString = ev.target?.result;

      const options = {
        ignoreAttributes: true, // Preserve XML attributes (like id="101")
        attributeNamePrefix: '', // Remove prefixes like '@_' or '$' from attributes
        parseAttributeValue: true, // Convert numeric strings into numbers automatically
      };

      const parser = new XMLParser(options);

      if (xmlString) {
        try {
          const parsedObject = parser.parse(xmlString as string);

          const validated = findArrayInNestedObject(parsedObject, REQUIRED_FIELDS);

          if (!validated?.length) {
            throw new Error('Cant find books in file');
          }

          const mappedBooks = mapBooks(validated);
          this.bookListStore.booksLoaded(mappedBooks);

          console.log(validated);
        } catch (error) {
          console.error('Failed to parse XML:', error);
          throw error;
        }
      }
    };

    reader.readAsText(file);
  }
}
