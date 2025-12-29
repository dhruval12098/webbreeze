"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Html, useProgress } from "@react-three/drei";
import { Suspense, useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";

/* -------------------- LOADING SCREEN -------------------- */
function BoatHeroLoader() {
  const { progress } = useProgress(); // real loading progress (0 → 100)

  return (
    <Html center>
      <div className="flex flex-col items-center w-40">
        <p className="text-sm font-medium mb-2 text-[#062805]">
          Loading {Math.floor(progress)}%
        </p>

        <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden backdrop-blur-lg border border-white/30">
          <div
            className="h-full bg-[#062805] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Html>
  );
}

/* -------------------- COLOR LERP -------------------- */
function lerpColor(a, b, t) {
  const c1 = new THREE.Color(a);
  const c2 = new THREE.Color(b);
  return c1.lerp(c2, t);
}

/* -------------------- WATER -------------------- */
function RealisticWater({ boatPosition, scrollProgress }) {
  const waterRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    const geo = new THREE.PlaneGeometry(6000, 6000);

    const waterNormals = new THREE.TextureLoader().load(
      "https://threejs.org/examples/textures/waternormals.jpg",
      (t) => {
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
      }
    );

    const water = new Water(geo, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(0.7, 0.7, 0.5),
      sunColor: 0xfff8e8,
      waterColor: 0x5e8ea4,
      distortionScale: 2.8,
      fog: true,
      alpha: 0.96,
    });

    water.rotation.x = -Math.PI / 2;
    water.position.y = -1.35;

    water.material.uniforms.boatPosition = { value: new THREE.Vector2(0, 0) };
    water.material.uniforms.rippleStrength = { value: 0.15 };

    water.material.onBeforeCompile = (shader) => {
      shader.uniforms.boatPosition = water.material.uniforms.boatPosition;
      shader.uniforms.rippleStrength = water.material.uniforms.rippleStrength;

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <normal_fragment_maps>",
        `
          #include <normal_fragment_maps>

          vec2 boatDist = vUv * 6000.0 - boatPosition;
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
      geo.dispose();
      water.material.dispose();
    };
  }, [scene]);

  useFrame(() => {
    if (!waterRef.current) return;

    const water = waterRef.current;
    water.material.uniforms.time.value += 0.008;

    if (boatPosition) {
      water.material.uniforms.boatPosition.value.set(
        boatPosition.x,
        boatPosition.z
      );
      water.material.uniforms.rippleStrength.value =
        0.15 + boatPosition.velocity * 0.1;
    }

    const morning = new THREE.Color(0x5e8ea4);
    const evening = new THREE.Color(0x3d5a6b);
    water.material.uniforms.waterColor.value = lerpColor(
      morning,
      evening,
      scrollProgress
    );
  });

  return null;
}

/* -------------------- BOAT -------------------- */
function BoatModel({ scrollProgress, onPositionUpdate }) {
  const { scene } = useGLTF("/boat.glb");
  const boatRef = useRef();
  const groupRef = useRef();
  const lastRef = useRef({ x: 0, z: 0 });

  useEffect(() => {
    scene.scale.set(0.6, 0.6, 0.6);
    scene.rotation.y = Math.PI / 2;
  }, [scene]);

  useFrame((state) => {
    if (!boatRef.current || !groupRef.current) return;

    const t = state.clock.getElapsedTime();

    boatRef.current.position.y =
      Math.sin(t * 1.5) * 0.09 + Math.cos(t * 0.8) * 0.05 - 0.12;
    boatRef.current.rotation.z = Math.sin(t * 1.2) * 0.03;
    boatRef.current.rotation.x = Math.cos(t * 1.3) * 0.025;

    const x = scrollProgress * 3.5;
    const z = scrollProgress * -12;

    groupRef.current.position.x = x;
    groupRef.current.position.z = z;

    const velocity = Math.hypot(x - lastRef.current.x, z - lastRef.current.z);
    lastRef.current = { x, z };

    onPositionUpdate && onPositionUpdate({ x, z, velocity });
  });

  return (
    <group ref={groupRef} position={[0, -0.95, 0]}>
      <primitive ref={boatRef} object={scene} />
    </group>
  );
}

/* -------------------- CAMERA RIG -------------------- */
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
      angle = startAngle + cameraProgress * Math.PI * 0.75;
    } else {
      angle = startAngle + Math.PI * 0.75;
      radius = 6 + zoomProgress * 18;
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

/* -------------------- LIGHTING -------------------- */
function DynamicLighting({ scrollProgress }) {
  const main = useRef();

  useFrame(() => {
    const t = scrollProgress;
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    if (main.current) {
      main.current.position.lerpVectors(
        new THREE.Vector3(20, 15, 10),
        new THREE.Vector3(25, 8, -5),
        e
      );
      main.current.color.lerpColors(
        new THREE.Color(0xfff8e8),
        new THREE.Color(0xffc891),
        e
      );
    }
  });

  return (
    <>
      <directionalLight
        ref={main}
        intensity={3}
        position={[20, 15, 10]}
        castShadow
      />
      <hemisphereLight intensity={1} />
      <directionalLight position={[-12, 8, -8]} intensity={0.6} />
      <ambientLight intensity={0.4} />
    </>
  );
}

/* -------------------- ENVIRONMENT -------------------- */
function DynamicEnvironment({ scrollProgress }) {
  const { scene } = useThree();

  useFrame(() => {
    const t = scrollProgress;
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const sky = lerpColor(0xc2d9e8, 0x8a9aa8, e);
    scene.background = sky;

    if (scene.fog) scene.fog.color = sky;
  });

  return <fog attach="fog" args={["#c2d9e8", 20, 100]} />;
}

/* -------------------- MAIN COMPONENT -------------------- */
export default function BoatHero() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [stage, setStage] = useState(0);
  const [boatPosition, setBoatPosition] = useState({ x: 0, z: 0, velocity: 0 });

  const containerRef = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();

  /* ---- SCROLL ---- */
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const h = el.offsetHeight;
      const vh = window.innerHeight;

      const progress = Math.max(0, Math.min(1, -rect.top / (h - vh)));
      setScrollProgress(progress);

      const newStage = Math.floor(progress * 7);
      if (newStage !== stage && newStage < 7) setStage(newStage);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [stage]);

  /* ---- TEXT STAGES ---- */
  const textStages = [
    {
      title: "Breeze & Grains Homestay",
      subtitle:
        "Experience the perfect blend of comfort and nature in our serene lakeside retreat.",
    },
    {
      title: "Where Nature Meets Comfort",
      subtitle:
        "Relax in our peaceful homestay surrounded by gentle breezes and tranquil waters.",
    },
    {
      title: "Your Lakeside Sanctuary",
      subtitle:
        "A perfect getaway where you can unwind and connect with nature's rhythm.",
    },
    {
      title: "Gentle Breezes & Grains",
      subtitle: "Enjoy the calming atmosphere and authentic homestay experience by the water.",
    },
    {
      title: "Authentic Homestay Experience",
      subtitle: "Warm hospitality and cozy accommodations in a beautiful natural setting.",
    },
    {
      title: "Create Memories",
      subtitle: "Book your stay at our charming homestay for an unforgettable lakeside experience.",
    },
    {
      title: "Book Your Stay",
      subtitle:
        "Reserve your peaceful retreat at Breeze & Grains Homestay today.",
    },
  ];

  const content = textStages[stage];

  /* ---- TEXT ANIMATION ---- */
  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      titleRef.current,
      { y: 40, opacity: 0, clipPath: "inset(100% 0 0 0)" },
      {
        y: 0,
        opacity: 1,
        clipPath: "inset(0% 0 0 0)",
        duration: 1.2,
        ease: "power3.out",
      }
    ).fromTo(
      subtitleRef.current,
      { y: 30, opacity: 0, clipPath: "inset(100% 0 0 0)" },
      {
        y: 0,
        opacity: 1,
        clipPath: "inset(0% 0 0 0)",
        duration: 1,
        ease: "power3.out",
      },
      "-=0.8"
    );

    return () => tl.kill();
  }, [stage]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: "700vh" }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <Canvas
          camera={{ position: [12, 3, 12], fov: 50 }}
          gl={{ antialias: true }}
          shadows
        >
          {/* 🔻 SUSPENSE WRAPPER + LOADER 🔻 */}
          <Suspense fallback={<BoatHeroLoader />}>
            <DynamicLighting scrollProgress={scrollProgress} />
            <DynamicEnvironment scrollProgress={scrollProgress} />
            <RealisticWater
              boatPosition={boatPosition}
              scrollProgress={scrollProgress}
            />
            <BoatModel
              scrollProgress={scrollProgress}
              onPositionUpdate={setBoatPosition}
            />
            <CameraRig scrollProgress={scrollProgress} />
          </Suspense>
        </Canvas>

        {/* TEXT */}
        <div className="absolute bottom-0 left-0 z-10 pb-20 pl-12 max-w-xl pointer-events-none">
          <div className="backdrop-blur-md bg-white/30 border border-white/20 rounded-xl p-6 w-96 h-48 flex flex-col justify-center">
            <div className="overflow-hidden">
              <h1
                ref={titleRef}
                className="text-2xl md:text-3xl lg:text-4xl italic tracking-wide drop-shadow-lg mb-3"
                style={{
                  fontFamily: "Playfair Display",
                  fontStyle: "italic",
                  color: "#062805",
                }}
              >
                {content.title}
              </h1>
            </div>
            <div className="overflow-hidden">
              <p
                ref={subtitleRef}
                className="text-sm max-w-md drop-shadow-md leading-relaxed"
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  color: "#062805",
                }}
              >
                {content.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
