const THREE = require("./three");
const GLTFLoader = require("three-gltf-loader");
// const dat = require("dat.gui");
// const gui = new dat.GUI();
// gui.close();

const loader = new GLTFLoader();

loader.load(
  "./src/assets/Exports/RoomModel.glb",
  function (gltf) {
    const loadedScene = gltf.scene;

    // Enable shadows
    loadedScene.traverse((obj) => {
      if (obj.castShadow !== undefined) {
        obj.receiveShadow = true;

        if (obj.name !== "HouseWalls") {
          obj.castShadow = true;
        }
      }
    });

    scene.add(loadedScene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// this is a helper class
// class ColorGUIHelper {
//   constructor(object, prop) {
//     this.object = object;
//     this.prop = prop;
//   }
//   get value() {
//     return `#${this.object[this.prop].getHexString()}`;
//   }
//   set value(hexString) {
//     this.object[this.prop].set(hexString);
//   }
// }

const scene = new THREE.Scene();
scene.background = new THREE.Color("#141414");
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });

// remember these initial values
var tanFOV = Math.tan(((Math.PI / 180) * camera.fov) / 2);
var windowHeight = window.innerHeight;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// function makeXYZGUI(gui, vector3, name, onChangeFn) {
//   const folder = gui.addFolder(name);
//   folder.add(vector3, "x", -20, 20).onChange(onChangeFn);
//   folder.add(vector3, "y", 0, 20).onChange(onChangeFn);
//   folder.add(vector3, "z", -20, 20).onChange(onChangeFn);
//   folder.open();
// }

// function makeRotationGUI(gui, vector3, name, onChangeFn) {
//   const folder = gui.addFolder(name);
//   folder.add(vector3, "x", -3, 3).step(0.1).onChange(onChangeFn);
//   folder.add(vector3, "y", -3, 3).step(0.1).onChange(onChangeFn);
//   folder.add(vector3, "z", -3, 3).step(0.1).onChange(onChangeFn);
//   folder.open();
// }

// Light
let colorH = 0;
const color = 0xc6a8ff;
const intensity = 0.62;
const light = new THREE.PointLight(color, intensity);
light.position.set(2.7, 2.5, -2.4);
// light.target.position.set(0, 2.3, 0);
light.castShadow = true;
light.shadow.bias = -0.0001;
light.shadow.mapSize.width = 512;
light.shadow.mapSize.height = 512;

scene.add(light);
// const helper = new THREE.PointLightHelper(light, 0.2);
// scene.add(helper);
// gui.addColor(new ColorGUIHelper(light, "color"), "value").name("color");
// gui.add(light, "intensity", 1, 2, 0.01);
// gui.add(light.shadow, "bias", -0.1, 0.1, 0.0001);

const deskLight = new THREE.PointLight(0xffffff, 0.1);
deskLight.castShadow = false;
deskLight.position.set(1, 3, 1);
scene.add(deskLight);

// gui.add(deskLight, "intensity", 0, 2, 0.01);

// camera.position.set(0, 6, 0);
camera.position.set(-4.8, 3, 1.8);
// camera.lookAt(scene.position);
camera.rotation.set(0, -1.25, 0);

// makeXYZGUI(gui, camera.position, "camera position");
// makeRotationGUI(gui, camera.rotation, "camera rotation");

const animate = function () {
  requestAnimationFrame(animate);
  colorH = (colorH + 1) % 360;
  const newColor = new THREE.Color(`hsl(${colorH}, 50%, 40%)`);
  light.color = newColor;
  renderer.render(scene, camera);
};

animate();

// Animating text

const nameText = "I'm Kaan Serin.";
let nameTextCounter = 0;
const name = document.querySelector(".name");
let descriptionInterval;

const typeName = (chars, el) => {
  if (nameTextCounter >= nameText.length) {
    window.clearInterval(intervalName);
    descriptionInterval = setInterval(
      () => typeDesc(descriptionText, description),
      50
    );
    return;
  }
  el.textContent += nameText.charAt(nameTextCounter++);
};

const intervalName = setInterval(() => typeName(nameText, name), 90);

const descriptionText =
  "I'm a passionate learner and an aspiring Full-Stack Developer from Cyprus.";
let descriptionTextCounter = 0;
const description = document.querySelector(".description");
const socials = document.querySelector(".socials");

const typeDesc = (chars, el) => {
  if (descriptionTextCounter >= descriptionText.length) {
    socials.classList.add("opacity-1");
    window.clearInterval(descriptionInterval);
    return;
  }
  el.textContent += descriptionText.charAt(descriptionTextCounter++);
};

// For window resize, credits go to => https://jsfiddle.net/psyrendust/8nbpehj3/
const onWindowResize = (event) => {
  camera.aspect = window.innerWidth / window.innerHeight;

  // adjust the FOV
  camera.fov =
    (360 / Math.PI) * Math.atan(tanFOV * (window.innerHeight / windowHeight));

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
};

window.addEventListener("resize", onWindowResize, false);

// Mouse camera tilt
let oldX = 0;
let oldY = 0;

const onMouseMove = (e) => {
  const { pageX, pageY } = e;
  const diffX = oldX - pageX;
  const diffY = oldY - pageY;
  camera.rotation.set(
    (camera.rotation.x += diffY * 0.0005),
    (camera.rotation.y += diffX * 0.0001),
    (camera.rotation.z += diffY * 0.0005)
  );
  // console.log(`diffX: ${diffX}, diffY: ${diffY}`);
  oldX = pageX;
  oldY = pageY;
};

document.addEventListener("mousemove", onMouseMove);

// Mobile Motion Detection
const mobileLookAmount = 2.5;
window.addEventListener("devicemotion", (e) => {
  // console.log(e.rotationRate);
  camera.rotation.set(
    (camera.rotation.x += (e.rotationRate.alpha * mobileLookAmount) / 20000),
    (camera.rotation.y += (e.rotationRate.beta * mobileLookAmount) / 50000),
    (camera.rotation.z += (e.rotationRate.alpha * mobileLookAmount) / 20000)
  );
});
