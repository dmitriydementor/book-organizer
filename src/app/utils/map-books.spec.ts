import { lowercaseKeys, mapBooks } from './map-books';

describe('Validate books mapping', () => {
  const rawObj = { TITLE: 'The Hobbit', Author: 'J.R.R. Tolkien', PAGES: '310' };

  it('should lowercase object peoperty names', () => {
    expect(
      Object.keys(
        lowercaseKeys(rawObj)
      ).join('-') === Object.keys(rawObj).map(k => k.toLowerCase()).join('-')
    ).toBe(true);
  });

  const rawXmlBooks = [
    { TITLE: 'The Hobbit', Author: 'J.R.R. Tolkien', PAGES: '310' },
    { title: '1984', AUTHOR: 'George Orwell', pages: 328 },
    { Title: 'Animal Farm', author: 'George Orwell', Pages: 112 }
  ];

  it('should map raw array to strictly typed array of books', () => {
    expect(
      mapBooks(rawXmlBooks).every(el => Object.keys(el).every(k => k === k.toLowerCase()))
    ).toBe(true);
  });


});
