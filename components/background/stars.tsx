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
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#FFFF00"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

function Stars() {
  return (
    <Canvas camera={{ position: [0, 0, 1] }}>
      <StarGenerator />
    </Canvas>
  );
}

export default Stars;
