<script lang="ts">
  import { onMount } from "svelte";

  let container: HTMLDivElement;
  let canvasReady = $state(false);

  onMount(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const isNarrow = window.innerWidth < 768;
    const hasWebGL = (() => {
      try {
        const canvas = document.createElement("canvas");
        return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
      } catch {
        return false;
      }
    })();

    if (reducedMotion || coarsePointer || isNarrow || !hasWebGL) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import("three");
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 6;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(1.6, 1.66, 64),
        new THREE.MeshBasicMaterial({
          color: 0x7fbf3f,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8,
        })
      );
      scene.add(ring);

      const wireframe = new THREE.LineSegments(
        new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.2, 0)),
        new THREE.LineBasicMaterial({ color: 0x7fbf3f, transparent: true, opacity: 0.9 })
      );
      scene.add(wireframe);

      const crossMat = new THREE.LineBasicMaterial({ color: 0xe8c547 });
      const hLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-0.25, 0, 0),
          new THREE.Vector3(0.25, 0, 0),
        ]),
        crossMat
      );
      const vLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, -0.25, 0),
          new THREE.Vector3(0, 0.25, 0),
        ]),
        crossMat
      );
      scene.add(hLine, vLine);

      let frameId: number;
      const animate = () => {
        wireframe.rotation.y += 0.0025;
        wireframe.rotation.x += 0.0012;
        ring.rotation.z -= 0.0018;
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };
      animate();
      canvasReady = true;

      cleanup = () => {
        cancelAnimationFrame(frameId);
        renderer.dispose();
        container?.removeChild(renderer.domElement);
      };
    })();

    return () => cleanup?.();
  });
</script>

<div class="relative aspect-square w-full max-w-md" data-hero-visual bind:this={container}>
  <svg
    viewBox="0 0 200 200"
    class="absolute inset-0 h-full w-full transition-opacity duration-500 {canvasReady
      ? 'opacity-0'
      : 'opacity-100'}"
    aria-hidden="true"
  >
    <circle cx="100" cy="100" r="70" fill="none" stroke="#4d7526" stroke-width="1" />
    <circle cx="100" cy="100" r="50" fill="none" stroke="#7fbf3f" stroke-width="1" stroke-dasharray="4 6" />
    <line x1="100" y1="10" x2="100" y2="35" stroke="#7fbf3f" stroke-width="1.5" />
    <line x1="100" y1="165" x2="100" y2="190" stroke="#7fbf3f" stroke-width="1.5" />
    <line x1="10" y1="100" x2="35" y2="100" stroke="#7fbf3f" stroke-width="1.5" />
    <line x1="165" y1="100" x2="190" y2="100" stroke="#7fbf3f" stroke-width="1.5" />
    <circle cx="100" cy="100" r="3" fill="#e8c547" />
    <polygon points="100,60 130,100 100,140 70,100" fill="none" stroke="#7fbf3f" stroke-width="1" />
  </svg>
</div>
