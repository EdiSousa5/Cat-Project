import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

// Cena e renderizador
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2a2a2a); // Fundo escuro
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Câmera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(1, 2, 10); // Movida mais para trás para um campo de visão mais amplo
camera.lookAt(-3, 1.5, -3); // Olhando para a cena de forma ampla

// Luz ambiente
const ambientLight = new THREE.AmbientLight(0xffd6a5, 0.7); // Luz quente
scene.add(ambientLight);

// Luz direcional simulando a iluminação do fogo
const fireLight = new THREE.PointLight(0xff5500, 1.5, 15);
fireLight.position.set(-2, 1.5, -3.1); // Luz movida para dentro da fogueira (em frente à esfera)
fireLight.castShadow = true;
scene.add(fireLight);

// Chão
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Lareira - movida para a esquerda
const fireplaceMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
const fireplaceBase = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 1), fireplaceMaterial);
fireplaceBase.position.set(-2, 1.5, -3); // Movida para a esquerda
fireplaceBase.castShadow = true;
scene.add(fireplaceBase);

const fireplaceTop = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.5, 1.2), fireplaceMaterial);
fireplaceTop.position.set(-2, 3.25, -3);
fireplaceTop.castShadow = true;
scene.add(fireplaceTop);

const fire = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 32, 32),
  new THREE.MeshStandardMaterial({ emissive: 0xff5500, emissiveIntensity: 1 })
);
fire.position.set(-2, 1.5, -3.1);
scene.add(fire);

// Parede
const wallGeometry = new THREE.PlaneGeometry(20, 10);
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
const wall = new THREE.Mesh(wallGeometry, wallMaterial);
wall.position.set(0, 5, -5);
wall.receiveShadow = true;
scene.add(wall);

// Tapete - Aumentado e posicionado à frente da lareira
const rugGeometry = new THREE.PlaneGeometry(8, 16); // Tamanho maior
const rugMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const rug = new THREE.Mesh(rugGeometry, rugMaterial);
rug.rotation.x = -Math.PI / 2;
rug.position.set(0, 0, 0); // Colocado à frente da lareira, ajustado para não ficar por baixo
scene.add(rug);


// Render loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Ajustar tela
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
