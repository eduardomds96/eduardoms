<script lang="ts">
  import { onMount } from "svelte";

  let container: HTMLDivElement;
  let canvasReady = $state(false);

  // Hand-rolled WebGL instead of three.js: the scene is just a ring, a
  // wireframe icosahedron and a crosshair, all flat-colored lines with no
  // lighting — three.js's ~130KB(gzip) baseline (Object3D/Scene graph, math
  // classes, materials it pulls in regardless of tree-shaking) buys nothing
  // here that a couple dozen lines of raw WebGL don't already cover.
  onMount(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const isNarrow = window.innerWidth < 768;

    if (!container || reducedMotion || coarsePointer || isNarrow) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height) return;

    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") as WebGLRenderingContext | null;
    if (!gl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);

    const vsSource = `
      attribute vec3 aPosition;
      uniform mat4 uMVP;
      void main() {
        gl_Position = uMVP * vec4(aPosition, 1.0);
      }
    `;
    const fsSource = `
      precision mediump float;
      uniform vec4 uColor;
      void main() {
        gl_FragColor = uColor;
      }
    `;

    function compile(type: number, src: string): WebGLShader | null {
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    }

    const vs = compile(gl.VERTEX_SHADER, vsSource);
    const fs = compile(gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs!);
    gl.attachShader(program, fs!);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // ---- column-major mat4 helpers (matches WebGL's native layout) ----
    function identity(): Float32Array {
      return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }

    function multiply(a: Float32Array, b: Float32Array): Float32Array {
      const out = new Float32Array(16);
      for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 4; row++) {
          out[col * 4 + row] =
            a[0 * 4 + row] * b[col * 4 + 0] +
            a[1 * 4 + row] * b[col * 4 + 1] +
            a[2 * 4 + row] * b[col * 4 + 2] +
            a[3 * 4 + row] * b[col * 4 + 3];
        }
      }
      return out;
    }

    function perspective(fovy: number, aspect: number, near: number, far: number): Float32Array {
      const f = 1 / Math.tan(fovy / 2);
      const out = new Float32Array(16);
      out[0] = f / aspect;
      out[5] = f;
      out[10] = (far + near) / (near - far);
      out[11] = -1;
      out[14] = (2 * far * near) / (near - far);
      return out;
    }

    function translate(x: number, y: number, z: number): Float32Array {
      const out = identity();
      out[12] = x;
      out[13] = y;
      out[14] = z;
      return out;
    }

    function rotateX(a: number): Float32Array {
      const c = Math.cos(a),
        s = Math.sin(a);
      return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
    }

    function rotateY(a: number): Float32Array {
      const c = Math.cos(a),
        s = Math.sin(a);
      return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
    }

    function rotateZ(a: number): Float32Array {
      const c = Math.cos(a),
        s = Math.sin(a);
      return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }

    // ---- geometry ----
    const PHI = (1 + Math.sqrt(5)) / 2;
    const icoVerts: [number, number, number][] = [
      [-1, PHI, 0],
      [1, PHI, 0],
      [-1, -PHI, 0],
      [1, -PHI, 0],
      [0, -1, PHI],
      [0, 1, PHI],
      [0, -1, -PHI],
      [0, 1, -PHI],
      [PHI, 0, -1],
      [PHI, 0, 1],
      [-PHI, 0, -1],
      [-PHI, 0, 1],
    ];
    const icoFaces = [
      [0, 11, 5],
      [0, 5, 1],
      [0, 1, 7],
      [0, 7, 10],
      [0, 10, 11],
      [1, 5, 9],
      [5, 11, 4],
      [11, 10, 2],
      [10, 7, 6],
      [7, 1, 8],
      [3, 9, 4],
      [3, 4, 2],
      [3, 2, 6],
      [3, 6, 8],
      [3, 8, 9],
      [4, 9, 5],
      [2, 4, 11],
      [6, 2, 10],
      [8, 6, 7],
      [9, 8, 1],
    ];
    const ICO_RADIUS = 1.2;
    function normalized(v: [number, number, number]): number[] {
      const len = Math.hypot(v[0], v[1], v[2]);
      return [(v[0] / len) * ICO_RADIUS, (v[1] / len) * ICO_RADIUS, (v[2] / len) * ICO_RADIUS];
    }
    const seenEdges = new Set<string>();
    const icoEdgeVerts: number[] = [];
    icoFaces.forEach(([a, b, c]) => {
      ([[a, b], [b, c], [c, a]] as const).forEach(([i, j]) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seenEdges.has(key)) return;
        seenEdges.add(key);
        icoEdgeVerts.push(...normalized(icoVerts[i]), ...normalized(icoVerts[j]));
      });
    });

    const RING_RADIUS = 1.63;
    const RING_SEGMENTS = 64;
    const ringVerts: number[] = [];
    for (let i = 0; i < RING_SEGMENTS; i++) {
      const a0 = (i / RING_SEGMENTS) * Math.PI * 2;
      const a1 = ((i + 1) / RING_SEGMENTS) * Math.PI * 2;
      ringVerts.push(Math.cos(a0) * RING_RADIUS, Math.sin(a0) * RING_RADIUS, 0);
      ringVerts.push(Math.cos(a1) * RING_RADIUS, Math.sin(a1) * RING_RADIUS, 0);
    }

    const crossVerts = [-0.25, 0, 0, 0.25, 0, 0, 0, -0.25, 0, 0, 0.25, 0];

    function makeBuffer(data: number[]): WebGLBuffer {
      const buf = gl!.createBuffer()!;
      gl!.bindBuffer(gl!.ARRAY_BUFFER, buf);
      gl!.bufferData(gl!.ARRAY_BUFFER, new Float32Array(data), gl!.STATIC_DRAW);
      return buf;
    }

    const icoBuffer = makeBuffer(icoEdgeVerts);
    const ringBuffer = makeBuffer(ringVerts);
    const crossBuffer = makeBuffer(crossVerts);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    const uMVP = gl.getUniformLocation(program, "uMVP");
    const uColor = gl.getUniformLocation(program, "uColor");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.viewport(0, 0, canvas.width, canvas.height);

    const proj = perspective((45 * Math.PI) / 180, width / height, 0.1, 100);
    const view = translate(0, 0, -6);
    const viewProj = multiply(proj, view);

    const GREEN = [0x7f / 255, 0xbf / 255, 0x3f / 255, 1] as const;
    const YELLOW = [0xe8 / 255, 0xc5 / 255, 0x47 / 255, 1] as const;

    function drawLines(buffer: WebGLBuffer, vertCount: number, model: Float32Array, color: readonly number[], alpha: number) {
      gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer);
      gl!.enableVertexAttribArray(aPosition);
      gl!.vertexAttribPointer(aPosition, 3, gl!.FLOAT, false, 0, 0);
      gl!.uniformMatrix4fv(uMVP, false, multiply(viewProj, model));
      gl!.uniform4f(uColor, color[0], color[1], color[2], alpha);
      gl!.drawArrays(gl!.LINES, 0, vertCount);
    }

    let icoRotY = 0;
    let icoRotX = 0;
    let ringRotZ = 0;
    let frameId: number;

    function frame() {
      gl!.clear(gl!.COLOR_BUFFER_BIT);

      icoRotY += 0.0025;
      icoRotX += 0.0012;
      ringRotZ -= 0.0018;

      drawLines(ringBuffer, ringVerts.length / 3, rotateZ(ringRotZ), GREEN, 0.8);
      drawLines(icoBuffer, icoEdgeVerts.length / 3, multiply(rotateY(icoRotY), rotateX(icoRotX)), GREEN, 0.9);
      drawLines(crossBuffer, 4, identity(), YELLOW, 1);

      frameId = requestAnimationFrame(frame);
    }
    frame();
    canvasReady = true;

    return () => {
      cancelAnimationFrame(frameId);
      container?.removeChild(canvas);
    };
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
