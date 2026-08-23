<script lang="ts">
  import { DEFAULT_LANG, getStoredLang, setLang, type Lang } from "../i18n/langStore";

  let lang = $state<Lang>(DEFAULT_LANG);

  if (typeof window !== "undefined") {
    lang = getStoredLang();
  }

  function select(next: Lang) {
    lang = next;
    setLang(next);
  }
</script>

<div
  class="glow-border flex items-center gap-1 rounded px-2 py-1"
  role="group"
  aria-label="Idioma / Language"
>
  <button
    type="button"
    class="hud-label px-1 text-[10px] transition-colors {lang === 'pt' ? 'text-accent' : 'text-text-dim hover:text-text'}"
    aria-pressed={lang === "pt"}
    onclick={() => select("pt")}
  >
    PT
  </button>
  <span aria-hidden="true" class="text-[10px] text-text-dim">/</span>
  <button
    type="button"
    class="hud-label px-1 text-[10px] transition-colors {lang === 'en' ? 'text-accent' : 'text-text-dim hover:text-text'}"
    aria-pressed={lang === "en"}
    onclick={() => select("en")}
  >
    EN
  </button>
</div>
