const THREE = window.MINDAR.IMAGE.THREE;
import {loadGLTF, loadVideo} from './libs/loader.js'
/* import { CSS3DRenderer } from '/libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer';
 */



/* import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';
 */

console.log(loadGLTF);

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: './assets/target/coevo.mind',
    });
    /* const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: './assets/target/coevo.mind',
    }); */
    const {renderer, scene, camera} = mindarThree;

    // VIDEO
    /* const video = await loadVideo("./assets/videos/videotest.mp4") */
    /* const texture = new THREE.VideoTexture(video); */
    const texture = new THREE.TextureLoader().load('/assets/images/test.png' ); 

    const geometry = new THREE.PlaneGeometry(0.5,1080/1920)
    const material = new THREE.MeshBasicMaterial({map:texture})
    const plane = new THREE.Mesh(geometry, material)
    plane.position.set(0.7,0,0)

    const texture2 = new THREE.TextureLoader().load('/assets/images/About.png' ); 

    const geometry2 = new THREE.PlaneGeometry(0.9,512/960)
    const material2 = new THREE.MeshBasicMaterial({map:texture2})
    const plane2 = new THREE.Mesh(geometry2, material2)
    plane2.position.set(0,-0.4,0)


 
    //LIGHT
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 20 );
    scene.add(light);

    // MODEL
    const gltf = await loadGLTF('/assets/models/ImagenLogoCoevo4+Animation.gltf');
    gltf.scene.scale.set(0.8, 0.8, 0.8);
    gltf.scene.rotation.set(90, 0, 0);
    gltf.scene.position.set(0, 0.4, 0);

    console.log(gltf);

    // CSS RENDER
  /*   const obj = new THREE.CSS3DObject(document.querySelector("#ar-div"))  */


    // AR ANCHOR
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(gltf.scene, plane, plane2);

   /*  anchor.onTargetFound = () => {
      video.play()
    }

    anchor.onTargetLost = () => {
      video.pause()
    }

    video.addEventListener("play", () => {
      video.currentTime = 6;
    })
 */
    //gltf animations

    const mixer = new THREE.AnimationMixer(gltf.scene)
    const action = mixer.clipAction(gltf.animations[0])
    action.play()

    const clock = new THREE.Clock()

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      mixer.update(delta)
      renderer.render(scene, camera);
    });
  }
  start();
});
