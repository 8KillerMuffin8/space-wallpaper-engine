import * as THREE from 'three';
const debug = document.getElementById('debug')
function getFresnelMat({rimHex = 0x0088ff, facingHex = 0x000000} = {}) {
    const uniforms = {
      color1: { value: new THREE.Color(rimHex) },
      color2: { value: new THREE.Color(facingHex) },
      fresnelBias: { value: 0.1 },
      fresnelScale: { value: 1.0 },
      fresnelPower: { value: 4.0 },
    };
    const vs = `
    uniform float fresnelBias;
    uniform float fresnelScale;
    uniform float fresnelPower;
    
    varying float vReflectionFactor;
    
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    
      vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
    
      vec3 I = worldPosition.xyz - cameraPosition;
    
      vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );
    
      gl_Position = projectionMatrix * mvPosition;
    }
    `;
    const fs = `
    uniform vec3 color1;
    uniform vec3 color2;
    
    varying float vReflectionFactor;
    
    void main() {
      float f = clamp( vReflectionFactor, 0.0, 1.0 );
      gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
    }
    `;
    const fresnelMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      blending: THREE.AdditiveBlending,
      // wireframe: true,
    });
    return fresnelMat;
  }

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const loader = new THREE.TextureLoader();

const renderer = new THREE.WebGLRenderer({alpha: true});
camera.position.z = 5.375;
camera.position.x = 0;
camera.position.y = 0
renderer.setSize( window.innerWidth, window.innerHeight );
const container = document.getElementById('earthContainer')
container.appendChild(renderer.domElement)
// document.body.appendChild( renderer.domElement );

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);

const detail = 18;
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("https://github.com/8KillerMuffin8/space-wallpaper-engine/blob/main/assets/earthmap.jpg?raw=true"),
  specularMap: loader.load("https://github.com/bobbyroe/threejs-earth/blob/main/textures/02_earthspec1k.jpg?raw=true",),
  bumpMap: loader.load("https://github.com/8KillerMuffin8/space-wallpaper-engine/blob/main/assets/earthbump.jpg?raw=true"),
  bumpScale: 0.1,
});


const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
    map: loader.load("https://github.com/8KillerMuffin8/space-wallpaper-engine/blob/main/assets/earthlights.jpg?raw=true"),
    blending: THREE.AdditiveBlending,
  });
  const lightsMesh = new THREE.Mesh(geometry, lightsMat);
  earthGroup.add(lightsMesh);

  const cloudsMat = new THREE.MeshStandardMaterial({
    map: loader.load("https://github.com/8KillerMuffin8/space-wallpaper-engine/blob/main/assets/earthclouds.jpg?raw=true"),
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending,
    alphaMap: loader.load('https://github.com/8KillerMuffin8/space-wallpaper-engine/blob/main/assets/earthcloudtrans.jpg?raw=true'),
    // alphaTest: 0.3,
  });
  const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
  cloudsMesh.scale.setScalar(1.003);
  earthGroup.add(cloudsMesh);

  const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);


const sunLight = new THREE.DirectionalLight(0xffffff, 2);
sunLight.position.set(-2, 1, 1);
scene.add(sunLight);

function animate() {
	requestAnimationFrame( animate );

    earthMesh.rotation.y += 0.001;
    lightsMesh.rotation.y += 0.001;
    cloudsMesh.rotation.y += 0.0015;
    glowMesh.rotation.y += 0.001;

	renderer.render( scene, camera );
}

animate();