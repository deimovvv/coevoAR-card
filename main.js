const THREE = window.MINDAR.IMAGE.THREE;
import {loadGLTF, loadVideo} from './libs/loader.js'
/* import {CSS3DObject} from './libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer' */


console.log(loadGLTF);

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: './assets/target/coevo.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    // VIDEO
    /* const video = await loadVideo("./assets/videos/videotest.mp4") */
    /* const texture = new THREE.VideoTexture(video); */
    const texture = new THREE.TextureLoader().load('/assets/images/BosqueDeimov.png' ); 

    const geometry = new THREE.PlaneGeometry(0.5,1080/1920)
    const material = new THREE.MeshBasicMaterial({map:texture})
    const plane = new THREE.Mesh(geometry, material)
    plane.position.set(0.6,0,0)

 
    //LIGHT
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 50 );
    scene.add(light);

    // MODEL
    const gltf = await loadGLTF('/assets/models/ImagenLogoCoevo4+Animation.gltf');
    gltf.scene.scale.set(0.8, 0.8, 0.8);
    gltf.scene.rotation.set(90, 0, 0);
    gltf.scene.position.set(0, 0.4, 0);

    // CSS RENDER
    /* const obj = new CSS3DObject(document.querySelector("#ar-div")) */


    // AR ANCHOR
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(gltf.scene, plane);

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
