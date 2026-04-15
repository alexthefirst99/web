'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { ParticleField } from './ParticleField';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// ─── AI Construct Engram (Cyberpunk Alt-style Core) ──────────────────────────
function AiEngram({ isNarrating }: { isNarrating: boolean }) {
  const outerRef = useRef<THREE.Mesh>(null);
  const midRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = isNarrating ? 1.05 + Math.sin(t * 8) * 0.05 : 1.0;

    if (outerRef.current) {
      outerRef.current.rotation.y = t * 0.1;
      outerRef.current.rotation.x = t * 0.05;
      outerRef.current.scale.setScalar(pulse);
    }
    if (midRef.current) {
      midRef.current.rotation.y = -t * 0.15;
      midRef.current.rotation.z = t * 0.1;
      midRef.current.scale.setScalar(pulse * 0.95);
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = t * 0.3;
      innerRef.current.rotation.x = -t * 0.2;
      innerRef.current.scale.setScalar(pulse * 0.8);
    }
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 1.5;
      coreRef.current.scale.setScalar(isNarrating ? 1.05 : 0.9);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Data Sphere */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2.5, 2]} />
        <meshBasicMaterial color="#0f766e" wireframe transparent opacity={0.15} />
      </mesh>

      {/* Mid Matrix Lattice */}
      <mesh ref={midRef}>
        <octahedronGeometry args={[2.0, 1]} />
        <meshBasicMaterial color="#14b8a6" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Inner Energy Cage */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial color="#2dd4bf" wireframe transparent opacity={0.6} />
      </mesh>

      {/* Solid Ghost Core */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial color="#ffffff" emissive="#2dd4bf" emissiveIntensity={isNarrating ? 2.5 : 2} />
      </mesh>
    </group>
  );
}

// ─── Main Canvas Export ───────────────────────────────────────────────────────
export function NeuralCanvas() {
  const { isNarrating } = useStore();

  return (
    <>
      <color attach="background" args={['#05070a']} />
      <ambientLight intensity={0.15} color="#14b8a6" />
      <pointLight position={[0, 3, 5]} intensity={3} color="#2dd4bf" />
      <pointLight position={[-4, -2, 3]} intensity={1} color="#0f766e" />
      <pointLight position={[4, 1, 2]} intensity={0.8} color="#134e4a" />

      <AiEngram isNarrating={isNarrating} />
      <ParticleField count={3000} />

      <EffectComposer>
        <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.9} intensity={2.5} />
      </EffectComposer>
    </>
  );
}
