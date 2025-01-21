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
    const floorSurface = floorBottom / 1.15 + floorHeight;
  
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
  
    if (isCustomizing) {
      customizeControls.update();
      renderer.render(customizeScene, customizeCamera);
    } else {
      updateTail();
      updateBlinking();
      updateWalking();
      updateMovement();
      updateCamera();
      updateGravity();
  
      controls.update();
      renderer.render(mainScene, activeCamera);
    }
  
    updateFPS();
  }
  
  animate();
  
  const textureLoader = new THREE.TextureLoader();
const grassTexture = textureLoader.load('Assets/Textures/grass.jpg');
const grassNormalMap = textureLoader.load('Assets/Textures/grass_normal.jpg');
const grassBumpMap = textureLoader.load('Assets/Textures/grass_height.jpg');

// Set texture properties
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(3, 3);

// Update floor material with normal and bump mapping
floor.material = new THREE.MeshStandardMaterial({
    map: grassTexture,
    normalMap: grassNormalMap,
    bumpMap: grassBumpMap,
    bumpScale: 0.1,
    roughness: 0.8,
    metalness: 0.2
});