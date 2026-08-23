<script lang="ts">
  import { onMount } from "svelte";
  import gsap from "gsap";

  interface Props {
    value: number;
    suffix?: string;
  }

  let { value, suffix = "" }: Props = $props();
  let el: HTMLSpanElement;

  onMount(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      if (el) el.textContent = `${value}${suffix}`;
      return;
    }

    const counter = { n: 0 };
    let animated = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            gsap.to(counter, {
              n: value,
              duration: 1.4,
              ease: "power2.out",
              onUpdate: () => {
                if (el) el.textContent = `${Math.round(counter.n)}${suffix}`;
              },
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    if (el) observer.observe(el);

    return () => observer.disconnect();
  });
</script>

<span bind:this={el} class="tabular-nums">0{suffix}</span>
