// ============= SCENE SETUP & CONSTANTS =============

const mainScene = new THREE.Scene();
mainScene.background = new THREE.Color(0x131647);

const customizeScene = new THREE.Scene();
customizeScene.background = new THREE.Color(0x131647); // Light gray background

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// ============= CAMERA & CONTROLS =============
let isCustomizing = false;
let cameraFollowing = true;
let cameraOffset = new THREE.Vector3(18, 12, 5); // Increased distance and height

// Store original camera position
const originalCameraPosition = new THREE.Vector3();
const customizeCameraPosition = new THREE.Vector3(2, 0.5, 0);
// Camera toggle button
const cameraButton = document.getElementById("toggleCamera");
cameraButton.textContent = "Camera: Following Cat";
cameraButton.classList.add("following");

// Main camera setup
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  100000 // Increased far clipping plane
);
camera.position.set(5, 6, 5);

// Customize camera setup
const customizeCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
customizeCamera.position.set(0, 4, 4);
customizeCamera.lookAt(0, 0, 0);

let activeCamera = camera;

// Main camera controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.maxPolarAngle = Math.PI / 2;
controls.enabled = false;

// Customize camera controls
const customizeControls = new THREE.OrbitControls(
  customizeCamera,
  renderer.domElement
);
customizeControls.target.set(30, 0.7, 30);
customizeControls.enabled = false;
customizeControls.enableDamping = true;
customizeControls.dampingFactor = 0.05;

cameraButton.addEventListener("click", () => {
  if (!isCustomizing) {
    cameraFollowing = !cameraFollowing;

    if (cameraFollowing) {
      cameraButton.textContent = "Camera: Following Cat";
      cameraButton.classList.remove("manual");
      cameraButton.classList.add("following");
      controls.enabled = false;
    } else {
      cameraButton.textContent = "Camera: Manual Control";
      cameraButton.classList.remove("following");
      cameraButton.classList.add("manual");
      controls.enabled = true;
    }
  }
});

function updateCamera() {
  if (isCustomizing) {
    customizeControls.update();
  } else if (cameraFollowing) {
    const targetPosition = new THREE.Vector3();
    catGroup.getWorldPosition(targetPosition);

    const idealPosition = targetPosition.clone().add(cameraOffset);
    camera.position.lerp(idealPosition, 0.1);
    camera.lookAt(targetPosition);
  } else {
    if (controls.enabled) {
      controls.update();
    }
  }
}

// ============= CAT CREATION & MATERIALS =============

const catMaterial = new THREE.MeshStandardMaterial({ color: 0x171617 }); // Cor preta
const tailMaterial = new THREE.MeshStandardMaterial({ color: 0xe4e4e4 }); // Cor branco escuro
const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 }); // Cor amarela
const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0xc26412 }); // Cor laranja escuro
const noseMaterial = new THREE.MeshStandardMaterial({ color: 0xda88a3 }); // Cor laranja escuro

const catGroup = new THREE.Group();

// ============= CAT BODY =============

const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 0.4), catMaterial);
body.position.set(0, 0, 0);
body.castShadow = true;
catGroup.add(body);

// ============= CAT LEGS =============

// Pernas do gato
const rightFrontLeg = new THREE.Mesh(
  new THREE.BoxGeometry(0.15, 0.6, 0.15),
  catMaterial
);
rightFrontLeg.position.set(0.55, -0.44, 0.12); // Ajuste a posição relativa ao corpo
rightFrontLeg.castShadow = true;
body.add(rightFrontLeg);

const leftFrontLeg = new THREE.Mesh(
  new THREE.BoxGeometry(0.15, 0.6, 0.15),
  catMaterial
);
leftFrontLeg.position.set(0.55, -0.44, -0.12); // Ajuste a posição relativa ao corpo
leftFrontLeg.castShadow = true;
body.add(leftFrontLeg);

const rightBackLeg = new THREE.Mesh(
  new THREE.BoxGeometry(0.15, 0.6, 0.15),
  catMaterial
);
rightBackLeg.position.set(-0.55, -0.44, 0.12); // Ajuste a posição relativa ao corpo
rightBackLeg.castShadow = true;
body.add(rightBackLeg);

const leftBackLeg = new THREE.Mesh(
  new THREE.BoxGeometry(0.15, 0.6, 0.15),
  catMaterial
);
leftBackLeg.position.set(-0.55, -0.44, -0.12); // Ajuste a posição relativa ao corpo
leftBackLeg.castShadow = true;
body.add(leftBackLeg);

// ============= CAT HEAD =============

// Cabeça do gato (agora é o "pai")
const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.5), catMaterial);
head.position.set(0.95, 0.2, 0); // Ajuste a posição relativa ao corpo
head.castShadow = true;
body.add(head);

// Focinho do gato (filho da cabeça)
const snout = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.3), catMaterial);
snout.position.set(0.3, -0.1, 0); // Ajustando o focinho para ficar à frente da cabeça
snout.castShadow = true;
head.add(snout);

// Orelhas do gato (filhas da cabeça)
const rightEar = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 0.1, 0.1),
  catMaterial
);
rightEar.position.set(0, 0.25, 0.15); // Ajustando a orelha direita para ficar à frente e acima da cabeça
rightEar.castShadow = true;
head.add(rightEar);

const leftEar = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 0.1, 0.1),
  catMaterial
);
leftEar.position.set(0, 0.25, -0.15); // Ajustando a orelha esquerda para ficar à frente e acima da cabeça
leftEar.castShadow = true;
head.add(leftEar);

