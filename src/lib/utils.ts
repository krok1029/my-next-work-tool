import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import omitBy from 'lodash-es/omitBy';
import isUndefined from 'lodash-es/isUndefined';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanObject<T extends object>(obj: T): Partial<T> {
  return omitBy(obj, isUndefined) as Partial<T>;
}
