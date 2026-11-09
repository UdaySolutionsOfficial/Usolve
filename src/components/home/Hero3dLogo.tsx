import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import ribbonsData from './usolve_logo_dual_ribbons.json';

export const Hero3dLogo: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animId: number;
    const width = container.clientWidth || 460;
    const height = container.clientHeight || 460;

    // 1. Scene, Camera, High-Precision WebGL Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(0, 0, 190);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. High-End Studio Environment Map for Authentic Glass Refraction & Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTexture;

    // 3. Exact Vector Ribbons Geometry (Jointly Centered, Perfectly Aligned)
    // Ribbon 1: Inner S-Curve Ribbon (Electric Cyan Liquid Glass)
    const shape1 = new THREE.Shape();
    ribbonsData.ribbon1.forEach((pt: number[], i: number) => {
      if (i === 0) shape1.moveTo(pt[0], pt[1]);
      else shape1.lineTo(pt[0], pt[1]);
    });
    shape1.closePath();

    // Ribbon 2: Outer U-Curve Ribbon (Corporate Sapphire Navy Liquid Glass)
    const shape2 = new THREE.Shape();
    ribbonsData.ribbon2.forEach((pt: number[], i: number) => {
      if (i === 0) shape2.moveTo(pt[0], pt[1]);
      else shape2.lineTo(pt[0], pt[1]);
    });
    shape2.closePath();

    // Extrude settings with rounded glass chamfers and deep volume
    const depth1 = 18;
    const depth2 = 18;

    const extrudeSettings1 = {
      depth: depth1,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 2.2,
      bevelThickness: 2.2,
    };

    const extrudeSettings2 = {
      depth: depth2,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 2.2,
      bevelThickness: 2.2,
    };

    const geom1 = new THREE.ExtrudeGeometry(shape1, extrudeSettings1);
    const geom2 = new THREE.ExtrudeGeometry(shape2, extrudeSettings2);

    // CRITICAL FIX: Only center along the Z axis!
    // DO NOT call geom.center() on X & Y, which breaks the alignment of the ribbons!
    geom1.translate(0, 0, -depth1 / 2);
    geom2.translate(0, 0, -depth2 / 2);

    geom1.computeVertexNormals();
    geom2.computeVertexNormals();

    // 4. Physical Colored Liquid Glass Materials with Authentic Corporate Saturated Depth
    // Ribbon 1: Luminous Electric Cyan / Azure Liquid Glass
    const cyanGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#00B4D8'),          // Vibrant electric cyan-blue body color
      emissive: new THREE.Color('#007799'),       // Subtle internal liquid caustics glow
      emissiveIntensity: 0.28,
      transmission: 0.52,                         // Balanced 52% glass refraction + 48% rich vivid cyan color
      opacity: 1.0,
      transparent: true,
      roughness: 0.06,                            // Ultra-smooth liquid glass finish
      metalness: 0.04,
      ior: 1.52,                                  // Optical crown glass
      thickness: 6.5,                             // Rich volumetric depth
      attenuationColor: new THREE.Color('#0096C7'), // Azure light absorption in core
      attenuationDistance: 5.0,                   // Clear sparkling edges, deep electric cyan inside
      specularIntensity: 1.5,
      specularColor: new THREE.Color('#FFFFFF'),  // Crisp white diamond specular glints
      clearcoat: 1.0,                             // Dual-layer glossy lacquer sheen
      clearcoatRoughness: 0.03,
      dispersion: 0.08,                           // Subtle chromatic prism refraction
    });

    // Ribbon 2: Deep Corporate Sapphire Navy Liquid Glass
    const navyGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#1B365D'),          // USolve corporate navy / sapphire
      emissive: new THREE.Color('#0C1C36'),       // Deep corporate core glow
      emissiveIntensity: 0.22,
      transmission: 0.45,                         // 45% glass transmission: deep sapphire body with clear highlights
      opacity: 1.0,
      transparent: true,
      roughness: 0.07,
      metalness: 0.06,
      ior: 1.55,
      thickness: 7.5,
      attenuationColor: new THREE.Color('#0F172A'), // Rich navy light absorption
      attenuationDistance: 4.5,                   // Deep ocean sapphire in volume, crystalline bevels
      specularIntensity: 1.6,
      specularColor: new THREE.Color('#93C5FD'),  // Soft cyan/blue specular reflection on bevels
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      dispersion: 0.06,
    });

    // 5. Create Model Group and position ribbons with authentic interlocking 3D depth
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    const mesh1 = new THREE.Mesh(geom1, cyanGlassMaterial);
    const mesh2 = new THREE.Mesh(geom2, navyGlassMaterial);

    // Position ribbons with authentic Z-depth interleaving
    mesh1.position.set(0, 0, 4);  // Electric cyan ribbon forward in 3D
    mesh2.position.set(0, 0, -3); // Sapphire navy ribbon interlocked behind

    modelGroup.add(mesh2);
    modelGroup.add(mesh1);

    // Initial 3D isometric presentation angle
    modelGroup.rotation.x = 0.12;
    modelGroup.rotation.y = -0.25;

    // 6. Professional Studio Lighting Calibrated for Saturated Glass Colors
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Key Light: Overhead softbox casting crisp glass specular glints
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(85, 115, 135);
    scene.add(keyLight);

    // Rim Light: Vibrant Electric Cyan light reflecting off glass bevels
    const cyanRimLight = new THREE.PointLight(0x00d2ff, 3.4, 350);
    cyanRimLight.position.set(-85, -25, 90);
    scene.add(cyanRimLight);

    // Back Light: Royal Sapphire Blue rim illuminating the navy glass depths
    const blueBackLight = new THREE.PointLight(0x245bcc, 2.8, 350);
    blueBackLight.position.set(75, -75, -55);
    scene.add(blueBackLight);

    // 7. Global Mouse Tracking across the entire screen
    let targetRotY = -0.25;
    let targetRotX = 0.12;
    let targetLightX = -90;
    let targetLightY = -30;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      // Normalized coordinates relative to window
      const normX = (clientX / window.innerWidth) * 2 - 1;
      const normY = (clientY / window.innerHeight) * 2 - 1;

      // 3D rotation targets
      targetRotY = normX * 0.48 - 0.15;
      targetRotX = -normY * 0.38 + 0.1;

      // Dynamic light movement for shifting liquid specular glints
      targetLightX = -90 + normX * 65;
      targetLightY = -30 - normY * 55;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Handle container resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 460;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 8. Animation Render Loop with Fluid Breathing & Caustic Shimmer
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth physics damping (lerp) for 3D rotation
      modelGroup.rotation.y += (targetRotY - modelGroup.rotation.y) * 0.08;
      modelGroup.rotation.x += (targetRotX - modelGroup.rotation.x) * 0.08;

      // Gentle floating levitation in 3D space
      modelGroup.position.y = Math.sin(elapsedTime * 1.6) * 3.0;

      // Subtle internal liquid caustics pulse
      const liquidPulse = 0.5 + 0.15 * Math.sin(elapsedTime * 2.2);
      cyanRimLight.intensity = 2.8 + liquidPulse * 1.0;

      // Shifting dynamic specular point lights
      cyanRimLight.position.x += (targetLightX - cyanRimLight.position.x) * 0.06;
      cyanRimLight.position.y += (targetLightY - cyanRimLight.position.y) * 0.06;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      geom1.dispose();
      geom2.dispose();
      cyanGlassMaterial.dispose();
      navyGlassMaterial.dispose();
      envTexture.dispose();
      roomEnv.dispose();
      pmremGenerator.dispose();
      renderer.dispose();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center select-none pointer-events-auto">
      {/* Soft Ambient Radial Lighting Accent beneath 3D Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full bg-gradient-to-tr from-[#8bf3ff]/30 via-[#2E68B2]/15 to-transparent blur-3xl" />
        <div className="absolute w-[340px] h-[340px] rounded-full border border-dashed border-cyan-400/20 pointer-events-none animate-[spin_60s_linear_infinite]" />
        <div className="absolute w-[420px] h-[420px] rounded-full border border-brand-border/30 pointer-events-none animate-[spin_80s_linear_infinite_reverse]" />
      </div>

      {/* The Real-Time Three.js WebGL 3D Model Canvas */}
      <div
        ref={mountRef}
        className="relative z-10 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};
