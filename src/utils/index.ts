export function isPlainObject(value: unknown): value is object {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isEqual(obj1: unknown, obj2: unknown): boolean {
  // Сравнение NaN
  if (typeof obj1 === "number" && typeof obj2 === "number" && isNaN(obj1) && isNaN(obj2)) {
    return true;
  }

  // Базовое сравнение (ссылки, примитивы)
  if (obj1 === obj2) return true;

  // Проверка null и не-объектов
  if (obj1 == null || typeof obj1 !== "object" ||
    obj2 == null || typeof obj2 !== "object") {
    return false;
  }

  // Проверка типов (массив vs не-массив)
  if (Array.isArray(obj1) !== Array.isArray(obj2)) {
    return false;
  }

  // Рекурсивное сравнение массивов
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    for (let i = 0; i < obj1.length; i++) {
      if (!isEqual(obj1[i], obj2[i])) return false;
    }

    return true;
  }

  // Сравнение обычных объектов
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !isEqual((obj1 as Record<string, unknown>)[key], (obj2 as Record<string, unknown>)[key])) {
      return false;
    }
  }

  return true;
}


type SIndexed = Record<string, unknown>;

export const set = (object: SIndexed | unknown, path: string, value: unknown): SIndexed | unknown => {
  if (typeof path !== "string") {
    throw new Error("path must be string");
  }

  if (typeof object !== "object" || object === null) {
    return object;
  }

  const keys = path.split(".");
  let current = object as SIndexed;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!Object.prototype.hasOwnProperty.call(current, key) ||
      typeof current[key] !== "object" ||
      current[key] === null) {
      current[key] = {};
    }

    current = current[key] as SIndexed;
  }

  const lastKey = keys[keys.length - 1];

  current[lastKey] = value;

  return object;
};
