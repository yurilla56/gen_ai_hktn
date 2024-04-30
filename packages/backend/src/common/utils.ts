export const parseTextToList = (text: string): string[] => {
  const items = text
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item.startsWith('-'))
    .map((item) => item.substring(2).trim());
  return items;
};