const topNose = new THREE.Mesh(
  new THREE.BoxGeometry(0.04, 0.04, 0.08),
  noseMaterial
);
topNose.position.set(0.35, 0, 0);
topNose.castShadow = true;
head.add(topNose);

// ============= CAT EYES =============

// Olho esquerdo (filho da cabeça)
const leftEye = new THREE.Mesh(
  new THREE.BoxGeometry(0.001, 0.1, 0.1),
  eyeMaterial
);
leftEye.position.set(0.25, 0.05, 0.2); // Ajustando o olho esquerdo para ficar à frente da cabeça
head.add(leftEye);

const leftPupil = new THREE.Mesh(
  new THREE.BoxGeometry(0.001, 0.1, 0.1),
  pupilMaterial
);
leftPupil.position.set(0.25, 0.05, 0.1); // Ajustando a pupila esquerda para a posição correta
head.add(leftPupil);

// Olho direito (filho da cabeça)
const rightEye = new THREE.Mesh(
  new THREE.BoxGeometry(0.001, 0.1, 0.1),
  eyeMaterial
);
rightEye.position.set(0.25, 0.05, -0.2); // Ajustando o olho direito para ficar à frente da cabeça
head.add(rightEye);

const rightPupil = new THREE.Mesh(
  new THREE.BoxGeometry(0.001, 0.1, 0.1),
  pupilMaterial
);
rightPupil.position.set(0.25, 0.05, -0.1); // Ajustando a pupila direita para a posição correta
head.add(rightPupil);

// ============= CAT TAIL =============

// Cubo invisível que será o pai da cauda
const tailBase = new THREE.Mesh(
  new THREE.BoxGeometry(0.1, 0.1, 0.1),
  new THREE.MeshBasicMaterial({ visible: false })
);
tailBase.position.set(-1, 0.02, 0); // Ajuste a posição relativa ao corpo
body.add(tailBase);

// Início Cauda do gato
const tailBeggining = new THREE.Mesh(
  new THREE.BoxGeometry(0.8, 0.1, 0.1),
  catMaterial
);
tailBeggining.position.set(0, 0, 0); // Ajusta para o cubo invisível
tailBeggining.rotation.z = (25 * Math.PI) / 180;
tailBeggining.castShadow = true;
tailBase.add(tailBeggining);

// Fim Cauda do gato
const tailEnding = new THREE.Mesh(
  new THREE.BoxGeometry(0.6, 0.1, 0.1),
  catMaterial
);
tailEnding.position.set(-0.64, -0.168, 0); // Ajusta para o cubo invisível
tailEnding.castShadow = true;
tailBase.add(tailEnding);

// Ponta Cauda do gato
const tailPoint = new THREE.Mesh(
  new THREE.BoxGeometry(0.15, 0.1, 0.1),
  tailMaterial
);
tailPoint.position.set(-1.015, -0.168, 0); // Ajusta para o cubo invisível
tailPoint.castShadow = true;
tailBase.add(tailPoint);

// ============= ADD CAT TO SCENE =============

mainScene.add(catGroup);
catGroup.position.set(4.5, 0, -4.5); // Updated initial position

// ============= OBJECTS CREATION =============

const floorGeometry = new THREE.BoxGeometry(13, 13, 0.2);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xdcae72 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.set(0, -0.8, 0);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;

mainScene.add(floor);

function createEnvironment() {
  const walls = new THREE.Group();
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5dc });

  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(13.5, 6, 0.5),
    wallMaterial
  );
  rightWall.position.set(-0.25, 2.1, -6.75);
  rightWall.receiveShadow = true;

  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 6, 13),
    wallMaterial
  );
  backWall.position.set(-6.75, 2.1, 0);
  backWall.receiveShadow = true;

  const carpet = new THREE.Mesh(
    new THREE.BoxGeometry(7, 0.05, 10),
    new THREE.MeshStandardMaterial({ color: 0xea2e2e }) // Dark red
  );
  carpet.position.set(0, -0.7, 0); // Just above floor level
  carpet.receiveShadow = true;

  const tv = new THREE.Mesh(
    new THREE.BoxGeometry(4.5, 2.5, 0.2),
    new THREE.MeshStandardMaterial({ color: 0x000000 })
  );
  tv.position.set(0, 3, -6.48);
  tv.castShadow = true;
  tv.receiveShadow = true;
  mainScene.add(tv);

  const couch = createCouch();
  const door = createDoor();
  const lamp = createLamp();
  const painting = createPainting();
  const cabinet = createCabinet();
  const centerTable = createCenterTable();
  const tvBase = createTvBase();
  const catBed = createCatBed();

  // Add all to scene
  mainScene.add(door);
  mainScene.add(lamp);
  mainScene.add(painting);
  mainScene.add(cabinet);
  mainScene.add(centerTable);
  mainScene.add(tvBase);
  mainScene.add(catBed);

  // Add all to scene
  walls.add(backWall, rightWall);
  mainScene.add(walls);
  mainScene.add(carpet);
  mainScene.add(couch);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

  // Add ceiling spotlight
  // In createEnvironment function
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Update ceiling light settings
  const ceilingLight = new THREE.SpotLight(0xfff8b7, 1.8);
  ceilingLight.position.set(0, 10, 0);
  ceilingLight.penumbra = 0.3;
  ceilingLight.decay = 1.8;
  ceilingLight.distance = 20;
  ceilingLight.angle = Math.PI / 3;
  
  // Ultra-high quality shadow settings
  ceilingLight.castShadow = true;
  ceilingLight.shadow.mapSize.width = 8192;   // Maximum resolution
  ceilingLight.shadow.mapSize.height = 8192;  // Maximum resolution
  ceilingLight.shadow.camera.near = 0.1;
  ceilingLight.shadow.camera.far = 20;
  ceilingLight.shadow.bias = -0.0001;         // Ultra-fine bias
  ceilingLight.shadow.normalBias = 0.005;     // Reduced for sharp details
  ceilingLight.shadow.radius = 4;             // Increased blur
  ceilingLight.shadow.blurSamples = 32; 

  mainScene.add(ambientLight);
  mainScene.add(ceilingLight);

  // Call for both scenes
  createStars(mainScene);
  createStars(customizeScene);
}

