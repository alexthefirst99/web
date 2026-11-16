'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { ParticleField } from './ParticleField';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// Small seeded PRNG (mulberry32) — same cluster every render/visit.
function seeded(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── AI Construct Engram (Organic Cell Cluster) ────────────────────────────────
function AiEngram({ isNarrating }: { isNarrating: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const cellRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Generate random data for the cells so they don't regenerate every frame
  const cells = useMemo(() => {
    const rand = seeded(1999); // deterministic, so render stays pure
    const arr = [];
    const palette = ['#E2C08D', '#C9A46A', '#F1DDB8', '#c2385a', '#a3243b', '#E2C08D'];
    
    for (let i = 0; i < 80; i++) {
      // Gaussian-like distribution to make it dense in the center, sparse on edges
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(rand() * 2 - 1);
      const radius = Math.pow(rand(), 1.5) * 2.0; 
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      arr.push({
        basePos: [x, y, z] as [number, number, number],
        // Cells closer to center are generally larger, edges are tiny
        size: Math.max(0.04, (2.2 - radius) * 0.12 * rand() + 0.02),
        color: palette[Math.floor(rand() * palette.length)],
        // Unique random properties for cellular floating simulation
        speed: 0.8 + rand() * 2.0,
        offset: rand() * 100,
        floatRadius: 0.1 + rand() * 0.15
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = isNarrating ? 1.05 + Math.sin(t * 15) * 0.05 : 1.0;

    if (groupRef.current) {
      // The entire cluster slowly drifts and rotates
      groupRef.current.rotation.y = t * 0.1;
      groupRef.current.rotation.z = Math.sin(t * 0.05) * 0.1;
      groupRef.current.scale.setScalar(pulse);
    }

    // Each cell organically squirming/floating away from its structural baseline
    cellRefs.current.forEach((cell, i) => {
      if (!cell) return;
      const data = cells[i];
      cell.position.x = data.basePos[0] + Math.sin(t * data.speed + data.offset) * data.floatRadius;
      cell.position.y = data.basePos[1] + Math.cos(t * data.speed * 0.8 + data.offset) * data.floatRadius;
      cell.position.z = data.basePos[2] + Math.sin(t * data.speed * 1.2 + data.offset) * data.floatRadius;
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Singular hidden anchor point so the cluster feels dense in the exact center */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#c2385a" />
      </mesh>

      {/* Orbiting cellular dots */}
      {cells.map((c, i) => (
        <mesh 
          key={i} 
          ref={(el) => {
            cellRefs.current[i] = el;
          }} 
          position={c.basePos}
        >
          <sphereGeometry args={[c.size, 16, 16]} />
          <meshBasicMaterial color={c.color} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Main Canvas Export ───────────────────────────────────────────────────────
export function NeuralCanvas({ background = '#0b0608', particles = true }: { background?: string; particles?: boolean }) {
  const { isNarrating } = useStore();

  return (
    <>
      <color attach="background" args={[background]} />
      <ambientLight intensity={0.15} color="#E2C08D" />
      <pointLight position={[0, 3, 5]} intensity={3} color="#E2C08D" />
      <pointLight position={[-4, -2, 3]} intensity={1} color="#a3243b" />
      <pointLight position={[4, 1, 2]} intensity={0.8} color="#7a1230" />

      <AiEngram isNarrating={isNarrating} />
      {particles && <ParticleField count={3000} />}

      <EffectComposer>
        <Bloom luminanceThreshold={0.32} luminanceSmoothing={0.9} intensity={0.85} />
      </EffectComposer>
    </>
  );
}
