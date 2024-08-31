import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { omitBy, isUndefined } from 'lodash';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanObject<T extends object>(obj: T): Partial<T> {
  return omitBy(obj, isUndefined) as Partial<T>;
}