function createStars(scene) {
  const starsGroup = new THREE.Group();
  const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const starGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
  const minDistance = 75;
  const maxDistance = 125;

  for (let i = 0; i < 5000; i++) {
    const star = new THREE.Mesh(starGeometry, starMaterial);
    const x =
      (Math.random() - 0.5) * maxDistance +
      Math.sign(Math.random() - 0.5) * minDistance;
    const y =
      (Math.random() - 0.5) * maxDistance +
      Math.sign(Math.random() - 0.5) * minDistance;
    const z =
      (Math.random() - 0.5) * maxDistance +
      Math.sign(Math.random() - 0.5) * minDistance;

    star.position.set(x, y, z);
    starsGroup.add(star);
  }

  scene.add(starsGroup);
}

function createCatBed() {
  const catBed = new THREE.Group();

  // Base/frame
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(3, 0.3, 2.2),
    new THREE.MeshStandardMaterial({
      color: 0x105179,
    })
  );

  const back = new THREE.Mesh(
    new THREE.BoxGeometry(3, 0.8, 0.3),
    new THREE.MeshStandardMaterial({
      color: 0x105179,
    })
  );
  back.position.set(0, 0.5, 0.95);

  const leftArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.5, 2),
    new THREE.MeshStandardMaterial({
      color: 0x105179,
    })
  );

  const rightArm = leftArm.clone();
  rightArm.position.set(-1.35, 0.3, -0.1);
  leftArm.position.set(1.35, 0.3, -0.1);

  // Add cushion
  const cushion = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 0.2, 1.7),
    new THREE.MeshStandardMaterial({ color: 0x1d7bb6 })
  );
  cushion.position.set(0, 0.2, -0.1);
  cushion.castShadow = true;
  cushion.receiveShadow = true;

  catBed.add(base, back, leftArm, rightArm, cushion);
  catBed.position.set(4.8, -0.6, 5.4);
  return catBed;
}

function createDoor() {
  const doorGroup = new THREE.Group();

  const doorOutline = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 4.5, 0.2),
    new THREE.MeshStandardMaterial({ color: 0x82490b }) // Warmer wood tone
  );

  const doorInside = new THREE.Mesh(
    new THREE.BoxGeometry(2, 4, 0.002),
    new THREE.MeshStandardMaterial({ color: 0xe09449 }) // Darker wood for inner panel
  );
  doorInside.position.set(0, 0, 0.1);

  const doorknob = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 40, 40),
    new THREE.MeshStandardMaterial({ color: 0xb87333 }) // Warmer brass color
  );
  doorknob.position.set(-0.6, 0, 0.2);
  doorknob.castShadow = true;
  doorknob.receiveShadow = true;

  doorGroup.receiveShadow = true;
  doorGroup.castShadow = true;
  doorGroup.add(doorOutline, doorInside, doorknob);
  doorGroup.position.set(4.7, 1.31, -6.5);
  return doorGroup;
}

function createLamp() {
  const lampGroup = new THREE.Group();

  // Base disc
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32),
    new THREE.MeshStandardMaterial({ color: 0x8b8b8b })
  );
  base.position.y = 0.05;

  // Taller and slightly thicker pole
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 4, 16),
    new THREE.MeshStandardMaterial({ color: 0x8b8b8b })
  );
  pole.position.y = 2;

  // Larger lampshade
  const outerShade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 1, 32, 1, true),
    new THREE.MeshStandardMaterial({
      color: 0xf5f5f5,
      side: THREE.DoubleSide,
    })
  );
  outerShade.position.y = 3.8;

  // Add light source inside shade
  const lampLight = new THREE.PointLight(0xfff684, 0.4);
  lampLight.position.y = 3.8;

  // Apply shadows
  [base, pole, outerShade].forEach((part) => {
    part.castShadow = true;
    part.receiveShadow = true;
  });

  lampGroup.add(base, pole, outerShade, lampLight);
  lampGroup.position.set(-5.5, -0.7, -5.5);
  return lampGroup;
}

function createPainting() {
  const painting = new THREE.Group();

  const border = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 2, 3),
    new THREE.MeshStandardMaterial({ color: 0x4a3219 })
  );

  // Load texture for painting
  const textureLoader = new THREE.TextureLoader();
  const paintingTexture = textureLoader.load("./Assets/catPainting.avif");

  const inside = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 1.5, 2.5),
    new THREE.MeshStandardMaterial({
      map: paintingTexture,
      side: THREE.DoubleSide,
    })
  );
  inside.position.set(0.01, 0, 0);

  painting.add(border, inside);
  painting.position.set(-6.5, 3, -3);
  return painting;
}

