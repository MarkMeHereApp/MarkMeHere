'use client';

import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random';

function StarGenerator() {
  const ref = useRef<THREE.Points>(null!);
  const [sphere] = useState(() => {
    const float64Array = random.inSphere(new Float64Array(5000), {
      radius: 1.5
    });
    return new Float32Array(float64Array);
  });
  const [opacity, setOpacity] = useState(0);
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
    setOpacity(Math.min(1, opacity + delta / 2)); // Increase opacity over time
  });
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#fff000"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={opacity} // Apply the opacity to the material
        />
      </Points>
    </group>
  );
}

export default function Stars() {
  return (
    <Canvas camera={{ position: [0, 0, 1] }}>
      <StarGenerator />
    </Canvas>
  );
}
