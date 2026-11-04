import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import pathsData from './usolve_logo_3d_paths.json';

export const Hero3dLogo: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animId: number;
    const width = container.clientWidth || 440;
    const height = container.clientHeight || 440;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0, 185);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Build 3D Shape from USolve Monogram Vector Polygon
    const shape = new THREE.Shape();
    pathsData.outer.forEach((pt: number[], i: number) => {
      if (i === 0) shape.moveTo(pt[0], pt[1]);
      else shape.lineTo(pt[0], pt[1]);
    });
    shape.closePath();

    const hole = new THREE.Path();
    pathsData.inner.forEach((pt: number[], i: number) => {
      if (i === 0) hole.moveTo(pt[0], pt[1]);
      else hole.lineTo(pt[0], pt[1]);
    });
    hole.closePath();
    shape.holes.push(hole);

    // 3. Create Root Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Geometry 1: Outer Frosted White Crystal Glass Shell
    const outerGeom = new THREE.ExtrudeGeometry(shape, {
      depth: 16,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 2,
      bevelSize: 2.6,
      bevelThickness: 2.6,
    });
    outerGeom.center();
    outerGeom.computeVertexNormals();

    const whiteGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      opacity: 0.96,
      transparent: true,
      roughness: 0.14,
      ior: 1.52,
      thickness: 4.5,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9,
    });

    const outerMesh = new THREE.Mesh(outerGeom, whiteGlassMaterial);
    modelGroup.add(outerMesh);

    // Geometry 2: Inner Glowing Electric Cyan / Sapphire Liquid Ribbon Core
    const innerGeom = new THREE.ExtrudeGeometry(shape, {
      depth: 10,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 1.2,
      bevelThickness: 1.2,
    });
    innerGeom.center();
    innerGeom.computeVertexNormals();

    const cyanLiquidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00d2ff,
      emissive: 0x0055aa,
      emissiveIntensity: 0.4,
      transmission: 0.7,
      transparent: true,
      opacity: 0.92,
      roughness: 0.06,
      ior: 1.42,
      thickness: 3.2,
      specularIntensity: 1.2,
      specularColor: new THREE.Color(0x8bf3ff),
      clearcoat: 1.0,
    });

    const innerMesh = new THREE.Mesh(innerGeom, cyanLiquidMaterial);
    innerMesh.scale.set(0.96, 0.96, 0.96);
    modelGroup.add(innerMesh);

    // Initial isometric 3D tilt
    modelGroup.rotation.x = 0.12;
    modelGroup.rotation.y = -0.22;

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xf2f7ff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(90, 110, 130);
    scene.add(keyLight);

    const cyanRimLight = new THREE.PointLight(0x00e5ff, 4.0, 350);
    cyanRimLight.position.set(-100, -30, 90);
    scene.add(cyanRimLight);

    const blueBackLight = new THREE.PointLight(0x245bcc, 3.2, 350);
    blueBackLight.position.set(70, -80, -50);
    scene.add(blueBackLight);

    // 5. Global Mouse Tracking across the entire screen
    let targetRotY = -0.22;
    let targetRotX = 0.12;
    let targetLightX = -100;
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
      targetRotY = normX * 0.55 - 0.1;
      targetRotX = -normY * 0.45 + 0.1;

      // Dynamic light movement for shifting specular glints
      targetLightX = -100 + normX * 60;
      targetLightY = -30 - normY * 50;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Handle container resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 440;
      const h = container.clientHeight || 440;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 6. Animation Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth physics damping (lerp) for 3D rotation
      modelGroup.rotation.y += (targetRotY - modelGroup.rotation.y) * 0.07;
      modelGroup.rotation.x += (targetRotX - modelGroup.rotation.x) * 0.07;

      // Gentle floating levitation in 3D space
      modelGroup.position.y = Math.sin(elapsedTime * 1.6) * 3.0;

      // Shifting dynamic specular point lights
      cyanRimLight.position.x += (targetLightX - cyanRimLight.position.x) * 0.05;
      cyanRimLight.position.y += (targetLightY - cyanRimLight.position.y) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      outerGeom.dispose();
      innerGeom.dispose();
      whiteGlassMaterial.dispose();
      cyanLiquidMaterial.dispose();
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