function createCabinet() {
  const cabinet = new THREE.Group();
  const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x783600 });

  // Frame panels
  const backPanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 5, 4),
    woodMaterial
  );
  backPanel.position.set(-0.9, 0, 0);

  const leftPanel = new THREE.Mesh(
    new THREE.BoxGeometry(1, 5, 0.2),
    woodMaterial
  );
  leftPanel.position.set(-0.4, 0, -1.9);

  const rightPanel = new THREE.Mesh(
    new THREE.BoxGeometry(1, 5, 0.2),
    woodMaterial
  );
  rightPanel.position.set(-0.4, 0, 1.9);

  const topPanel = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.2, 4),
    woodMaterial
  );
  topPanel.position.set(-0.4, 2.4, 0);

  const bottomPanel = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.2, 4),
    woodMaterial
  );
  bottomPanel.position.set(-0.4, -2.4, 0);

  // Create 3 shelves manually with equal spacing
  const shelf1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.1, 3.6),
    woodMaterial
  );
  shelf1.position.set(-0.4, -1.2, 0);

  const shelf2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.1, 3.6),
    woodMaterial
  );
  shelf2.position.set(-0.4, 0, 0);

  const shelf3 = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.1, 3.6),
    woodMaterial
  );
  shelf3.position.set(-0.4, 1.2, 0);

  const shelves = [shelf1, shelf2, shelf3];

  // Add books
  const bookBaseHeight = 0.8;
  const colors = [
    0x000080, // Navy Blue
    0x2f4f4f, // Dark Slate Gray
    0x483d8b, // Dark Slate Blue
    0x4b0082, // Indigo
    0x556b2f, // Dark Olive Green
    0x800080, // Purple
    0x003366, // Dark Navy
    0x1a472a, // Dark Green
  ];

  shelves.forEach((shelf) => {
    const shelfWidth = 3.6;
    const numBooks = 11;
    const bookWidth = 0.3;
    const spacing = 0.02;

    // Calculate total width including all books and spaces
    const totalWidth = numBooks * bookWidth + (numBooks - 1) * spacing;
    // Center starting position on shelf
    const startZ = -(shelfWidth / 2) + (shelfWidth - totalWidth) / 2;

    for (let i = 0; i < numBooks; i++) {
      const randomHeight = bookBaseHeight + (Math.random() * 0.2 - 0.1);
      const bookGeometry = new THREE.BoxGeometry(0.2, randomHeight, bookWidth);
      const bookMaterial = new THREE.MeshStandardMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
      });
      const book = new THREE.Mesh(bookGeometry, bookMaterial);

      // Position books with fixed spacing from centered start position
      const zPosition = startZ + i * (bookWidth + spacing);
      book.position.set(
        -0.5,
        shelf.position.y + randomHeight / 2,
        zPosition + bookWidth / 2
      );
      book.castShadow = true;
      book.receiveShadow = true;
      cabinet.add(book);
    }
  });

  [backPanel, leftPanel, rightPanel, topPanel, bottomPanel, ...shelves].forEach(
    (part) => {
      part.castShadow = true;
      part.receiveShadow = true;
      cabinet.add(part);
    }
  );

  cabinet.position.set(-5.5, 1.8, 2);
  return cabinet;
}

function createCenterTable() {
  const tableGroup = new THREE.Group();

  // Table top with increased dimensions
  const tableTop = new THREE.Mesh(
    new THREE.BoxGeometry(3.5, 0.2, 2.5),
    new THREE.MeshStandardMaterial({ color: 0x8b4513 })
  );
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;

  // Table legs
  const legGeometry = new THREE.BoxGeometry(0.2, 1.2, 0.2);
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

  const leg1 = new THREE.Mesh(legGeometry, legMaterial);
  leg1.position.set(1.5, -0.7, 1); // Right front

  const leg2 = new THREE.Mesh(legGeometry, legMaterial);
  leg2.position.set(-1.5, -0.7, 1); // Left front

  const leg3 = new THREE.Mesh(legGeometry, legMaterial);
  leg3.position.set(1.5, -0.7, -1); // Right back

  const leg4 = new THREE.Mesh(legGeometry, legMaterial);
  leg4.position.set(-1.5, -0.7, -1); // Left back

  [leg1, leg2, leg3, leg4].forEach((leg) => {
    leg.castShadow = true;
    leg.receiveShadow = true;
    tableGroup.add(leg);
  });

  tableGroup.add(tableTop);
  tableGroup.position.set(0, 0.6, 0);
  return tableGroup;
}

