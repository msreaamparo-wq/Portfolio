import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.187.0/build/three.module.js";

const canvas = document.querySelector("#heroScene");
const hero = document.querySelector(".hero");
if (!canvas || !hero) throw new Error("3D hero canvas was not found.");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
  powerPreference: "low-power"
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
camera.position.set(0, 0, 8.2);

scene.add(new THREE.AmbientLight(0xb9b4ff, 1.35));
const keyLight = new THREE.PointLight(0x9b7bff, 24, 22);
keyLight.position.set(3, 3, 5);
scene.add(keyLight);
const cyanLight = new THREE.PointLight(0x48e5ef, 15, 18);
cyanLight.position.set(-3, -2, 3);
scene.add(cyanLight);

const world = new THREE.Group();
scene.add(world);
const sculpture = new THREE.Group();
world.add(sculpture);

const knot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.94, 0.22, 180, 22, 2, 3),
  new THREE.MeshPhysicalMaterial({
    color: 0x9b7bff,
    metalness: 0.62,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.16
  })
);
sculpture.add(knot);

const shell = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.55, 2),
  new THREE.MeshBasicMaterial({
    color: 0x61e7ef,
    wireframe: true,
    transparent: true,
    opacity: 0.25
  })
);
sculpture.add(shell);

const orbitA = new THREE.Mesh(
  new THREE.TorusGeometry(2.05, 0.012, 8, 180),
  new THREE.MeshBasicMaterial({ color: 0x57dfe9, transparent: true, opacity: 0.68 })
);
orbitA.rotation.set(0.9, 0.2, 0.45);
sculpture.add(orbitA);

const orbitB = new THREE.Mesh(
  new THREE.TorusGeometry(2.35, 0.009, 8, 180),
  new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.5 })
);
orbitB.rotation.set(1.2, 0.8, -0.6);
sculpture.add(orbitB);

const satellites = [];
[
  { color: 0x59e4ee, size: 0.12, position: [2.15, 0.45, 0.15] },
  { color: 0xb59aff, size: 0.09, position: [-1.8, -1.2, 0.8] },
  { color: 0x59e4ee, size: 0.07, position: [0.8, 1.9, -0.4] }
].forEach((item) => {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(item.size, 20, 16),
    new THREE.MeshStandardMaterial({
      color: item.color,
      metalness: 0.35,
      roughness: 0.25,
      emissive: item.color,
      emissiveIntensity: 0.18
    })
  );
  mesh.position.set(...item.position);
  sculpture.add(mesh);
  satellites.push(mesh);
});

const particleCount = window.innerWidth < 600 ? 280 : 620;
const particlePositions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i += 1) {
  const radius = 2.4 + Math.random() * 2.7;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
  particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
  particlePositions[i * 3 + 2] = radius * Math.cos(phi);
}
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
const particleMaterial = new THREE.PointsMaterial({
  color: 0x8edff0,
  size: 0.022,
  transparent: true,
  opacity: 0.65,
  sizeAttenuation: true,
  depthWrite: false
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
world.add(particles);

const pointer = { x: 0, y: 0 };
const target = { x: 0, y: 0 };
if (!reduceMotion) {
  window.addEventListener("pointermove", (event) => {
    target.x = (event.clientX / window.innerWidth - 0.5) * 2;
    target.y = (event.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
}

function resize() {
  const width = Math.max(1, hero.clientWidth);
  const height = Math.max(1, hero.clientHeight);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.position.z = width < 700 ? 9.2 : 8.2;
  camera.updateProjectionMatrix();
  world.position.x = width < 700 ? 0.8 : 2.15;
  world.position.y = width < 700 ? 0.15 : 0.05;
}
const observer = new ResizeObserver(resize);
observer.observe(hero);
resize();

function draw(time = 0) {
  if (!reduceMotion) {
    pointer.x += (target.x - pointer.x) * 0.035;
    pointer.y += (target.y - pointer.y) * 0.035;
    sculpture.rotation.y = time * 0.00016 + pointer.x * 0.22;
    sculpture.rotation.x = Math.sin(time * 0.00022) * 0.12 + pointer.y * 0.12;
    sculpture.rotation.z = Math.sin(time * 0.00012) * 0.08;
    shell.rotation.y = -time * 0.00009;
    orbitA.rotation.z += 0.00045;
    orbitB.rotation.x -= 0.00025;
    particles.rotation.y = time * 0.000018 + pointer.x * 0.035;
    particles.rotation.x = pointer.y * 0.025;
    satellites.forEach((mesh, index) => {
      mesh.position.y += Math.sin(time * 0.001 + index * 2) * 0.0008;
    });
    camera.position.x += (pointer.x * 0.24 - camera.position.x) * 0.025;
    camera.position.y += (-pointer.y * 0.16 - camera.position.y) * 0.025;
    camera.lookAt(0, 0, 0);
  }
  renderer.render(scene, camera);
  if (!reduceMotion) requestAnimationFrame(draw);
}
draw();
