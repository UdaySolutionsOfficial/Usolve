import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import ribbonsData from './usolve_logo_dual_ribbons.json';

export const Hero3dLogo: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animId: number;
    const width = container.clientWidth || 460;
    const height = container.clientHeight || 460;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(0, 0, 195);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Build 3D Shape 1: Inner S-Curve Ribbon (Electric Cyan Glass)
    const shape1 = new THREE.Shape();
    ribbonsData.ribbon1.forEach((pt: number[], i: number) => {
      if (i === 0) shape1.moveTo(pt[0], pt[1]);
      else shape1.lineTo(pt[0], pt[1]);
    });
    shape1.closePath();

    // Build 3D Shape 2: Outer U-Curve Ribbon (Corporate Sapphire Navy Glass)
    const shape2 = new THREE.Shape();
    ribbonsData.ribbon2.forEach((pt: number[], i: number) => {
      if (i === 0) shape2.moveTo(pt[0], pt[1]);
      else shape2.lineTo(pt[0], pt[1]);
    });
    shape2.closePath();

    // 3. Extrude Geometries with smooth bevels (no holes, no self-intersections)
    const extrudeSettings1 = {
      depth: 18,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 2,
      bevelSize: 2.2,
      bevelThickness: 2.2,
    };

    const extrudeSettings2 = {
      depth: 18,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 2,
      bevelSize: 2.2,
      bevelThickness: 2.2,
    };

    const geom1 = new THREE.ExtrudeGeometry(shape1, extrudeSettings1);
    geom1.center();
    geom1.computeVertexNormals();

    const geom2 = new THREE.ExtrudeGeometry(shape2, extrudeSettings2);
    geom2.center();
    geom2.computeVertexNormals();

    // 4. Materials matching USolve Corporate Theme (#1B365D & #00D2FF / #8BF3FF)
    // Ribbon 1: Radiant Electric Cyan Crystal Glass
    const cyanGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#00D2FF'),
      emissive: new THREE.Color('#006699'),
      emissiveIntensity: 0.35,
      roughness: 0.08,
      metalness: 0.12,
      transmission: 0.6,
      opacity: 0.95,
      transparent: true,
      ior: 1.52,
      thickness: 4.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      specularIntensity: 1.4,
      specularColor: new THREE.Color('#FFFFFF'),
    });

    // Ribbon 2: Deep Corporate Sapphire Navy Crystal Glass
    const navyGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#1B365D'),
      emissive: new THREE.Color('#0E2240'),
      emissiveIntensity: 0.25,
      roughness: 0.1,
      metalness: 0.15,
      transmission: 0.5,
      opacity: 0.98,
      transparent: true,
      ior: 1.55,
      thickness: 5.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      specularIntensity: 1.5,
      specularColor: new THREE.Color('#8BF3FF'), // Subtle cyan glint on navy bevels
    });

    // 5. Create Model Group and position ribbons in 3D space
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    const mesh1 = new THREE.Mesh(geom1, cyanGlassMaterial);
    const mesh2 = new THREE.Mesh(geom2, navyGlassMaterial);

    // Authentic 3D depth interleaving
    mesh1.position.set(0, 0, 5);  // Electric cyan ribbon forward
    mesh2.position.set(0, 0, -3); // Sapphire navy ribbon interlocked behind

    modelGroup.add(mesh2);
    modelGroup.add(mesh1);

    // Initial 3D isometric presentation angle
    modelGroup.rotation.x = 0.12;
    modelGroup.rotation.y = -0.25;

    // 6. Professional Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xf0f7ff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(90, 120, 140);
    scene.add(keyLight);

    const cyanRimLight = new THREE.PointLight(0x00f0ff, 4.5, 360);
    cyanRimLight.position.set(-90, -30, 90);
    scene.add(cyanRimLight);

    const blueBackLight = new THREE.PointLight(0x245bcc, 3.5, 360);
    blueBackLight.position.set(70, -80, -60);
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
      targetRotY = normX * 0.5 - 0.15;
      targetRotX = -normY * 0.4 + 0.1;

      // Dynamic light movement for shifting specular glints
      targetLightX = -90 + normX * 60;
      targetLightY = -30 - normY * 50;
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

    // 8. Animation Render Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth physics damping (lerp) for 3D rotation
      modelGroup.rotation.y += (targetRotY - modelGroup.rotation.y) * 0.08;
      modelGroup.rotation.x += (targetRotX - modelGroup.rotation.x) * 0.08;

      // Gentle floating levitation in 3D space
      modelGroup.position.y = Math.sin(elapsedTime * 1.6) * 3.0;

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
