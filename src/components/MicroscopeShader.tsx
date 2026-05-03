import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
precision highp float;
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = (a_position + 1.0) * 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;
varying vec2 v_uv;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_clickFlash;

#define PI 3.141592653589793

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 19.19);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm3(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 3; i++) {
    v += a * vnoise(p);
    p = rot * p * 2.0 + vec2(100.0);
    a *= 0.5;
  }
  return v;
}

float fbm2(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 2; i++) {
    v += a * vnoise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

vec3 cells(vec2 p, float t, float flash) {
  float scale = 4.0;
  float thickness = 0.15 + 0.05 * sin(t * 0.3);
  vec2 fp = fract(p * scale) - 0.5;
  vec2 id = floor(p * scale);
  vec3 color = vec3(0.0);
  for (int dy = -1; dy <= 1; dy++) {
    for (int dx = -1; dx <= 1; dx++) {
      vec2 nb = vec2(float(dx), float(dy));
      vec2 cid = id + nb;
      float rnd = hash21(cid);
      vec2 center = nb + vec2(rnd * 2.0 - 1.0, fract(rnd * 17.0) * 2.0 - 1.0) * 0.4;
      float d = length(fp - center);
      float angle = atan(fp.y - center.y, fp.x - center.x);
      float nucleusMask = smoothstep(0.12, 0.12 + thickness * 0.5, d);
      float membrane = abs(d - 0.35 - 0.1 * sin(angle * 3.0 + t * 0.5 + rnd * 10.0));
      float membraneMask = smoothstep(thickness, thickness + 0.02, membrane);
      float rnd2 = hash21(cid + vec2(13.0, 37.0));
      nucleusMask *= 0.6 + 0.4 * sin(t * 0.8 + rnd * 10.0);
      nucleusMask *= 0.8 + flash * 0.2;
      color += mix(vec3(0.0, 0.3, 0.2), vec3(0.0, 0.7, 0.5), smoothstep(0.1, 0.35, d)) * (1.0 - nucleusMask) * (0.3 + 0.7 * rnd2);
      color += mix(vec3(0.0, 0.1, 0.1), vec3(0.0, 0.4, 0.3), smoothstep(0.0, thickness, d)) * (1.0 - membraneMask) * (0.15 + 0.1 * sin(t + rnd * 20.0));
    }
  }
  return color;
}

vec3 tissue(vec2 p, float t, float flash) {
  float n1 = fbm3(p * 3.0 + vec2(t * 0.02, t * 0.03));
  float n2 = fbm3(p * 6.0 + vec2(-t * 0.01, t * 0.04) + 50.0);
  float pattern = n1 * 0.5 + n2 * 0.25;
  float fiber = smoothstep(0.3, 0.7, pattern);
  float v = fiber * (0.5 + flash * 0.3);
  return vec3(0.0, 0.1 + v * 0.3, 0.1 + v * 0.4) + vec3(0.0, 0.05, 0.05) * fbm3(p * 10.0);
}

vec3 vessels(vec2 p, float t, float flash) {
  vec3 col = vec3(0.0);
  float scale = 3.0;
  vec2 fp = fract(p * scale) - 0.5;
  vec2 id = floor(p * scale);
  float rnd = hash21(id);
  float angle = rnd * PI * 2.0 + t * 0.1;
  vec2 dir = vec2(cos(angle), sin(angle));
  vec2 perp = vec2(-dir.y, dir.x);
  float along = dot(fp, dir);
  float across = dot(fp, perp);
  float mainVessel = abs(across) - 0.05 * (1.0 - smoothstep(-0.3, 0.3, along));
  mainVessel = smoothstep(0.02, 0.025, mainVessel);
  float flow = sin(along * 15.0 - t * 2.0) * 0.5 + 0.5;
  col += vec3(0.0, 0.2, 0.15) * (1.0 - mainVessel) * (0.3 + 0.7 * flow) * (0.6 + flash * 0.4);
  float branch1 = abs(across - 0.15 + along * 0.3) - 0.02;
  branch1 = smoothstep(0.01, 0.015, branch1);
  col += vec3(0.0, 0.15, 0.1) * (1.0 - branch1) * 0.4 * (0.5 + flash * 0.3);
  float branch2 = abs(across + 0.12 + along * 0.2) - 0.015;
  branch2 = smoothstep(0.008, 0.012, branch2);
  col += vec3(0.0, 0.12, 0.1) * (1.0 - branch2) * 0.3 * (0.4 + flash * 0.3);
  return col;
}

vec3 stain(vec2 p, float t) {
  float n = fbm2(p * 2.0 + vec2(t * 0.05, t * 0.03));
  float mask = smoothstep(0.5, 0.8, n);
  return vec3(0.0, 0.08, 0.06) * mask * 0.5;
}

vec3 bacteria(vec2 p, float t) {
  vec3 col = vec3(0.0);
  float scale = 8.0;
  vec2 fp = fract(p * scale) - 0.5;
  vec2 id = floor(p * scale);
  float rnd = hash21(id);
  if (rnd > 0.85) {
    vec2 center = vec2(fract(rnd * 17.0) - 0.5, fract(rnd * 31.0) - 0.5);
    float d = length(fp - center);
    float bac = smoothstep(0.03, 0.035, d);
    float pulse = sin(t * 2.0 + rnd * 10.0) * 0.3 + 0.7;
    col = vec3(0.0, 0.5, 0.4) * (1.0 - bac) * pulse * 0.6;
  }
  return col;
}

void main() {
  vec2 uv = v_uv;
  vec2 viewUV = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
  float aspect = u_resolution.x / u_resolution.y;
  float mouseShiftX = (u_mouse.x - 0.5) * 0.3;
  vec2 focusCenter = vec2(0.5 + mouseShiftX, 0.5);
  vec2 centeredUV = uv - focusCenter;
  centeredUV.x *= aspect;
  float r = length(centeredUV);
  float angle = atan(centeredUV.y, centeredUV.x);
  float apertureRadius = 0.4;
  float fieldRadius = 0.42;
  float apertureMask = smoothstep(apertureRadius - 0.01, apertureRadius + 0.01, r);
  float outerMask = 1.0 - smoothstep(fieldRadius, fieldRadius + 0.03, r);
  vec2 scopeUV = uv * 1.5 + vec2(u_time * 0.01, u_time * 0.007);
  scopeUV += u_mouse * 0.1;
  vec3 col = vec3(0.0);
  float t = u_time;
  float flash = u_clickFlash;
  col += tissue(scopeUV, t, flash);
  col += cells(scopeUV * 0.8, t, flash);
  col += vessels(scopeUV * 0.7, t, flash);
  col += stain(scopeUV, t);
  col += bacteria(scopeUV, t);
  float aberration = r * r * 0.03;
  float caR = tissue(scopeUV + vec2(aberration, 0.0), t, flash).r + cells(scopeUV * 0.8 + vec2(aberration, 0.0), t, flash).r;
  float caB = tissue(scopeUV - vec2(aberration, 0.0), t, flash).b + cells(scopeUV * 0.8 - vec2(aberration, 0.0), t, flash).b;
  col = vec3(caR, col.g, caB);
  vec2 vigUV = centeredUV / fieldRadius;
  float vig = 1.0 - dot(vigUV, vigUV) * 0.5;
  vig = clamp(vig, 0.3, 1.0);
  col *= vig;
  float cellGlow = (1.0 - apertureMask) * (1.0 - outerMask) * 0.3;
  col += vec3(0.0, 0.8, 0.6) * cellGlow * (0.5 + flash * 0.5);
  float specAngle = angle - 1.0;
  float specR = length(vec2(cos(specAngle), sin(specAngle)) * 0.7);
  float specular = exp(-specR * specR * 8.0) * 0.15;
  col += vec3(0.8, 1.0, 0.95) * specular * (1.0 - apertureMask);
  col *= (1.0 - apertureMask);
  float ringLight = exp(-pow((r - apertureRadius) * 40.0, 2.0)) * 0.4;
  col += vec3(0.0, 0.9, 0.7) * ringLight * outerMask;
  float outerGlow = (1.0 - smoothstep(apertureRadius, fieldRadius, r)) * (smoothstep(apertureRadius - 0.02, apertureRadius, r)) * 0.15;
  col += vec3(0.0, 0.5, 0.35) * outerGlow;
  col *= outerMask;
  col += vec3(0.01, 0.02, 0.02) * (1.0 - outerMask);
  float grain = (hash21(uv * u_resolution + fract(u_time * 0.1) * 100.0) - 0.5) * 0.04;
  col += grain;
  float screenVig = 1.0 - smoothstep(0.3, 1.2, length(uv - 0.5) * 1.5);
  col *= 0.5 + screenVig * 0.5;
  col *= 1.0 + flash * 0.5;
  col = col / (col + vec3(0.8));
  col = pow(max(col, vec3(0.0)), vec3(0.9));
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function MicroscopeShader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const uniformsRef = useRef({
    u_time: { value: 0 },
    u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
    u_resolution: { value: new THREE.Vector2(1, 1) },
    u_clickFlash: { value: 0 },
  });
  const flashRef = useRef({ startTime: 0, animating: false });
  const rafRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    uniformsRef.current.u_resolution.value.set(w, h);

    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    geometry.setAttribute("a_position", new THREE.BufferAttribute(vertices, 2));
    geometry.setIndex([0, 1, 2, 2, 1, 3]);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: uniformsRef.current,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      uniformsRef.current.u_time.value = clock.getElapsedTime();

      // Handle click flash animation
      if (flashRef.current.animating) {
        const elapsed = clock.getElapsedTime() - flashRef.current.startTime;
        if (elapsed < 0.1) {
          uniformsRef.current.u_clickFlash.value = elapsed / 0.1;
        } else if (elapsed < 0.5) {
          uniformsRef.current.u_clickFlash.value = 1.0 - (elapsed - 0.1) / 0.4;
        } else {
          uniformsRef.current.u_clickFlash.value = 0;
          flashRef.current.animating = false;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      renderer.setSize(cw, ch);
      uniformsRef.current.u_resolution.value.set(cw, ch);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      uniformsRef.current.u_mouse.value.set(
        (e.clientX - rect.left) / rect.width,
        1.0 - (e.clientY - rect.top) / rect.height
      );
    };

    const handleClick = () => {
      flashRef.current.startTime = clock.getElapsedTime();
      flashRef.current.animating = true;
    };

    window.addEventListener("resize", handleResize);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("click", handleClick);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}