function createTvBase() {
  const tvBase = new THREE.Group();
  const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

  // Base and top panels
  const basePanel = new THREE.Mesh(
    new THREE.BoxGeometry(5, 0.2, 1.5),
    woodMaterial
  );
  basePanel.position.set(0, -1.6, 0);

  const topPanel = new THREE.Mesh(
    new THREE.BoxGeometry(5, 0.2, 1.5),
    woodMaterial
  );
  topPanel.position.set(0, -0.1, 0);

  // Back panel
  const backPanel = new THREE.Mesh(
    new THREE.BoxGeometry(5, 1.5, 0.1),
    woodMaterial
  );
  backPanel.position.set(0, -0.85, -0.7);

  // Left cabinet
  const leftCabinet = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.5, 1.5),
    woodMaterial
  );
  leftCabinet.position.set(-1.75, -0.85, 0);

  // Left door
  const leftDoor = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 1.4, 0.1),
    woodMaterial
  );
  leftDoor.position.set(-1.75, -0.85, 0.75);

  // Left handle
  const leftHandle = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xb5a642 })
  );
  leftHandle.position.set(-1.4, -0.85, 0.8);

  // Right cabinet
  const rightCabinet = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.5, 1.5),
    woodMaterial
  );
  rightCabinet.position.set(1.75, -0.85, 0);

  // Right door
  const rightDoor = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 1.4, 0.1),
    woodMaterial
  );
  rightDoor.position.set(1.75, -0.85, 0.75);

  // Right handle
  const rightHandle = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xb5a642 })
  );
  rightHandle.position.set(1.4, -0.85, 0.8);

  // Middle shelf
  const middleShelf = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.1, 1.3),
    woodMaterial
  );
  middleShelf.position.set(0, -0.85, 0);

  // Side supports for middle section
  const leftSupport = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 1.5, 1.5),
    woodMaterial
  );
  leftSupport.position.set(-0.85, -0.85, 0);

  const rightSupport = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 1.5, 1.5),
    woodMaterial
  );
  rightSupport.position.set(0.85, -0.85, 0);

  // Apply shadows to all parts
  [
    basePanel,
    topPanel,
    backPanel,
    leftCabinet,
    rightCabinet,
    leftDoor,
    rightDoor,
    leftHandle,
    rightHandle,
    middleShelf,
    leftSupport,
    rightSupport,
  ].forEach((part) => {
    part.castShadow = true;
    part.receiveShadow = true;
    tvBase.add(part);
  });

  tvBase.position.set(0, 1, -5.8);
  return tvBase;
}

function createCouch() {
  const couch = new THREE.Group();

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(6, 1, 2.2),
    new THREE.MeshStandardMaterial({ color: 0xf9801e })
  );
  base.castShadow = true;
  base.receiveShadow = true;

  const back = new THREE.Mesh(
    new THREE.BoxGeometry(6, 2.4, 0.5),
    new THREE.MeshStandardMaterial({ color: 0xf9801e })
  );
  back.position.set(0, 0.7, 1);
  back.castShadow = true;
  back.receiveShadow = true;

  const rightArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.7, 2.2),
    new THREE.MeshStandardMaterial({ color: 0xf9801e })
  );
  rightArm.position.set(2.75, 0.8, 0);
  rightArm.castShadow = true;
  rightArm.receiveShadow = true;

  const leftArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.7, 2.2),
    new THREE.MeshStandardMaterial({ color: 0xf9801e })
  );
  leftArm.position.set(-2.75, 0.8, 0);
  leftArm.castShadow = true;
  leftArm.receiveShadow = true;

  // Add cushions
  const cushionGeometry = new THREE.BoxGeometry(1.66, 0.3, 2);
  const cushionMaterial = new THREE.MeshStandardMaterial({ color: 0xffa040 });

  const cushion1 = new THREE.Mesh(cushionGeometry, cushionMaterial);
  cushion1.position.set(-1.7, 0.45, 0);
  cushion1.castShadow = true;
  cushion1.receiveShadow = true;

  const cushion2 = new THREE.Mesh(cushionGeometry, cushionMaterial);
  cushion2.position.set(0, 0.45, 0);
  cushion2.castShadow = true;
  cushion2.receiveShadow = true;

  const cushion3 = new THREE.Mesh(cushionGeometry, cushionMaterial);
  cushion3.position.set(1.7, 0.45, 0);
  cushion3.castShadow = true;
  cushion3.receiveShadow = true;

  const armCushionGeometry = new THREE.BoxGeometry(1, 1.2, 0.2);
  const armCushionMaterial = new THREE.MeshStandardMaterial({
    color: 0xffa040,
  });

  const leftArmCushion = new THREE.Mesh(armCushionGeometry, armCushionMaterial);
  leftArmCushion.position.set(-1.8, 0.9, 0.6);
  leftArmCushion.rotation.set(0.2, 0, 0);
  leftArmCushion.castShadow = true;
  leftArmCushion.receiveShadow = true;

  const rightArmCushion = new THREE.Mesh(
    armCushionGeometry,
    armCushionMaterial
  );
  rightArmCushion.position.set(1.8, 0.9, 0.6);
  rightArmCushion.rotation.set(0.2, 0, 0);
  rightArmCushion.castShadow = true;
  rightArmCushion.receiveShadow = true;

  couch.add(
    base,
    back,
    rightArm,
    leftArm,
    cushion1,
    cushion2,
    cushion3,
    leftArmCushion,
    rightArmCushion
  );
  couch.position.set(0, -0.2, 5.25);
  return couch;
}

// Call function to create environment
createEnvironment();

// ============= FLOOR CLICK =============

window.addEventListener("click", onFloorClick);

// Modify the onFloorClick function
let walkableZones;
const zoneMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  transparent: true,
  opacity: 0.9,
  visible: false,
});

let zonesVisible = false;

// Create and add zones first
function createWalkableZones() {
  const zones = new THREE.Group();

  const zone1 = new THREE.Mesh(new THREE.PlaneGeometry(10, 6.9), zoneMaterial);
  zone1.rotation.x = -Math.PI / 2;
  zone1.position.set(0, -0.65, -0.4);

  const zone2 = new THREE.Mesh(new THREE.PlaneGeometry(2, 8), zoneMaterial);
  zone2.rotation.x = -Math.PI / 2;
  zone2.position.set(4.5, -0.65, -0.95);

  zones.add(zone1, zone2);
  return zones;
}

// Initialize zones and add to scene
walkableZones = createWalkableZones();
mainScene.add(walkableZones);

