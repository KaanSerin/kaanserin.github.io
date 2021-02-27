const THREE = require("./three");
const GLTFLoader = require("three-gltf-loader");
const dat = require("dat.gui");

const gui = new dat.GUI();
gui.close();
const loader = new GLTFLoader();

loader.load(
  "./assets/Exports/RoomModel.glb",
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

    console.log(loadedScene);
    scene.add(loadedScene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// this is a helper class
class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

const scene = new THREE.Scene();
scene.background = new THREE.Color("#141414");
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// const turnCamera = true;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

function makeXYZGUI(gui, vector3, name, onChangeFn) {
  const folder = gui.addFolder(name);
  folder.add(vector3, "x", -20, 20).onChange(onChangeFn);
  folder.add(vector3, "y", 0, 20).onChange(onChangeFn);
  folder.add(vector3, "z", -20, 20).onChange(onChangeFn);
  folder.open();
}

function makeRotationGUI(gui, vector3, name, onChangeFn) {
  const folder = gui.addFolder(name);
  folder.add(vector3, "x", -3, 3).step(0.1).onChange(onChangeFn);
  folder.add(vector3, "y", -3, 3).step(0.1).onChange(onChangeFn);
  folder.add(vector3, "z", -3, 3).step(0.1).onChange(onChangeFn);
  folder.open();
}

// Light
let colorH = 0;
const color = 0xc6a8ff;
const intensity = 0.62;
const light = new THREE.PointLight(color, intensity);
light.position.set(2.7, 2.5, -2.4);
// light.target.position.set(0, 2.3, 0);
light.castShadow = true;
light.shadow.bias = -0.0001;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;

scene.add(light);
// const helper = new THREE.PointLightHelper(light, 0.2);
// scene.add(helper);
gui.addColor(new ColorGUIHelper(light, "color"), "value").name("color");
gui.add(light, "intensity", 1, 2, 0.01);
gui.add(light.shadow, "bias", -0.1, 0.1, 0.0001);

const deskLight = new THREE.PointLight(0xffffff, 0.1);
deskLight.castShadow = false;
deskLight.position.set(1, 3, 1);
scene.add(deskLight);
// const deskLightHelper = new THREE.PointLightHelper(deskLight, 0.2);
// scene.add(deskLightHelper);
// makeXYZGUI(gui, deskLight.position, "deskLightposition", updateLight);
gui.add(deskLight, "intensity", 0, 2, 0.01);

// const ambLight = new THREE.AmbientLight(0xaaaaaa, 1);
// scene.add(ambLight);

// function updateLight() {
//   helper.update();
// }

// class DegRadHelper {
//   constructor(obj, prop) {
//     this.obj = obj;
//     this.prop = prop;
//   }
//   get value() {
//     return THREE.MathUtils.radToDeg(this.obj[this.prop]);
//   }
//   set value(v) {
//     this.obj[this.prop] = THREE.MathUtils.degToRad(v);
//   }
// }

// makeXYZGUI(gui, light.position, "position", updateLight);
// makeXYZGUI(gui, light.target.position, "target", updateLight);
// gui
//   .add(new DegRadHelper(light, "angle"), "value", 0, 90)
//   .name("angle")
//   .onChange(updateLight);
// makeXYZGUI(gui, light.position, "position", updateLight);

// camera.position.set(0, 6, 0);
camera.position.set(-4.8, 3.6, 1.8);
// camera.lookAt(scene.position);
camera.rotation.set(0, -1.25, 0);

makeXYZGUI(gui, camera.position, "camera position");
makeRotationGUI(gui, camera.rotation, "camera rotation");

// function checkRotation() {
//   if (!turnCamera) return;
//   const rotSpeed = 0.003;
//   var x = camera.position.x,
//     z = camera.position.z;

//   // if (keyboard.pressed("left")) {
//   camera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
//   camera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
//   // } else if (keyboard.pressed("right")) {
//   //   camera.position.x = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
//   //   camera.position.z = z * Math.cos(rotSpeed) + x * Math.sin(rotSpeed);
//   // }

//   camera.lookAt(scene.position);
// }

const animate = function () {
  requestAnimationFrame(animate);
  // scene.children[2].rotation += 0.01;
  // checkRotation();
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
      90
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
