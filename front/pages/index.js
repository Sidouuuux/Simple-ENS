import React, { useState, useEffect, useRef } from 'react'
import BIRDS from 'vanta/dist/vanta.waves.min'
import * as THREE from 'three'
import Navbar from './Navbar'
import Mint from './Mint'

export default function Home() {
  const [vantaEffect, setVantaEffect] = useState(null)
  const vantaRef = useRef(null)
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        BIRDS({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x000000,
          shininess: 50.00,
          waveHeight: 16.00,
          waveSpeed: 0.15,
          zoom: 1.15
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);
  return (
    <div className="h-screen w-screen overflow-y-auto	overflow-x-hidden" ref={vantaRef}>
      <div className="h-screen w-screen backdrop-blur-sm bg-black/15">
        <Navbar />
        <Mint />
      </div>
    </div>
  )
}
