import { siteContent } from "../content/site";
import { getStoredLang, type Lang } from "./langStore";

function resolvePath(path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as object)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, siteContent);
}

function pick(path: string, lang: Lang): string | undefined {
  const value = resolvePath(path);
  if (value && typeof value === "object" && lang in (value as object)) {
    return (value as Record<Lang, string>)[lang];
  }
  return undefined;
}

function applyLangToDom(lang: Lang): void {
  document.documentElement.lang = lang;

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const path = el.dataset.i18n;
    if (!path) return;
    const text = pick(path, lang);
    if (text !== undefined) el.textContent = text;
  });

  // format: data-i18n-attr="attrName:content.path"
  document.querySelectorAll<HTMLElement>("[data-i18n-attr]").forEach((el) => {
    const spec = el.dataset.i18nAttr;
    if (!spec) return;
    const [attr, path] = spec.split(":");
    const text = pick(path, lang);
    if (attr && text !== undefined) el.setAttribute(attr, text);
  });
}

export function initLang(): void {
  const lang = getStoredLang();
  applyLangToDom(lang);
  window.addEventListener("langchange", (event) => {
    applyLangToDom((event as CustomEvent<Lang>).detail);
  });
}
