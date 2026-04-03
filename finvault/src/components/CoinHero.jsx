import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

import btcImg from '../assets/coins/bitcoin.png'
import ethImg from '../assets/coins/ethereum.png'
import solImg from '../assets/coins/solana.png'
import bnbImg from '../assets/coins/bnb.png'
import polygonImg from '../assets/coins/polygon.png'
import avaxImg from '../assets/coins/avalanche.png'

function Coin({ 
  src, 
  alt, 
  price, 
  size, 
  transform, 
  baseShadow, 
  hoverShadow, 
  idleY, 
  idleDur, 
  idleDelay, 
  parallaxFactor, 
  pointerX, 
  pointerY, 
  initialDelay, 
  bounce, 
  change,
  opacity = 1,
  className = "" 
}) {
  const [isHovered, setIsHovered] = useState(false)
  
  // Parallax offsets
  const x = useTransform(pointerX, (v) => v * parallaxFactor)
  const y = useTransform(pointerY, (v) => v * parallaxFactor)

  return (
    <motion.div 
      className={`absolute flex items-center justify-center ${className}`}
      style={{ x, y, zIndex: size }} // higher size = higher z-index generally
      initial={{ y: -600, opacity: 0 }}
      animate={{ y: 0, opacity }}
      transition={{ type: "spring", stiffness: bounce.stiffness, damping: bounce.damping, mass: 1.5, delay: initialDelay }}
    >
      <motion.div
        animate={{ y: idleY, rotateZ: alt === 'Bitcoin' ? [0, 1, 0] : 0 }}
        transition={{ duration: idleDur, repeat: Infinity, ease: "easeInOut", delay: idleDelay }}
        className="relative flex items-center justify-center"
      >
        <motion.img 
          src={src} 
          alt={alt}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ 
            width: size,
            height: 'auto',
            transform,
            filter: isHovered ? hoverShadow : baseShadow,
            transition: 'filter 0.3s ease-out',
            cursor: 'pointer'
          }}
        />

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: -20, scale: 1 }}
              exit={{ opacity: 0, y: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap"
            >
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 shadow-xl flex items-center gap-2">
                <span className="text-white/80 text-xs font-body font-medium">{alt}</span>
                <span className="text-white font-mono text-sm">{price}</span>
                {change && (
                  <span className={`text-[10px] font-mono tracking-wider ${change.startsWith('+') ? 'text-[#138808]' : 'text-red-500'}`}>
                    {change}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default function CoinHero() {
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handlePointerMove = (e) => {
    if (!isDesktop) return
    const rect = e.currentTarget.getBoundingClientRect()
    // Relative to center of container
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    pointerX.set(x)
    pointerY.set(y)
  }
  
  // Cluster tilt (up to 6 degrees)
  const rotateX = useTransform(pointerY, [-400, 400], [6, -6])
  const rotateY = useTransform(pointerX, [-400, 400], [-6, 6])

  const coins = [
    {
      src: btcImg, alt: 'Bitcoin', price: '₹56,42,000.00', change: '+2.4%',
      size: isDesktop ? 280 : 180,
      className: "top-[10%] left-[20%]",
      transform: 'perspective(800px) rotateY(-20deg) rotateX(5deg)',
      baseShadow: 'drop-shadow(0 40px 80px rgba(245,200,66,0.5)) drop-shadow(0 0 40px rgba(245,200,66,0.3))',
      hoverShadow: 'drop-shadow(0 40px 100px rgba(245,200,66,1)) drop-shadow(0 0 60px rgba(245,200,66,0.8))',
      idleY: [0, -22, 0], idleDur: 4, idleDelay: 0,
      parallaxFactor: 0.025,
      initialDelay: 0.1, bounce: { stiffness: 60, damping: 10 }
    },
    {
      src: ethImg, alt: 'Ethereum', price: '₹2,89,250.50', change: '+1.8%',
      size: isDesktop ? 200 : 130,
      className: "top-[45%] right-[0%]",
      transform: 'perspective(800px) rotateY(15deg) rotateX(-3deg)',
      baseShadow: 'drop-shadow(0 20px 40px rgba(139,158,255,0.4))',
      hoverShadow: 'drop-shadow(0 20px 60px rgba(139,158,255,0.8))',
      idleY: [0, -16, 0], idleDur: 3.5, idleDelay: 0.7,
      parallaxFactor: 0.02,
      initialDelay: 0.25, bounce: { stiffness: 55, damping: 12 }
    },
    {
      src: solImg, alt: 'Solana', price: '₹14,230.30', change: '-0.5%',
      size: isDesktop ? 160 : 100,
      className: "top-[-5%] right-[10%]",
      transform: 'perspective(800px) rotateY(-10deg) rotateX(8deg)',
      baseShadow: 'drop-shadow(0 20px 40px rgba(20,241,149,0.3))',
      hoverShadow: 'drop-shadow(0 20px 60px rgba(20,241,149,0.7))',
      idleY: [0, -19, 0], idleDur: 3.2, idleDelay: 1.3,
      parallaxFactor: 0.018,
      initialDelay: 0.4, bounce: { stiffness: 50, damping: 14 }
    },
    {
      src: polygonImg, alt: 'Polygon', price: '₹78.98', change: '+3.2%',
      size: isDesktop ? 120 : 80,
      opacity: 0.85,
      className: "top-[5%] left-[45%]",
      transform: 'perspective(800px) rotateY(25deg) rotateX(-5deg)',
      baseShadow: 'drop-shadow(0 15px 30px rgba(130,71,229,0.3))',
      hoverShadow: 'drop-shadow(0 15px 50px rgba(130,71,229,0.6))',
      idleY: [0, -12, 0], idleDur: 4.5, idleDelay: 0.4,
      parallaxFactor: 0.01,
      initialDelay: 0.55, bounce: { stiffness: 45, damping: 15 }
    },
    {
      src: bnbImg, alt: 'BNB', price: '₹48,815.15', change: '-1.2%',
      size: isDesktop ? 130 : 85,
      opacity: 0.9,
      className: "top-[55%] left-[5%]",
      transform: 'perspective(800px) rotateY(-15deg) rotateX(3deg)',
      baseShadow: 'drop-shadow(0 15px 30px rgba(243,186,47,0.3))',
      hoverShadow: 'drop-shadow(0 15px 50px rgba(243,186,47,0.6))',
      idleY: [0, -14, 0], idleDur: 3.8, idleDelay: 1.8,
      parallaxFactor: 0.012,
      initialDelay: 0.7, bounce: { stiffness: 45, damping: 15 }
    },
    {
      src: avaxImg, alt: 'Avalanche', price: '₹3,545.20', change: '+0.4%',
      size: isDesktop ? 110 : 70,
      opacity: 0.7,
      className: "top-[75%] right-[-10%]",
      transform: 'perspective(800px) rotateY(20deg) rotateX(-8deg)',
      baseShadow: 'drop-shadow(0 15px 30px rgba(232,65,66,0.3))',
      hoverShadow: 'drop-shadow(0 15px 50px rgba(232,65,66,0.6))',
      idleY: [0, -10, 0], idleDur: 5, idleDelay: 2.1,
      parallaxFactor: 0.008,
      initialDelay: 0.85, bounce: { stiffness: 40, damping: 16 }
    }
  ]

  return (
    <div 
      className="w-full h-full flex items-center justify-center pointer-events-auto relative pt-10 pb-20 md:py-0"
      onPointerMove={handlePointerMove}
      style={{ perspective: 1200 }}
    >
      {/* Subtle radial center glow instead of the dark sphere */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ 
          width: 600, 
          height: 600, 
          background: 'radial-gradient(circle, rgba(245, 200, 66, 0.06) 0%, rgba(0,0,0,0) 70%)' 
        }} 
      />

      <motion.div 
        className="relative w-full max-w-[600px] aspect-square"
        style={{ rotateX: isDesktop ? rotateX : 0, rotateY: isDesktop ? rotateY : 0, transformStyle: "preserve-3d" }}
      >
        {coins.map(coin => (
          <Coin 
            key={coin.alt} 
            {...coin} 
            pointerX={pointerX} 
            pointerY={pointerY} 
          />
        ))}
      </motion.div>
    </div>
  )
}
