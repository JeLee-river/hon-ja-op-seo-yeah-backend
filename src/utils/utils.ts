export function getRandomImagePath(
  defaultImagePath1: string,
  defaultImagePath2: string,
) {
  const randomIndex = Math.floor(Math.random() * 2) + 1;
  return randomIndex === 1 ? defaultImagePath1 : defaultImagePath2;
}