// Then add event listener
window.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "f") {
    zonesVisible = !zonesVisible;
    walkableZones.children.forEach((zone) => {
      zone.material.visible = zonesVisible;
    });
  }
});

function onFloorClick(event) {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  // Check intersection with walkable zones
  const intersects = raycaster.intersectObjects(walkableZones.children);

  if (intersects.length > 0) {
    const point = intersects[0].point;
    targetPosition = point;
    isMoving = true;;

    const direction = new THREE.Vector2(
      targetPosition.x - catGroup.position.x,
      targetPosition.z - catGroup.position.z
    );
    targetRotation.y = Math.atan2(direction.x, direction.y) - Math.PI / 2;
  }
}

// In createEnvironment or init function:
walkableZones = createWalkableZones();
mainScene.add(walkableZones);

// ============= ANIMATION VARIABLES =============

let tailRotation = 0;
let isBlinking = false;
let blinkTime = 0;
let nextBlink = 800;
let holdClosedTime = 0;
let isWalking = false;
let walkTime = 0;
let previousCameraMode = true;

let targetPosition = null;
let isMoving = false;

const BASE_MOVE_SPEED = 0.06;
let getScreenSizeFactor = () => Math.min(window.innerWidth, window.innerHeight) / 1000;
let moveSpeed = BASE_MOVE_SPEED * getScreenSizeFactor();

const rotationSpeed = 0.04;
const targetRotation = new THREE.Euler();

// ============= ANIMATION FUNCTIONS =============

function updateTail() {
  tailBase.rotation.y = Math.sin(tailRotation) * 0.1;
  tailRotation += 0.08;
}

function updateBlinking() {
  blinkTime += 1;

  if (!isBlinking && blinkTime >= nextBlink) {
    isBlinking = true;
    blinkTime = 0;
    holdClosedTime = 0;
  }

  if (isBlinking) {
    const blinkPhase = blinkTime * 0.03;

    if (blinkPhase < Math.PI / 2) {
      // Closing phase
      const blinkScale = Math.max(0, Math.cos(blinkPhase));
      leftEye.scale.y = blinkScale;
      rightEye.scale.y = blinkScale;
      leftPupil.scale.y = blinkScale;
      rightPupil.scale.y = blinkScale;

      if (blinkScale <= 0) {
        holdClosedTime++;
        if (holdClosedTime >= 20) {
          blinkTime = Math.PI / 2;
        }
      }
    } else {
      // Opening phase
      const blinkScale = Math.max(0, Math.cos(Math.PI - blinkPhase));
      leftEye.scale.y = blinkScale;
      rightEye.scale.y = blinkScale;
      leftPupil.scale.y = blinkScale;
      rightPupil.scale.y = blinkScale;

      if (blinkPhase >= Math.PI) {
        isBlinking = false;
        leftEye.scale.y = 1;
        rightEye.scale.y = 1;
        leftPupil.scale.y = 1;
        rightPupil.scale.y = 1;
        blinkTime = 0;
        nextBlink = 1000;
      }
    }
  }
}

function updateWalking() {
  if (!isWalking) return;

  walkTime += 0.08;
  const legRotation = Math.sin(walkTime) * 0.4;
  rightFrontLeg.rotation.z = legRotation;
  leftBackLeg.rotation.z = legRotation;
  leftFrontLeg.rotation.z = -legRotation;
  rightBackLeg.rotation.z = -legRotation;

  body.position.y += 0.0008 * Math.cos(walkTime);
}

function updateMovement() {
  if (!isMoving || !targetPosition) return;

  const distance = new THREE.Vector2(
    targetPosition.x - catGroup.position.x,
    targetPosition.z - catGroup.position.z
  ).length();

  if (distance > 0.1) {
    const targetAngle = Math.atan2(
      targetPosition.x - catGroup.position.x,
      targetPosition.z - catGroup.position.z
    ) - Math.PI/2;

    const currentRotation = catGroup.rotation.y;
    let rotationDiff = targetAngle - currentRotation;
    
    while (rotationDiff > Math.PI) rotationDiff -= Math.PI * 2;
    while (rotationDiff < -Math.PI) rotationDiff += Math.PI * 2;

    head.rotation.y = Math.sign(rotationDiff) * Math.min(Math.abs(rotationDiff), Math.PI/4);
    
    // Slower rotation
    catGroup.rotation.y += rotationDiff * rotationSpeed;

    const direction = new THREE.Vector2(
      targetPosition.x - catGroup.position.x,
      targetPosition.z - catGroup.position.z
    ).normalize();

    // Reduce speed while turning
    const turnSpeedModifier = Math.cos(Math.abs(rotationDiff));
    const currentSpeed = moveSpeed * Math.max(0.3, turnSpeedModifier);

    catGroup.position.x += direction.x * currentSpeed;
    catGroup.position.z += direction.y * currentSpeed;
    isWalking = true;
  } else {
    isMoving = false;
    isWalking = false;
    targetPosition = null;
    head.rotation.y = 0;

    rightFrontLeg.rotation.z = 0;
    leftBackLeg.rotation.z = 0;
    leftFrontLeg.rotation.z = 0;
    rightBackLeg.rotation.z = 0;
  }
}

// ============= HTML =============

// Add to existing code
const mainControls = document.getElementById("mainControls");
const customizeButton = document.getElementById("customizeButton");
const customizeMenu = document.getElementById("customizeMenu");
const closeCustomizeButton = document.getElementById("closeCustomize");

// ============= FPS =============

let fps = 0;
let lastFrameTime = performance.now();

