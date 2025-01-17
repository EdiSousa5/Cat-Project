// ============= SCENE SETUP & CONSTANTS =============

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x00ced1);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// ============= CAMERA & CONTROLS =============
let isCustomizing = false;
let cameraFollowing = true;
let cameraOffset = new THREE.Vector3(12, 10, 2);

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
  1000
);
camera.position.set(5, 6, 5);

// Customize camera setup
const customizeCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
customizeCamera.position.set(33, 1, 33);
customizeCamera.lookAt(30, 0.7, 30);

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

// ============= LIGHTING =============

const ambientLight = new THREE.AmbientLight(0xffd6a5, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(25, 15, 10); // Luz vindo de cima
directionalLight.castShadow = true;
scene.add(directionalLight);

// ============= CAT CREATION & MATERIALS =============

const catMaterial = new THREE.MeshStandardMaterial({ color: 0x171617 }); // Cor preta
const tailMaterial = new THREE.MeshStandardMaterial({ color: 0xe4e4e4 }); // Cor branco escuro
const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 }); // Cor amarela
const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0xc26412 }); // Cor laranja escuro
const noseMaterial = new THREE.MeshStandardMaterial({ color: 0xda88a3 }); // Cor laranja escuro

const catGroup = new THREE.Group();

// ============= CAT BODY =============

const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 0.4), catMaterial);
body.position.set(0, 5, 0);
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
head.position.set(1, 0.2, 0); // Ajuste a posição relativa ao corpo
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

// ============= CAT NOSE =============

const topNose = new THREE.Mesh(
  new THREE.BoxGeometry(0.04, 0.04, 0.08),
  noseMaterial
);
topNose.position.set(0.35, 0, 0);
topNose.castShadow = true;
head.add(topNose);

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

// ============= OBJECTS CREATION =============

const floorGeometry = new THREE.BoxGeometry(10, 10, 0.5);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.set(0, -1, 0);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const boxMeterial = new THREE.MeshStandardMaterial({ color: 0xa35e5e });
const box = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 2), boxMeterial);
box.position.set(-3, -0.2, 3);
box.castShadow = true;
scene.add(box);

// ============= ADD CAT TO SCENE =============

scene.add(catGroup);

// ============= FPS =============

// Configuração do Canvas para o gráfico de FPS
const fpsCanvas = document.getElementById("fpsChart");
const fpsCtx = fpsCanvas.getContext("2d");
const fpsData = [];
const maxFrames = 50;

// Desenha o gráfico
function drawFpsChart() {
  fpsCtx.clearRect(0, 0, fpsCanvas.width, fpsCanvas.height);

  // Definir estilo do gráfico
  fpsCtx.strokeStyle = "blue";
  fpsCtx.lineWidth = 2;

  // Desenhar os dados de FPS
  fpsCtx.beginPath();
  fpsData.forEach((fps, index) => {
    const x = (index / maxFrames) * fpsCanvas.width;
    const y = fpsCanvas.height - (fps / 100) * fpsCanvas.height;
    fpsCtx.lineTo(x, y);
  });
  fpsCtx.stroke();
}

// Atualizar dados de FPS
function updateFpsChart(fps) {
  fpsData.push(fps);
  if (fpsData.length > maxFrames) fpsData.shift(); // Limitar dados ao máximo de frames
  drawFpsChart();
}

let lastFrameTime = performance.now(); // Inicialização de lastFrameTime

// ============= FLOOR CLICK =============

window.addEventListener("click", onFloorClick);

// Modify the onFloorClick function
function onFloorClick(event) {
  if (isCustomizing) return;

  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(floor);
  if (intersects.length > 0) {
    targetPosition = intersects[0].point;
    isMoving = true;
    isRotating = true;

    // Calculate target rotation with 90 degree offset
    const direction = new THREE.Vector2(
      targetPosition.x - catGroup.position.x,
      targetPosition.z - catGroup.position.z
    );
    targetRotation.y = Math.atan2(direction.x, direction.y) - Math.PI / 2;
  }
}

// ============= ANIMATION VARIABLES =============

let tailRotation = 0;
let isBlinking = false;
let blinkTime = 0;
let nextBlink = 500;
let holdClosedTime = 0;
let isWalking = false;
let walkTime = 0;

let targetPosition = null;
let isMoving = false;
const moveSpeed = 0.04;
let isRotating = false;
const rotationSpeed = 0.07;
const targetRotation = new THREE.Euler();

// Add at top with other state variables
let isSitting = false;
let sitProgress = 0;

// Add key listener
document.addEventListener("keydown", (event) => {
  if (event.key === "s" && !isCustomizing) {
    isSitting = !isSitting;
    sitProgress = isSitting ? 0 : 1;
  }
});

