import * as THREE from 'three';
// import * as img from './textures/00_earthmap1k.jpg'
// const img = require('./textures/00_earthmap1k.jpg')
const debug = document.getElementById('debug')

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const loader = new THREE.TextureLoader();
const renderer = new THREE.WebGLRenderer({alpha: true});

camera.position.z = 5;
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );
const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshStandardMaterial({
    map: loader.load("../assets/00_earthmap1k.jpg", null, null, (err) => {
        debug.innerText = JSON.stringify(err, null, 2)
    })
});
const earthMesh = new THREE.Mesh(geometry, material);
scene.add(earthMesh);

const hemiLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add(hemiLight)

function animate() {
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
}

animate();