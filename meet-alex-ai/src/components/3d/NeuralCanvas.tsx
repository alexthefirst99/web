'use client';

import { useThree, useFrame } from '@react-three/fiber';
import { Text, Line, Ring, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { ParticleField } from './ParticleField';
import { Node } from './Node';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useRef } from 'react';

interface DataType {
  id: string;
  label: string;
  mode: string;
  position: [number, number, number];
  color: string;
}

const NODES_DATA: DataType[] = [
  { id: 'alex-portfolio', label: 'Interactive AI Portfolio', mode: 'projects', position: [-2, 1, -2], color: '#2dd4bf' },
  { id: 'gigapixel-viewer', label: 'Gigapixel Med Viewer', mode: 'projects', position: [2, 0, -2], color: '#2dd4bf' },
  { id: 'frontend', label: 'Frontend & UI Core', mode: 'skills', position: [-2, -2, -2], color: '#2dd4bf' },
  { id: 'ai-sys', label: 'AI Architecture', mode: 'skills', position: [2, 2, -3], color: '#2dd4bf' },
  // Adding more dummy clusters to crowd it
  { id: 'dummy-1', label: '', mode: 'skills', position: [4, -3, -4], color: '#550000' },
  { id: 'dummy-2', label: '', mode: 'projects', position: [-4, 3, -5], color: '#550000' },
  { id: 'dummy-3', label: '', mode: 'research', position: [0, -4, -3], color: '#550000' }
];

function CameraRig({ cameraTarget, isNarrating }: { cameraTarget: [number, number, number], isNarrating: boolean }) {
  const { camera } = useThree();
  const vec = new THREE.Vector3();
  const lookVec = new THREE.Vector3(0, 0, 0);

  useFrame((state) => {
    // Add jitter to camera if narrating
    const jitter = isNarrating ? Math.sin(state.clock.elapsedTime * 60) * 0.03 : 0;
    
    vec.set(cameraTarget[0], cameraTarget[1] + jitter, cameraTarget[2] + 4);
    camera.position.lerp(vec, 0.05);

    lookVec.set(cameraTarget[0], cameraTarget[1], cameraTarget[2]);
    
    const dummy = new THREE.Object3D();
    dummy.position.copy(camera.position);
    dummy.lookAt(lookVec);
    camera.quaternion.slerp(dummy.quaternion, 0.05);
  });

  return null;
}

function AiEngram({ text, isNarrating }: { text: string, isNarrating: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
      
      const scale = isNarrating ? 1.2 + Math.sin(state.clock.elapsedTime * 20) * 0.1 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
    if (outerRef.current) {
      outerRef.current.rotation.y -= 0.005;
      outerRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group position={[0, 4, -4]}>
      {/* Outer Cage */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2.5, 1]} />
        <meshBasicMaterial color="#14b8a6" wireframe transparent opacity={0.15} />
      </mesh>
      
      {/* Inner Core */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial color="#2dd4bf" emissive="#14b8a6" emissiveIntensity={isNarrating ? 3 : 1} wireframe />
      </mesh>

      {/* No text inside Engram — narrator text shown in HTML overlay, viz shown below */}
    </group>
  );
}

export function NeuralCanvas() {
  const { mode, activeNodeId, cameraTarget, setCameraTarget, setActiveNodeId, isNarrating, narratorText } = useStore();

  const handleNodeClick = (node: any) => {
    if (node.id.startsWith('dummy')) return;
    setActiveNodeId(node.id);
    setCameraTarget([node.position[0], node.position[1], node.position[2] + 2]);
  };

  return (
    <>
      <color attach="background" args={['#020000']} />
      <ambientLight intensity={0.2} color="#14b8a6" />
      <pointLight position={[10, 10, 10]} intensity={2} color={'#2dd4bf'} />
      <pointLight position={[-10, -10, -10]} intensity={1} color={'#0f766e'} />
      
      <CameraRig cameraTarget={cameraTarget} isNarrating={isNarrating} />
      
      <AiEngram text={narratorText} isNarrating={isNarrating} />

      {/* Lots of random wireframe structures to add "clutter" */}
      {Array.from({ length: 15 }).map((_, i) => (
         <mesh key={`debris-${i}`} position={[(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30]} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
           <boxGeometry args={[Math.random() * 4, Math.random() * 0.1, Math.random() * 4]} />
           <meshBasicMaterial color="#330000" wireframe transparent opacity={0.3} />
         </mesh>
      ))}

      <ParticleField count={5000} />

      {/* Data Visualization Links & Node Rings */}
      <group>
        {NODES_DATA.map((node) => {
          const isRelevant = mode === 'overview' || node.mode === mode;
          const isActive = activeNodeId === node.id;
          const finalColor = isRelevant ? node.color : '#220000';
          
          return (
            <group key={node.id}>
              {/* Neural Pathway from Engram to Node */}
              {(isRelevant || isActive) && (
                <Line
                  points={[[0, 4, -4], node.position]} // From Engram to Node
                  color={isActive ? '#2dd4bf' : '#5eead4'}
                  lineWidth={isActive ? 3 : 1}
                  transparent
                  opacity={isActive ? 1.0 : 0.5}
                />
              )}

              {/* Data Visualization Ring around Active Node */}
              {isActive && (
                <mesh position={node.position} rotation={[Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.5, 1.6, 64, 1, 0, Math.PI * 1.5]} />
                  <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.8} />
                </mesh>
              )}
              {isActive && (
                <mesh position={node.position} rotation={[Math.PI / 2, 0, Math.PI]}>
                  <ringGeometry args={[1.8, 1.85, 32, 1, 0, Math.PI * 0.8]} />
                  <meshBasicMaterial color="#14b8a6" side={THREE.DoubleSide} transparent opacity={0.5} />
                </mesh>
              )}

              <Node
                {...node}
                color={finalColor}
                isActive={isActive}
                onClick={() => handleNodeClick(node)}
              />
            </group>
          );
        })}
      </group>
      
      {/* Central Matrix glow */}
      <mesh position={[0, 0, -2]}>
         <sphereGeometry args={[8, 32, 32]} />
         <meshBasicMaterial color="#14b8a6" transparent opacity={0.02} fog={false} wireframe />
      </mesh>

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={2.0} />
      </EffectComposer>
    </>
  );
}
