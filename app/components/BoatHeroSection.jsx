"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";

// Helper function to lerp colors
function lerpColor(color1, color2, t) {
  const c1 = new THREE.Color(color1);
  const c2 = new THREE.Color(color2);
  return c1.lerp(c2, t);
}

// Enhanced Water Component with boat interaction and time-of-day colors
function RealisticWater({ boatPosition, scrollProgress }) {
  const waterRef = useRef();
  const { scene } = useThree();
  
  useEffect(() => {
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
    
    const textureLoader = new THREE.TextureLoader();
    const waterNormals = textureLoader.load(
      'https://threejs.org/examples/textures/waternormals.jpg',
      (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    );
    
    const water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: waterNormals,
      sunDirection: new THREE.Vector3(0.7, 0.7, 0.5),
      sunColor: 0xfff8e8,
      waterColor: 0x5e8ea4,
      distortionScale: 2.8,
      fog: scene.fog !== undefined,
      alpha: 0.96,
    });
    
    water.rotation.x = -Math.PI / 2;
    water.position.y = -1.35;
    
    // Add custom uniforms for boat ripples
    water.material.uniforms.boatPosition = { value: new THREE.Vector2(0, 0) };
    water.material.uniforms.rippleStrength = { value: 0.15 };
    
    // Enhance shader to include boat ripples
    water.material.onBeforeCompile = (shader) => {
      shader.uniforms.boatPosition = water.material.uniforms.boatPosition;
      shader.uniforms.rippleStrength = water.material.uniforms.rippleStrength;
      
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <normal_fragment_maps>',
        `
        #include <normal_fragment_maps>
        
        // Boat ripple effect
        vec2 boatDist = vUv * 10000.0 - boatPosition;
        float dist = length(boatDist);
        float ripple = sin(dist * 0.5 - time * 2.0) * exp(-dist * 0.08) * rippleStrength;
        normal.xy += ripple * 0.3;
        `
      );
    };
    
    waterRef.current = water;
    scene.add(water);
    
    return () => {
      scene.remove(water);
      waterGeometry.dispose();
      water.material.dispose();
    };
  }, [scene]);
  
  useFrame(() => {
    if (waterRef.current) {
      waterRef.current.material.uniforms['time'].value += 0.008;
      
      // Update boat ripple position
      if (boatPosition) {
        waterRef.current.material.uniforms.boatPosition.value.set(
          boatPosition.x,
          boatPosition.z
        );
        
        const speed = boatPosition.velocity || 0;
        waterRef.current.material.uniforms.rippleStrength.value = 0.15 + speed * 0.1;
        
        const distUnderBoat = 3.2 + Math.sin(boatPosition.x * 0.5) * 0.3;
        waterRef.current.material.uniforms.distortionScale.value = distUnderBoat;
      }
      
      // Smooth morning → evening water color transition
      const morningWater = new THREE.Color(0x5e8ea4); // Cool teal
      const eveningWater = new THREE.Color(0x3d5a6b); // Deep warm blue
      const waterColor = lerpColor(morningWater, eveningWater, scrollProgress);
      waterRef.current.material.uniforms.waterColor.value = waterColor;
      
      // Sun color transition in water
      const morningSun = new THREE.Color(0xfff8e8); // Pale yellow
      const eveningSun = new THREE.Color(0xffc891); // Golden orange
      const sunColor = lerpColor(morningSun, eveningSun, scrollProgress);
      waterRef.current.material.uniforms.sunColor.value = sunColor;
    }
  });
  
  return null;
}

