import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function matchRoute(route: string, basePath: string, exact = false): boolean {
  if (exact) {
    return route === basePath;
  }

  const dashboardPattern = new RegExp(`^${basePath}(/[a-zA-Z0-9_-]+)*$`);

  return dashboardPattern.test(route);
}

export function radians_to_degrees(radians: number) {
  const pi = Math.PI;
  return radians * (180 / pi);
}

export function remapNumber(value: number, newMin: number, newMax = 1, oldMin = -1, oldMax = 1) {
  return newMin + ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin);
}

export const formatNumber = (num: number | undefined): string => {
  if (!num) return '0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: num < 1 ? 4 : 2,
  }).format(num);
};

export const formatSupply = (num: number | undefined): string => {
  if (!num) return '0';
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatLargeNumber = (num: number | undefined): string => {
  if (!num) return '0';

  if (num > 1_000_000_000) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(num);
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(num);
};
