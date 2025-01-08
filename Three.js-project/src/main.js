import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import getStarfield from './getStarfield.js';
import { getFresnelMat } from './getFresnelMat.js';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera
(75,
window.innerWidth / window.innerHeight,
0.1,
1000);
camera.position.z = 5;

const controls = new OrbitControls
(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;




const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
const loader = new THREE.TextureLoader();
const geo = new THREE.IcosahedronGeometry(1.0, 12);
const mat = new THREE.MeshStandardMaterial
({
map: loader.load('./textures/00_earthmap1k.jpg'),
})

const earthMesh = new THREE.Mesh(geo, mat);
earthMesh.position.set(0, 0, 0);
// const hemiLeight = new THREE.HemisphereLight
// ("white", 0xaa5500, 1);

const fresnelMat = getFresnelMat();
const fresnelMesh = new THREE.Mesh(geo, fresnelMat);
fresnelMesh.scale.setScalar(1.01);

const cloadMat = new THREE.MeshBasicMaterial({
    map: loader.load("./textures/04_earthcloudmap.jpg"),
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    alphaMap: loader.load("./textures/05_earthcloudmaptrans.jpg"),
  });

const cloudsMesh = new THREE.Mesh(geo, cloadMat);
cloudsMesh.scale.setScalar(1.003);

const lightsMat = new THREE.MeshBasicMaterial({
    map: loader.load("./textures/03_earthlights1k.jpg"),
    blending: THREE.AdditiveBlending,
  });

const lightsMesh = new THREE.Mesh(geo, lightsMat)
const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(2, 0.5, 2);

const stars = getStarfield({numStars: 2000});
scene.add(stars);
earthGroup.add(earthMesh, lightsMesh, cloudsMesh, fresnelMesh);

scene.add(earthGroup, sunLight);


function animate(t = 0) {
    requestAnimationFrame(animate);
    earthMesh.rotation.y = t * 0.0002;
    lightsMesh.rotation.y = t * 0.0002;
    cloudsMesh.rotation.y = t * 0.0003;
    fresnelMesh.rotation.y = t * 0.0002;
    renderer.render(scene, camera);
    controls.update();
}

animate();