function updateSitting() {
  if (!isSitting && sitProgress === 0) return;
  if (isSitting && sitProgress === 1) return;

  sitProgress += isSitting ? 0.05 : -0.05;
  sitProgress = Math.max(0, Math.min(1, sitProgress));

  // Steeper angles for sitting
  const bodyRotation = sitProgress * (Math.PI / 2.4);    // ~75 degrees
  const backLegsRotation = sitProgress * Math.PI;        // 180 degrees
  const headRotation = sitProgress * (Math.PI / 8);      // Slight head tilt

  // Body rotations
  body.rotation.z = bodyRotation;
  head.rotation.z = -headRotation;

  // Back legs flat forward
  rightBackLeg.rotation.z = -backLegsRotation;
  leftBackLeg.rotation.z = -backLegsRotation;

  // Front legs compensate to stay vertical and reach ground
  const frontLegCompensation = -bodyRotation * 1.2; // Extra factor to reach ground
  rightFrontLeg.rotation.z = frontLegCompensation;
  leftFrontLeg.rotation.z = frontLegCompensation;

  // Tail parallel to ground
  tailBase.rotation.z = Math.PI / 2;
  tailBase.rotation.x = 0;

  // Lower body more when sitting
  const bodyOffset = sitProgress * 0.7; // Increased offset
  body.position.y = floorSurface + scaledLegHeight - bodyOffset;
}

// ============= ANIMATE FUNCTIONS =============

function updateTail() {
  tailBase.rotation.y = Math.sin(tailRotation) * 0.1;
  tailRotation += 0.07;
}

function updateBlinking() {
  blinkTime += 2;

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
        nextBlink = 500;
      }
    }
  }
}

function updateWalking() {
  if (!isWalking) return;

  walkTime += 0.2;
  const legRotation = Math.sin(walkTime) * 0.5;
  rightFrontLeg.rotation.z = legRotation;
  leftBackLeg.rotation.z = legRotation;
  leftFrontLeg.rotation.z = -legRotation;
  rightBackLeg.rotation.z = -legRotation;

  body.position.y += 0.0006 * Math.cos(walkTime);
}

function updateMovement() {
  if (!isMoving || !targetPosition) return;

  if (isRotating) {
    const currentRotation = catGroup.rotation.y;
    const rotationDiff = targetRotation.y - currentRotation;
    const normalizedDiff = ((rotationDiff + Math.PI) % (Math.PI * 2)) - Math.PI;

    if (Math.abs(normalizedDiff) > 0.05) {
      catGroup.rotation.y += Math.sign(normalizedDiff) * rotationSpeed;
    } else {
      isRotating = false;
      isWalking = true;
    }
  } else {
    const distance = new THREE.Vector2(
      targetPosition.x - catGroup.position.x,
      targetPosition.z - catGroup.position.z
    ).length();

    if (distance > 0.1) {
      const direction = new THREE.Vector2(
        targetPosition.x - catGroup.position.x,
        targetPosition.z - catGroup.position.z
      ).normalize();

      catGroup.position.x += direction.x * moveSpeed;
      catGroup.position.z += direction.y * moveSpeed;
    } else {
      isMoving = false;
      isWalking = false;
      targetPosition = null;

      rightFrontLeg.rotation.z = 0;
      leftBackLeg.rotation.z = 0;
      leftFrontLeg.rotation.z = 0;
      rightBackLeg.rotation.z = 0;
    }
  }
}

function updateFPS() {
  const now = performance.now();
  const fps = 1000 / (now - lastFrameTime);
  lastFrameTime = now;

  updateFpsChart(fps);
  document.getElementById("fpsValue").textContent = Math.round(fps);
}

// ============= WINDOWS REZISE =============

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  customizeCamera.aspect = width / height;
  customizeCamera.updateProjectionMatrix();
});

// ============= HTML =============

// Add to existing code
const mainControls = document.getElementById("mainControls");
const customizeButton = document.getElementById("customizeButton");
const customizeMenu = document.getElementById("customizeMenu");
const closeCustomizeButton = document.getElementById("closeCustomize");

// Update customize button click handler

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

// ============= COSTUMIZE MENU =============

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

secondCatGroup.position.set(
  30, // X position
  floorSurface + scaledLegHeight, // Y position at floor surface + leg height
  30 // Z position
);
secondCatGroup.visible = false;
scene.add(secondCatGroup);

