'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const CHAPTERS = 11;
const BG = '#0A0C11';
const CYAN = '#1CC8F2';
const GREEN = '#22C55E';

function cameraKeyframes(chapters: number): THREE.Vector3[] {
  const frames: THREE.Vector3[] = [];
  const turns = 1.65;
  for (let i = 0; i < chapters; i++) {
    const t = i / Math.max(chapters - 1, 1);
    const angle = t * Math.PI * turns + Math.PI * 0.15;
    const radius = 10.5 - t * 1.2;
    frames.push(
      new THREE.Vector3(
        Math.sin(angle) * radius,
        0.8 + Math.sin(t * Math.PI * 2.2) * 1.1,
        Math.cos(angle) * radius,
      ),
    );
  }
  return frames;
}

function CameraRig() {
  const { camera, pointer } = useThree();
  const frames = useMemo(() => cameraKeyframes(CHAPTERS), []);
  const current = useRef(new THREE.Vector3());

  useFrame((_, dt) => {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, window.scrollY / max));
    const scaled = p * (CHAPTERS - 1);
    const i = Math.min(CHAPTERS - 2, Math.floor(scaled));
    const frac = scaled - i;
    const target = frames[i].clone().lerp(frames[i + 1], frac);
    target.x += pointer.x * 0.7;
    target.y += pointer.y * 0.45;
    const k = 1 - Math.exp(-3.2 * dt);
    current.current.lerp(target, k);
    camera.position.copy(current.current);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Core() {
  const ico = useRef<THREE.Mesh>(null);
  const icoInner = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (ico.current) {
      ico.current.rotation.x += dt * 0.12;
      ico.current.rotation.y += dt * 0.16;
    }
    if (icoInner.current) {
      icoInner.current.rotation.x -= dt * 0.18;
      icoInner.current.rotation.y -= dt * 0.22;
    }
    if (glow.current) {
      const s = 1 + Math.sin(t * 1.4) * 0.08;
      glow.current.scale.setScalar(s);
      (glow.current.material as THREE.MeshBasicMaterial).opacity =
        0.06 + Math.sin(t * 0.8) * 0.025;
    }
    if (ring.current) {
      ring.current.rotation.z += dt * 0.08;
      ring.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
  });

  return (
    <group>
      <mesh ref={ico}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.55} />
      </mesh>
      <mesh ref={icoInner}>
        <icosahedronGeometry args={[0.9, 0]} />
        <meshBasicMaterial color={GREEN} wireframe transparent opacity={0.35} />
      </mesh>
      <mesh ref={ring}>
        <torusGeometry args={[2.2, 0.025, 16, 64]} />
        <meshBasicMaterial
          color={CYAN}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={glow}>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshBasicMaterial
          color={GREEN}
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

const OBJECT_DEFS = [
  { geo: 'ico', color: CYAN, scale: 1.1 },
  { geo: 'octa', color: GREEN, scale: 0.85 },
  { geo: 'torus', color: CYAN, scale: 0.9 },
  { geo: 'ico', color: GREEN, scale: 0.7 },
  { geo: 'box', color: CYAN, scale: 0.8 },
  { geo: 'octa', color: CYAN, scale: 1.0 },
  { geo: 'torus', color: GREEN, scale: 1.05 },
  { geo: 'ico', color: CYAN, scale: 0.9 },
  { geo: 'box', color: GREEN, scale: 1.1 },
  { geo: 'torus', color: CYAN, scale: 0.75 },
  { geo: 'octa', color: GREEN, scale: 1.2 },
] as const;

function ChapterObjects() {
  const refs = useRef<Array<THREE.Group | null>>([]);
  const { camera } = useThree();

  useFrame((state, dt) => {
    const now = state.clock.elapsedTime;
    refs.current.forEach((group, i) => {
      if (!group) return;
      const o = OBJECT_DEFS[i % OBJECT_DEFS.length];
      const phase = i * 2.1;
      group.position.y = o.scale * 1.2 + Math.sin(now * 0.5 + phase) * 0.5;
      group.rotation.x += dt * 0.15;
      group.rotation.y += dt * 0.2;
      const d = camera.position.distanceTo(group.position);
      const target = THREE.MathUtils.clamp(1 - (d - 3.2) / 4.5, 0, 1);
      group.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
          m.opacity = target * 0.85;
          m.transparent = true;
        }
      });
    });
  });

  const positions = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    const frames = cameraKeyframes(CHAPTERS);
    for (let i = 0; i < CHAPTERS; i++) {
      const dir = frames[i].clone().normalize();
      arr.push(dir.multiplyScalar(4.2 + (i % 3) * 0.9));
    }
    return arr;
  }, []);

  return (
    <group>
      {OBJECT_DEFS.map((o, i) => (
        <group
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={positions[i]}
        >
          {o.geo === 'ico' && (
            <mesh>
              <icosahedronGeometry args={[o.scale, 0]} />
              <meshBasicMaterial color={o.color} wireframe transparent opacity={0} />
            </mesh>
          )}
          {o.geo === 'octa' && (
            <mesh>
              <octahedronGeometry args={[o.scale, 0]} />
              <meshBasicMaterial color={o.color} wireframe transparent opacity={0} />
            </mesh>
          )}
          {o.geo === 'torus' && (
            <mesh>
              <torusGeometry args={[o.scale, o.scale * 0.32, 8, 24]} />
              <meshBasicMaterial color={o.color} wireframe transparent opacity={0} />
            </mesh>
          )}
          {o.geo === 'box' && (
            <mesh>
              <boxGeometry args={[o.scale, o.scale, o.scale]} />
              <meshBasicMaterial color={o.color} wireframe transparent opacity={0} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { positions, colors, sizes } = useMemo(() => {
    const count = 1600;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const c1 = new THREE.Color(CYAN);
    const c2 = new THREE.Color(GREEN);
    const c3 = new THREE.Color('#FFFFFF');
    for (let i = 0; i < count; i++) {
      const r = 9 + Math.pow(Math.random(), 0.7) * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55;
      pos[i * 3 + 2] = r * Math.cos(phi);
      const c = Math.random() < 0.55 ? c1 : Math.random() < 0.75 ? c2 : c3;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
      size[i] = 0.035 + Math.random() * 0.09;
    }
    return { positions: pos, colors: col, sizes: size };
  }, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (points.current) {
      points.current.rotation.y += dt * 0.018;
      points.current.rotation.x += dt * 0.004;
      const s = points.current.material as THREE.PointsMaterial;
      s.size = 0.09 + Math.sin(t * 0.5) * 0.015;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y += dt * 0.018;
      linesRef.current.rotation.x += dt * 0.004;
      linesRef.current.rotation.z += dt * 0.003;
    }
  });

  const lineGeometry = useMemo(() => {
    const count = 1600;
    const posAttr = new THREE.BufferAttribute(positions, 3);
    const linePositions: number[] = [];
    const lineColors: number[] = [];
    const maxDist = 2.8;
    const cyanColor = new THREE.Color(CYAN);
    const greenColor = new THREE.Color(GREEN);
    let lineCount = 0;

    for (let i = 0; i < Math.min(count, 300); i++) {
      const ix = i * 3;
      const x1 = positions[ix], y1 = positions[ix + 1], z1 = positions[ix + 2];
      for (let j = i + 1; j < Math.min(count, 300); j++) {
        const jx = j * 3;
        const x2 = positions[jx], y2 = positions[jx + 1], z2 = positions[jx + 2];
        const dx = x1 - x2, dy = y1 - y2, dz = z1 - z2;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < maxDist && lineCount < 800) {
          linePositions.push(x1, y1, z1, x2, y2, z2);
          const fade = 1 - dist / maxDist;
          const c = lineCount % 3 === 0 ? greenColor : cyanColor;
          lineColors.push(c.r * fade, c.g * fade, c.b * fade);
          lineColors.push(c.r * fade, c.g * fade, c.b * fade);
          lineCount++;
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
    return geo;
  }, [positions]);

  return (
    <group>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.09}
          vertexColors
          transparent
          opacity={0.75}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export function ExperienceCanvas() {
  const [running, setRunning] = useState(true);

  useEffect(() => {
    const onVisibility = () => setRunning(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={running ? 'always' : 'never'}
      gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
      camera={{ fov: 60, near: 0.1, far: 80, position: [0, 1, 10] }}
    >
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 11, 26]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[-9, 5, -7]} intensity={70} distance={40} color={CYAN} />
      <pointLight position={[9, -4, -5]} intensity={55} distance={40} color={GREEN} />
      <CameraRig />
      <ParticleField />
      <Core />
      <ChapterObjects />
    </Canvas>
  );
}