function updateFPS() {
  const currentTime = performance.now();
  const deltaTime = currentTime - lastFrameTime;
  fps = 1000 / deltaTime;
  lastFrameTime = currentTime;
  document.getElementById("fpsValue").textContent = Math.round(fps);
}

// ============= MENU CUSTOMIZE  =============

body.name = "body";
head.name = "head";
tailBase.name = "tailBase";
rightFrontLeg.name = "rightFrontLeg";
leftFrontLeg.name = "leftFrontLeg";
rightBackLeg.name = "rightBackLeg";
leftBackLeg.name = "leftBackLeg";

// Create second cat with correct floor position
const secondCatGroup = catGroup.clone(true);
const floorSurface = floor.position.y + floor.geometry.parameters.depth / 2;
const baseLegHeight = rightFrontLeg.geometry.parameters.height;
const legScale = rightFrontLeg.scale.y;
const scaledLegHeight = baseLegHeight * legScale;

const customizeFloor = new THREE.Mesh(
  new THREE.CylinderGeometry(2.5, 2.5, 0.15, 24), // radiusTop, radiusBottom, height, segments
  new THREE.MeshStandardMaterial({ color: 0xdddddd })
);
customizeFloor.position.set(0, 0, 0);
customizeFloor.receiveShadow = false;
customizeScene.add(customizeFloor);

// Create rotating platform
const platformGeometry = new THREE.CylinderGeometry(2.5, 2.5, 0.15, 24);
const platformMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd });
const rotatePlatform = new THREE.Group();

customizeFloor.position.set(0, 0, 0);
rotatePlatform.add(customizeFloor);
rotatePlatform.add(secondCatGroup);
customizeScene.add(rotatePlatform);

const customizeOrbitControls = new THREE.OrbitControls(
  customizeCamera,
  renderer.domElement
);
customizeOrbitControls.enableZoom = false;
customizeOrbitControls.enablePan = false;
customizeOrbitControls.minPolarAngle = Math.PI / 4;
customizeOrbitControls.maxPolarAngle = Math.PI / 2;
customizeOrbitControls.autoRotate = false;
customizeOrbitControls.enabled = false;

// Add lighting to customize scene
const customizeAmbient = new THREE.AmbientLight(0xffffff, 0.3);
const customizeDirectional = new THREE.DirectionalLight(0xfffde9, 1.7); // Increased intensity from 0.8 to 1.5
customizeDirectional.position.set(0, 5, 5);
customizeDirectional.castShadow = true;
customizeScene.add(customizeAmbient);
customizeScene.add(customizeDirectional);

secondCatGroup.visible = false;
customizeScene.add(secondCatGroup);

customizeButton.addEventListener("click", () => {
  isCustomizing = true;
  customizeMenu.style.display = "block";
  secondCatGroup.visible = true;
  activeCamera = customizeCamera;
  controls.enabled = false;
  customizeOrbitControls.enabled = true;

  // Position cat and platform
  secondCatGroup.position.set(0, 0.8, 0);
  secondCatGroup.rotation.y = Math.PI / -2;
  rotatePlatform.rotation.y = 0;
});

closeCustomizeButton.addEventListener("click", () => {
  isCustomizing = false;
  customizeMenu.style.display = "none";
  secondCatGroup.visible = false;
  activeCamera = camera;
  customizeControls.enabled = false;

  // Restore previous camera mode
  cameraFollowing = previousCameraMode;
  controls.enabled = !cameraFollowing;

  // Update button state
  cameraButton.textContent = cameraFollowing
    ? "Camera: Following Cat"
    : "Camera: Manual";
  cameraButton.className = cameraFollowing ? "following" : "manual";

  camera.position.set(0, 2, 10);
  camera.lookAt(0, 0, 0);
});

// ============= MENU - CHANCHE COLORS =============

const originalColors = {
  body: catMaterial.color.getHex(),
  eyes: eyeMaterial.color.getHex(),
  pupils: pupilMaterial.color.getHex(),
  nose: noseMaterial.color.getHex(),
  tailTip: tailMaterial.color.getHex(), // Adicionar cor original da ponta da cauda
};

document.getElementById("bodyColor").addEventListener("input", (event) => {
  catMaterial.color.set(event.target.value);
});

// Alterar cor dos olhos e atualizar pupilas
document.getElementById("eyeColor").addEventListener("input", (event) => {
  const eyeColor = event.target.value;
  eyeMaterial.color.set(eyeColor);

  // Calcula e aplica a cor mais escura nas pupilas
  const darkerEyeColor = getDarkerColor(eyeColor, 0.5); // Reduz brilho pela metade
  pupilMaterial.color.set(darkerEyeColor);
});

document.getElementById("noseColor").addEventListener("input", (event) => {
  noseMaterial.color.set(event.target.value);
});

document.getElementById("tailTipColor").addEventListener("input", (event) => {
  tailMaterial.color.set(event.target.value);
});

document.getElementById("resetColors").addEventListener("click", () => {
  catMaterial.color.set(originalColors.body);
  eyeMaterial.color.set(originalColors.eyes);
  pupilMaterial.color.set(originalColors.pupils);
  noseMaterial.color.set(originalColors.nose);
  tailMaterial.color.set(originalColors.tailTip); // Resetar cor da ponta da cauda

  // Atualizar os valores dos inputs
  document.getElementById("bodyColor").value = `#${originalColors.body
    .toString(16)
    .padStart(6, "0")}`;
  document.getElementById("eyeColor").value = `#${originalColors.eyes
    .toString(16)
    .padStart(6, "0")}`;
  document.getElementById("noseColor").value = `#${originalColors.nose
    .toString(16)
    .padStart(6, "0")}`;
  document.getElementById("tailTipColor").value = `#${originalColors.tailTip
    .toString(16)
    .padStart(6, "0")}`;
});

