/**
 * @description checks recursively if received object contains an array of objects with specified property names (case-insensetive)
 * Note: only first array which matches criteria will be returned
 * @param obj object, that can contain an array
 * @param propNames property names required in
 */
export const findArrayInNestedObject = (obj: any, propNames: string[]): any[] | null => {

  if (typeof obj !== 'object') {
    return null;
  }

  if (
    Array.isArray(obj) &&
    (obj as any[]).every(el => validatePropNames(el, propNames))
  ) {
    return obj as any[];
  }

  if (
    isArrayWithObjectType(obj) &&
    Object.values(obj).every(el => validatePropNames(el, propNames))
  ) {
    return obj as any[];
  }

  const objProps = Object.keys(obj);

  for (let index = 0; index < objProps.length; index++) {
    const element = obj[objProps[index]];


    const checkElement = findArrayInNestedObject(element, propNames);

    if (checkElement !== null) {
      return checkElement;
    }

  }


  return null;
};

/**
 *
 * @param obj
 * @param propNames list of property names
 * @returns boolean flag if object contains all required props
 */
export const validatePropNames = (obj: any, propNames: string[]): boolean => {
  const objPropNames = Object.keys(obj).map(k => k.toLowerCase()).sort();

  return propNames.sort().join('-') === objPropNames.join('-');
}

/**
 * @description checks if object can be an array with typeof === 'object', but containing array-like keys (0, 1, 2, 3 ...)
 * @param obj
 * @returns boolean result of checking each key of object is an index of array
 */
export function isArrayWithObjectType(obj: any) {
  const keys = Object.keys(obj);

  if (keys.length === 0) return false;

  return keys.every((el, index) => el === `${index}`);
}
