export type Lang = "pt" | "en";

export const DEFAULT_LANG: Lang = "pt";

const STORAGE_KEY = "eduardoms:lang";

export function getStoredLang(): Lang {
  if (typeof localStorage === "undefined") return DEFAULT_LANG;
  return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : DEFAULT_LANG;
}

export function setLang(lang: Lang): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  window.dispatchEvent(new CustomEvent<Lang>("langchange", { detail: lang }));
}
