export function getParams(text: string) {
  const regex = /\((.*?)\)/;
  const match = text.match(regex);

  if (match && match[1]) {
    return match[1];
  } else {
    return null;
  }
}