function BoatModel({ scrollProgress, onPositionUpdate }) {
  const { scene } = useGLTF("/boat.glb");
  const boatRef = useRef();
  const groupRef = useRef();
  const lastPosRef = useRef({ x: 0, z: 0 });
  
  useEffect(() => {
    scene.scale.set(0.6, 0.6, 0.6);
    scene.rotation.y = Math.PI / 2;
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.roughness = 0.7;
          child.material.metalness = 0.3;
          
          if (child.material.map) {
            child.material.roughness = 0.85;
          }
        }
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (boatRef.current && groupRef.current) {
      const time = state.clock.getElapsedTime();
      
      const bobSpeed = 1.5;
      const tiltSpeed = 1.2;
      const rollSpeed = 1.3;
      
      boatRef.current.position.y = Math.sin(time * bobSpeed) * 0.09 + Math.cos(time * 0.8) * 0.05 - 0.12;
      boatRef.current.rotation.z = Math.sin(time * tiltSpeed) * 0.03;
      boatRef.current.rotation.x = Math.cos(time * rollSpeed) * 0.025;
      
      const newX = scrollProgress * 3.5;
      const newZ = scrollProgress * -12;
      groupRef.current.position.x = newX;
      groupRef.current.position.z = newZ;
      
      const velocity = Math.sqrt(
        Math.pow(newX - lastPosRef.current.x, 2) +
        Math.pow(newZ - lastPosRef.current.z, 2)
      );
      
      lastPosRef.current = { x: newX, z: newZ };
      
      if (onPositionUpdate) {
        onPositionUpdate({
          x: newX,
          z: newZ,
          velocity: velocity
        });
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.95, 0]}>
      <primitive ref={boatRef} object={scene} />
      
      <mesh position={[0, -1.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.2, 32]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.15} 
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function CameraRig({ scrollProgress }) {
  useFrame((state) => {
    const rotationProgress = Math.min(scrollProgress / 0.28, 1);
    const zoomProgress = Math.max(0, (scrollProgress - 0.28) / 0.72);
    
    const cameraProgress = Math.max(0, (rotationProgress - 0.15) / 0.85);
    
    let radius = 12 - cameraProgress * 6;
    const height = 1.2 + cameraProgress * 2.5;
    const startAngle = Math.PI * 0.5;
    
    let angle;
    if (scrollProgress <= 0.28) {
      angle = startAngle + (cameraProgress * Math.PI * 0.75);
    } else {
      angle = startAngle + Math.PI * 0.75;
      radius = 6 + (zoomProgress * 18);
    }
    
    state.camera.position.x = Math.sin(angle) * radius;
    state.camera.position.y = height;
    state.camera.position.z = Math.cos(angle) * radius;
    
    const boatX = scrollProgress * 3.5;
    const boatZ = scrollProgress * -12;
    
    state.camera.lookAt(boatX, -0.7, boatZ);
  });
  
  return null;
}

// Dynamic lighting that transitions from morning to evening
function DynamicLighting({ scrollProgress }) {
  const mainLightRef = useRef();
  const hemiLightRef = useRef();
  const fillLightRef = useRef();
  const ambientLightRef = useRef();
  
  useFrame(() => {
    // Smooth ease-in-out curve for natural transition
    const t = scrollProgress;
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    
    // Main sun light - position and color shift
    if (mainLightRef.current) {
      // Morning: higher angle, cooler
      // Evening: lower angle (sunset), warmer
      const morningPos = new THREE.Vector3(20, 15, 10);
      const eveningPos = new THREE.Vector3(25, 8, -5);
      mainLightRef.current.position.lerpVectors(morningPos, eveningPos, eased);
      
      // Color shift: pale yellow → golden → orange
      const morningColor = new THREE.Color(0xfff8e8);
      const eveningColor = new THREE.Color(0xffc891);
      mainLightRef.current.color.lerpColors(morningColor, eveningColor, eased);
      
      // Intensity: slightly increase for sunset glow
      mainLightRef.current.intensity = 3.0 + (eased * 0.5);
      
      // Softer shadows in evening
      mainLightRef.current.shadow.radius = 4 + (eased * 2);
    }
    
    // Hemisphere light - sky and ground colors
    if (hemiLightRef.current) {
      const morningSky = new THREE.Color(0xe8f4ff);
      const eveningSky = new THREE.Color(0xf3b493);
      hemiLightRef.current.color.lerpColors(morningSky, eveningSky, eased);
      
      const morningGround = new THREE.Color(0xd4b896);
      const eveningGround = new THREE.Color(0xc9a875);
      hemiLightRef.current.groundColor.lerpColors(morningGround, eveningGround, eased);
      
      hemiLightRef.current.intensity = 1.0 - (eased * 0.3);
    }
    
    // Fill light - warmer in evening
    if (fillLightRef.current) {
      const morningFill = new THREE.Color(0xf5e6d3);
      const eveningFill = new THREE.Color(0xffd4a3);
      fillLightRef.current.color.lerpColors(morningFill, eveningFill, eased);
      
      fillLightRef.current.intensity = 0.6 - (eased * 0.2);
    }
    
    // Ambient light - warmer overall
    if (ambientLightRef.current) {
      const morningAmbient = new THREE.Color(0xfdf5e6);
      const eveningAmbient = new THREE.Color(0xffe0b7);
      ambientLightRef.current.color.lerpColors(morningAmbient, eveningAmbient, eased);
      
      ambientLightRef.current.intensity = 0.4 + (eased * 0.1);
    }
  });
  
  return (
    <>
      <directionalLight 
        ref={mainLightRef}
        position={[20, 15, 10]} 
        intensity={3.0}
        color="#fff8e8"
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-bias={-0.00001}
        shadow-radius={4}
      />
      
      <hemisphereLight 
        ref={hemiLightRef}
        skyColor="#e8f4ff"
        groundColor="#d4b896"
        intensity={1.0}
      />
      
      <directionalLight 
        ref={fillLightRef}
        position={[-12, 8, -8]} 
        intensity={0.6}
        color="#f5e6d3"
      />
      
      <ambientLight 
        ref={ambientLightRef}
        intensity={0.4} 
        color="#fdf5e6" 
      />
    </>
  );
}

// Dynamic sky and fog
function DynamicEnvironment({ scrollProgress }) {
  const { scene, gl } = useThree();
  
  useFrame(() => {
    const t = scrollProgress;
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    
    // Sky color transition: cool blue → warm amber
    const morningSky = new THREE.Color(0xc2d9e8);
    const eveningSky = new THREE.Color(0x8a9aa8);
    const skyColor = lerpColor(morningSky, eveningSky, eased);
    scene.background = skyColor;
    
    // Fog color matches sky
    if (scene.fog) {
      scene.fog.color = skyColor;
      // Fog density slightly increases in evening
      scene.fog.near = 20 + (eased * 5);
      scene.fog.far = 75 - (eased * 10);
    }
    
    // Camera exposure adjustment for cinematic feel
    gl.toneMappingExposure = 1.0 + (eased * 0.2); // Slightly brighter in evening for glow
  });
  
  return <fog attach="fog" args={['#c2d9e8', 20, 75]} />;
}

export default function BoatHeroSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [boatPosition, setBoatPosition] = useState({ x: 0, z: 0, velocity: 0 });
  const sectionRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionHeight = sectionRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Calculate scroll progress within this section
        const scrolledIntoView = Math.max(0, viewportHeight - rect.top);
        const totalScrollable = sectionHeight + viewportHeight;
        const progress = Math.max(0, Math.min(1, scrolledIntoView / totalScrollable));
        
        setScrollProgress(progress);
        
        const newStage = Math.floor(progress * 7);
        if (newStage !== currentStage && newStage < 7) {
          setCurrentStage(newStage);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentStage]);

  const textStages = [
    {
      title: "MINIMALISM IS NOT EMPTINESS,",
      subtitle: "It's essence. A philosophy that strips away the unnecessary to reveal what truly matters. In a world of constant noise, we create spaces of intentional calm."
    },
    {
      title: "Welcome to Munsey Homestay",
      subtitle: "Where tranquility meets the water. Nestled on serene lakeside shores, our retreat offers an escape from the everyday—a place where nature's rhythm becomes your own."
    },
    {
      title: "Experience Serenity",
      subtitle: "Drift away from the ordinary into a realm of peace. Every moment here is designed to slow time, allowing you to reconnect with yourself and the natural world around you."
    },
    {
      title: "Floating in Peace",
      subtitle: "Where time stands still on calm waters. The gentle lapping of waves, the soft rustling of leaves, and the golden light dancing across the lake create a symphony of stillness."
    },
    {
      title: "Your Lakeside Retreat",
      subtitle: "Just 30 minutes by boat from the pier, yet worlds away from the rush of modern life. Our floating sanctuary offers comfort, privacy, and breathtaking views in equal measure."
    },
    {
      title: "Unwind in Nature",
      subtitle: "Comfort and thoughtful design await in every detail. From sunrise reflections on the water to star-filled evenings, each space is crafted to enhance your connection with the environment."
    },
    {
      title: "Book Your Escape",
      subtitle: "Limited rooms available year-round for those seeking authentic tranquility. Reserve your dates now and prepare for an experience that will restore your sense of wonder and peace."
    }
  ];

  const content = textStages[currentStage];

  // Calculate scale: start at 0.8 (80%) and scale to 1.0 (100%) as user scrolls
  const scaleProgress = Math.min(1, Math.max(0, (scrollProgress - 0.2) / 0.8));
  const scale = 0.8 + (scaleProgress * 0.2);
  
  return (
    <div ref={sectionRef} className="relative w-full h-screen">
      {/* 3D Background */}
      <div 
        className="absolute top-0 left-0 w-full h-full -z-10 transition-transform duration-300 ease-out"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }}
      >
        <Canvas
          camera={{
            position: [12, 1.2, 0],
            fov: 50,
          }}
          shadows
          gl={{ 
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0
          }}
          className="w-full h-full"
        >
          <color attach="background" args={['#c2d9e8']} />
          
          {/* Dynamic lighting that transitions with scroll */}
          <DynamicLighting scrollProgress={scrollProgress} />
          
          {/* Dynamic environment (sky, fog) */}
          <DynamicEnvironment scrollProgress={scrollProgress} />
          
          {/* Interactive Water with time-of-day colors */}
          <RealisticWater 
            boatPosition={boatPosition} 
            scrollProgress={scrollProgress}
          />
          
          <BoatModel 
            scrollProgress={scrollProgress} 
            onPositionUpdate={setBoatPosition}
          />
          <CameraRig scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* Text Overlay - Bottom Left with Clean Styling */}
      <div className="absolute bottom-0 left-0 z-10 pb-20 pl-12 max-w-xl pointer-events-none">
        {/* Glassmorphism container with fixed size */}
        <div className="backdrop-blur-md bg-white/30 border border-white/20 rounded-xl p-6 w-96 h-48 flex flex-col justify-center">
          <div className="overflow-hidden">
            <h1 
              className="text-2xl md:text-3xl lg:text-4xl italic tracking-wide mb-3"
              style={{
                fontFamily: "Playfair Display",
                letterSpacing: '0.12em',
                clipPath: "inset(0 0 0 0)",
                lineHeight: '1.3',
                fontStyle: 'italic',
                color: "#062805"
              }}
            >
              {content.title}
            </h1>
          </div>
          
          <div className="overflow-hidden">
            <p 
              className="text-sm leading-relaxed"
              style={{
                fontFamily: "Plus Jakarta Sans",
                clipPath: "inset(0 0 0 0)",
                maxWidth: '480px',
                color: "#062805"
              }}
            >
              {content.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-8 right-8 z-10">
        <div className="flex flex-col items-end gap-3">
          {/* Vertical Progress Bar */}
          <div className="w-0.5 h-32 bg-gray-800/20 rounded-full overflow-hidden relative">
            <div 
              className="absolute bottom-0 w-full bg-gradient-to-t from-gray-900 to-gray-700 transition-all duration-500 ease-out"
              style={{
                height: `${scrollProgress * 100}%`,
                boxShadow: '0 -4px 12px rgba(0,0,0,0.3)'
              }}
            />
          </div>
          
          {/* Stage Counter */}
          <div className="flex flex-col items-end">
            <div className="text-gray-900 text-xl font-light tracking-wider mb-1">
              0{currentStage + 1}
            </div>
            <div className="text-gray-600/60 text-[10px] tracking-[0.2em] uppercase">
              of 07
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}