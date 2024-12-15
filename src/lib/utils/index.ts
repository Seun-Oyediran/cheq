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