customizeButton.addEventListener("click", () => {
  isCustomizing = true;
  mainControls.style.display = "none";
  customizeMenu.style.display = "block";

  // Get clone cat position
  const clonePosition = new THREE.Vector3();
  secondCatGroup.getWorldPosition(clonePosition);

  // Set camera position with better offsets
  customizeCamera.position.set(
    clonePosition.x + 3, // Closer on X
    clonePosition.y + 0.5, // Lower camera
    clonePosition.z + 3 // Closer on Z
  );
  customizeCamera.lookAt(clonePosition);

  secondCatGroup.visible = true;
  activeCamera = customizeCamera;
  controls.enabled = false;
  customizeControls.enabled = true;
  cameraFollowing = false;
});

// Modify close button handler
closeCustomizeButton.addEventListener("click", () => {
  isCustomizing = false;
  mainControls.style.display = "block";
  customizeMenu.style.display = "none";
  secondCatGroup.visible = false;
  activeCamera = camera;
  controls.enabled = true;
  customizeControls.enabled = false;
  cameraFollowing = true;
});

// Add size control event listeners
document.getElementById("bodySize").addEventListener("input", (event) => {
  const scale = parseFloat(event.target.value);
  const cloneBody = secondCatGroup.getObjectByName("body");
  cloneBody.scale.set(scale, scale, scale);
  body.scale.set(scale, scale, scale);
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

  // Scale legs vertically (Y only)
  const legs = ["rightFrontLeg", "leftFrontLeg", "rightBackLeg", "leftBackLeg"];

  // Update clone legs
  legs.forEach((legName) => {
    const cloneLeg = secondCatGroup.getObjectByName(legName);
    if (cloneLeg) cloneLeg.scale.set(1, scale, 1);
  });

  // Update original legs
  rightFrontLeg.scale.set(1, scale, 1);
  leftFrontLeg.scale.set(1, scale, 1);
  rightBackLeg.scale.set(1, scale, 1);
  leftBackLeg.scale.set(1, scale, 1);
});

document.getElementById("resetSize").addEventListener("click", () => {
  const inputs = ["bodySize", "headSize", "tailSize", "legsSize"];
  inputs.forEach((id) => {
    document.getElementById(id).value = 1;

    // Reset original cat
    const element =
      id === "bodySize"
        ? body
        : id === "headSize"
        ? head
        : id === "tailSize"
        ? tailBase
        : null;

    if (element) {
      element.scale.set(1, 1, 1);
    } else if (id === "legsSize") {
      [rightFrontLeg, leftFrontLeg, rightBackLeg, leftBackLeg].forEach(
        (leg) => {
          leg.scale.set(1, 1, 1);
        }
      );
    }

    // Reset clone cat
    if (secondCatGroup) {
      const cloneElement = secondCatGroup.getObjectByName(
        id === "bodySize"
          ? "body"
          : id === "headSize"
          ? "head"
          : id === "tailSize"
          ? "tailBase"
          : null
      );

      if (cloneElement) {
        cloneElement.scale.set(1, 1, 1);
      } else if (id === "legsSize") {
        [
          "rightFrontLeg",
          "leftFrontLeg",
          "rightBackLeg",
          "leftBackLeg",
        ].forEach((legName) => {
          const cloneLeg = secondCatGroup.getObjectByName(legName);
          if (cloneLeg) cloneLeg.scale.set(1, 1, 1);
        });
      }
    }
  });
});

// ============= GRAVITY =============

const PHYSICS = {
  GRAVITY: 0.01,
  FLOOR_Y: floor.position.y,
};
let verticalVelocity = 0;

function updateGravity() {
  // Get floor actual position (bottom of floor mesh)
  const floorBottom = PHYSICS.FLOOR_Y;

  // Get floor depth (z-dimension)
  const floorHeight = floor.geometry.parameters.depth;
  const floorSurface = floorBottom / 1.05 + floorHeight;

  // Rest of gravity calculation
  const baseLegHeight = rightFrontLeg.geometry.parameters.height;
  const legScale = rightFrontLeg.scale.y;
  const scaledLegHeight = baseLegHeight * legScale;
  const targetHeight = floorSurface + scaledLegHeight / 2;

  // Apply gravity
  if (body.position.y > targetHeight) {
    verticalVelocity += PHYSICS.GRAVITY;
    body.position.y -= verticalVelocity;

    if (body.position.y <= targetHeight) {
      body.position.y = targetHeight;
      verticalVelocity = 0;
    }
  } else {
    body.position.y = targetHeight;
    verticalVelocity = 0;
  }
}

// ============= ANIMATION FUNCTION =============

function animate() {
  requestAnimationFrame(animate);

  updateTail();
  updateBlinking();
  updateWalking();
  updateMovement();
  updateCamera();
  updateGravity();
  updateSitting();

  if (isCustomizing) {
    customizeControls.update();
  }

  controls.update();
  renderer.render(scene, activeCamera);

  updateFPS();
}

animate();
