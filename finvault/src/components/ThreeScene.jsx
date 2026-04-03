import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Float, Stars, Environment, Text } from '@react-three/drei'
import * as THREE from 'three'



/* ─── GOD RAYS ─── */
function GodRays() {
  return (
    <group>
      {[
        { pos: [-2, 3, -4], rot: [0.3, 0.5, 0.1], scale: [0.08, 8, 1] },
        { pos: [3, 2, -5], rot: [-0.2, -0.3, 0.15], scale: [0.06, 10, 1] },
        { pos: [1, -2, -3], rot: [0.4, 0.1, -0.2], scale: [0.05, 7, 1] },
        { pos: [-1, 1, -6], rot: [-0.1, 0.4, 0.3], scale: [0.07, 9, 1] },
      ].map((ray, i) => (
        <mesh key={i} position={ray.pos} rotation={ray.rot} scale={ray.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#F5C842"
            transparent
            opacity={0.03}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ─── PARTICLES ─── */
function Particles() {
  const count = 300
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return pos
  }, [])
  const pointsRef = useRef()
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.02
    }
  })
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#F5C842" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

/* ─── INDEX PARTICLES ─── */
function IndexParticles() {
  const strings = ['NIFTY 50  24,530.40', 'SENSEX  80,716.55', 'RELIANCE ₹2,950', 'NSE', 'BSE']
  const items = useMemo(() => {
    return Array.from({ length: 25 }).map(() => ({
      text: strings[Math.floor(Math.random() * strings.length)],
      pos: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40 - 10, (Math.random() - 0.5) * 20 - 15],
      speed: Math.random() * 0.03 + 0.01
    }))
  }, [])
  const group = useRef()
  useFrame(() => {
    if (group.current) {
      group.current.children.forEach(child => {
        child.position.y += child.userData.speed
        if (child.position.y > 20) child.position.y = -30
      })
    }
  })
  return (
    <group ref={group}>
      {items.map((item, i) => (
        <Text
          key={i}
          position={item.pos}
          fontSize={0.6}
          color="#FF9933"
          fillOpacity={0.08}
          userData={{ speed: item.speed }}
          anchorX="center"
          anchorY="middle"
        >
          {item.text}
        </Text>
      ))}
    </group>
  )
}

/* ─── MOUSE PARALLAX ─── */
function MouseParallax({ children }) {
  const groupRef = useRef()
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.mouse.x * 0.12, 0.04)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -state.mouse.y * 0.08, 0.04)
    }
  })
  return <group ref={groupRef}>{children}</group>
}

/* ─── LANDING SCENE ─── */
export function LandingScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ position: 'absolute', inset: 0 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
    >
      {/* Environment map — this is the KEY to photorealistic coins */}
      <Environment preset="city" />

      <ambientLight intensity={0.25} />
      <pointLight position={[5, 5, 5]} intensity={2.5} color="#F5C842" />
      <pointLight position={[-5, -3, 2]} intensity={1.2} color="#8B9EFF" />
      <pointLight position={[0, -5, 0]} intensity={0.6} color="#F5C842" />

      <Stars radius={100} depth={60} count={5000} factor={4} fade speed={0.8} />

      <MouseParallax>
        <GodRays />
        <Particles />
        <IndexParticles />
      </MouseParallax>
    </Canvas>
  )
}

/* ─── DASHBOARD MINI SCENE ─── */
export function DashboardMiniScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} dpr={[1, 1.5]}>
      <Environment preset="city" />
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 3, 3]} intensity={1.5} color="#F5C842" />
      <pointLight position={[-3, -2, 1]} intensity={0.8} color="#8B9EFF" />
      <Stars radius={60} depth={30} count={1500} factor={2} fade speed={0.3} />
      <Float speed={1.5} floatIntensity={0.5} position={[1.5, 0.5, 0]}>
        <mesh rotation={[0.3, 0.5, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.13, 64]} />
          <meshPhysicalMaterial color="#F5C842" metalness={0.98} roughness={0.02} envMapIntensity={2.5} />
        </mesh>
      </Float>
      <Float speed={2} floatIntensity={0.8} position={[-1, -0.5, 0.5]}>
        <mesh rotation={[0.2, -0.3, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.1, 64]} />
          <meshPhysicalMaterial color="#A8B4FF" metalness={0.95} roughness={0.05} emissive="#4B5FFF" emissiveIntensity={0.15} envMapIntensity={2.5} />
        </mesh>
      </Float>
    </Canvas>
  )
}

/* ─── PORTFOLIO ORB ─── */
export function PortfolioOrb({ color, emissive, speed = 1 }) {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }} style={{ width: '100%', height: '100%' }} dpr={[1, 1.5]}>
      <Environment preset="city" />
      <ambientLight intensity={0.2} />
      <pointLight position={[2, 2, 2]} intensity={2} color={color} />
      <pointLight position={[-2, -2, 1]} intensity={1} color={emissive} />
      <Float speed={speed} floatIntensity={0.6} rotationIntensity={0.4}>
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial
            color={color}
            metalness={0.7}
            roughness={0.2}
            distort={0.2}
            speed={2}
            emissive={emissive}
            emissiveIntensity={0.4}
            envMapIntensity={2}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[1.4, 0.03, 16, 100]} />
          <meshPhysicalMaterial color={color} metalness={1} roughness={0} emissive={emissive} emissiveIntensity={0.5} envMapIntensity={2} />
        </mesh>
      </Float>
    </Canvas>
  )
}
