import { validatePropNames, findArrayInNestedObject, isArrayWithObjectType } from './validate-parsed';

describe('Validate parsed books object', () => {
  const arrayWithObjectType = {
    0: { title: 'Murder on the Orient Express', author: 'Agatha Christie', pages: 256 },
    1: { title: 'And Then There Were None', author: 'Agatha Christie', pages: 272 },
    2: { title: 'Death on the Nile', author: 'Agatha Christie', pages: 333 },
  };

  const notAnArrayWithObjectType = {
    0: { title: 'Murder on the Orient Express', author: 'Agatha Christie', pages: 256 },
    '22': { title: 'And Then There Were None', author: 'Agatha Christie', pages: 272 },
    2: { title: 'Death on the Nile', author: 'Agatha Christie', pages: 333 },
  };

  it('should check if object can be array and return true', () => {
    expect(isArrayWithObjectType(arrayWithObjectType)).toBe(true);
  });

  it('should check if object can be array and return false', () => {
    expect(isArrayWithObjectType(notAnArrayWithObjectType)).toBe(false);
  });

  it('should check if object can be array and return false', () => {
    expect(isArrayWithObjectType({})).toBe(false);
  });

  const validObjWithPropNames = { title: 'Murder on the Orient Express', author: 'Agatha Christie', pages: 256 };

  it('should validate if all prop names are present in valid object, returns true', () => {
    expect(validatePropNames(validObjWithPropNames, ['title', 'author', 'pages'])).toBe(true);
  });

  const invalidObjWithPropNames = { title1: 'Murder on the Orient Express', author: 'Agatha Christie', pages: 256 };

  it('should validate if all prop names are present in invalid object, returns false', () => {
    expect(validatePropNames(invalidObjWithPropNames, ['title', 'author', 'pages'])).toBe(false);
  });

  it('should validate if all prop names are present in invalid object, returns false', () => {
    expect(validatePropNames({ ...validObjWithPropNames, someProp: 1 }, ['title', 'author', 'pages'])).toBe(false);
  });

  it('should validate if all prop names are present in invalid object, returns false', () => {
    expect(validatePropNames({}, ['title', 'author', 'pages'])).toBe(false);
  });

  const nestedObjectwithAnArray = {
    someProp: {
      NestedProperty: {
        a: 1,
        AnotherNestedProp: {
          title: 'aaa',
          thisIsArraytoBeFound: [{ result: 'ok' }],
        },
      },
    },
  };

  it('should return the array with specified object prop names from nested structure', () => {
    expect(findArrayInNestedObject(nestedObjectwithAnArray, ['result'])).toBeTruthy();
  });

  it('should return null from nested structure if no array was found', () => {
    expect(findArrayInNestedObject({ noArray: { nestedProp: [] } }, ['result'])?.length).toBe(0);
  });
});