// Função para calcular uma cor mais escura
function getDarkerColor(hexColor, factor = 0.5) {
  const color = new THREE.Color(hexColor);
  color.multiplyScalar(factor); // Escurece a cor multiplicando por um fator (menor que 1)
  return color.getHex();
}

// ============= MENU - CHANCHE SIZE  =============

// Add size control event listeners
document.getElementById("bodySize").addEventListener("input", (event) => {
  const scale = parseFloat(event.target.value);
  const previousScale = body.scale.x;
  const scaleFactor = scale / previousScale;

  // Store original positions and current scales of children
  const originalChildren = [...body.children];
  const originalPositions = originalChildren.map((child) =>
    child.position.clone()
  );
  const currentScales = originalChildren.map((child) => child.scale.clone());
  const originalY = body.position.y;

  // Scale body
  body.scale.set(scale, scale, scale);
  body.position.y = originalY;

  // Restore children positions and adjust scales relatively
  originalChildren.forEach((child, index) => {
    const newScale = currentScales[index].x / scaleFactor;
    child.scale.set(newScale, newScale, newScale);
    child.position.copy(originalPositions[index]);
  });

  // Do the same for clone
  if (secondCatGroup) {
    const cloneBody = secondCatGroup.getObjectByName("body");
    const cloneChildren = [...cloneBody.children];
    const clonePositions = cloneChildren.map((child) => child.position.clone());
    const cloneScales = cloneChildren.map((child) => child.scale.clone());
    const cloneOriginalY = cloneBody.position.y;

    cloneBody.scale.set(scale, scale, scale);
    cloneBody.position.y = cloneOriginalY;

    cloneChildren.forEach((child, index) => {
      const newScale = cloneScales[index].x / scaleFactor;
      child.scale.set(newScale, newScale, newScale);
      child.position.copy(clonePositions[index]);
    });
  }
});

document.getElementById("headSize").addEventListener("input", (event) => {
  const scale = parseFloat(event.target.value);

  const cloneHead = secondCatGroup.getObjectByName("head");
  cloneHead.scale.set(scale, scale, scale);

  head.scale.set(scale, scale, scale);
});

document.getElementById("tailSize").addEventListener("input", (event) => {
  const scale = parseFloat(event.target.value);

  // Scale tail horizontally (X and Z)
  secondCatGroup.getObjectByName("tailBase").scale.set(scale, 1, scale);
  tailBase.scale.set(scale, 1, scale);
});

document.getElementById("legsSize").addEventListener("input", (event) => {
  const scale = parseFloat(event.target.value);

  // Scale legs horizontally (X and Z only)
  const legs = ["rightFrontLeg", "leftFrontLeg", "rightBackLeg", "leftBackLeg"];

  // Update clone legs
  legs.forEach((legName) => {
    const cloneLeg = secondCatGroup.getObjectByName(legName);
    if (cloneLeg) cloneLeg.scale.set(scale, 1, scale);
  });

  // Update original legs
  rightFrontLeg.scale.set(scale, 1, scale);
  leftFrontLeg.scale.set(scale, 1, scale);
  rightBackLeg.scale.set(scale, 1, scale);
  leftBackLeg.scale.set(scale, 1, scale);
});

document.getElementById("resetSize").addEventListener("click", () => {
  const inputs = ["bodySize", "headSize", "tailSize", "legsSize"];

  // Reset slider values
  inputs.forEach((id) => {
    document.getElementById(id).value = 1.1;
  });

  // Reset original cat
  catGroup.scale.set(1, 1, 1);
  catGroup.position.set(0, 0.1, 0); // Reset to original position

  [body, head, tailBase].forEach((part) => {
    part.scale.set(1, 1, 1);
  });

  [rightFrontLeg, leftFrontLeg, rightBackLeg, leftBackLeg].forEach((leg) => {
    leg.scale.set(1, 1, 1);
  });

  // Reset clone cat if it exists
  if (secondCatGroup) {
    secondCatGroup.scale.set(1, 1, 1);
    secondCatGroup.position.set(0, 0.8, 0);

    ["body", "head", "tailBase"].forEach((partName) => {
      const part = secondCatGroup.getObjectByName(partName);
      if (part) part.scale.set(1, 1, 1);
    });

    ["rightFrontLeg", "leftFrontLeg", "rightBackLeg", "leftBackLeg"].forEach(
      (legName) => {
        const leg = secondCatGroup.getObjectByName(legName);
        if (leg) leg.scale.set(1, 1, 1);
      }
    );
  }
});

// ============= ANIMATION FUNCTION =============

function animate() {
  requestAnimationFrame(animate);

  if (isCustomizing) {
    customizeOrbitControls.update();
    renderer.render(customizeScene, customizeCamera);
    return;
  }
  updateTail();
  updateBlinking();
  updateWalking();
  updateMovement();
  updateCamera();

  controls.update();
  renderer.render(mainScene, activeCamera);

  updateFPS();
}

animate();

// ============= WINDOWS RESIZE =============

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  customizeCamera.aspect = width / height;
  customizeCamera.updateProjectionMatrix();

  moveSpeed = BASE_MOVE_SPEED * getScreenSizeFactor();
});
