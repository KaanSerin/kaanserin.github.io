const THREE = require("./three");
const GLTFLoader = require("three-gltf-loader");
const dat = require("dat.gui");

const gui = new dat.GUI();
const loader = new GLTFLoader();

loader.load(
  "../assets/Exports/RoomModel.glb",
  function (gltf) {
    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function makeXYZGUI(gui, vector3, name, onChangeFn) {
  const folder = gui.addFolder(name);
  folder.add(vector3, "x", -10, 10).onChange(onChangeFn);
  folder.add(vector3, "y", 0, 10).onChange(onChangeFn);
  folder.add(vector3, "z", -10, 10).onChange(onChangeFn);
  folder.open();
}

// Light
const color = 0xffffff;
const intensity = 0;
const light = new THREE.PointLight(color, intensity);
light.position.set(-6, 0, 0);
scene.add(light);

const ambLight = new THREE.AmbientLight(0xaaaaaa, 1);
scene.add(ambLight);

const helper = new THREE.PointLightHelper(light);
// scene.add(helper);

function updateLight() {
  helper.update();
}

makeXYZGUI(gui, light.position, "position", updateLight);

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

gui.add;
gui.addColor(new ColorGUIHelper(light, "color"), "value").name("color");
gui.add(light, "intensity", 0, 2, 0.01);

camera.position.set(1, 1, 3);

makeXYZGUI(gui, camera.position, "camera position");

const animate = function () {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();
