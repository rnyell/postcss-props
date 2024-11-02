import type { AtRule } from "postcss";

export function getParams(text: string) {
  const regex = /\((.*?)\)/;
  const match = text.match(regex);

  if (match && match[1]) {
    return match[1];
  } else {
    return null;
  }
}

export function removeAtRule(atRule: AtRule, keep: boolean) {
  if (!keep) {
    atRule.remove();
  }
}
