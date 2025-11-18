<template>
  <div ref="container" class="viewer-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'; // <-- 引入新加载器

const props = defineProps({
  modelPath: {
    type: String,
    required: true
  }
});

const container = ref(null);
let renderer, scene, camera, controls, animationFrameId;

onMounted(() => {
  initThree();
  animate();
  window.addEventListener('resize', onWindowResize);
});

onUnmounted(() => {
  // 清理资源
  window.removeEventListener('resize', onWindowResize);
  cancelAnimationFrame(animationFrameId);
  if (renderer) renderer.dispose();
  // ...更详细的清理逻辑可以像之前那样添加
});

function initThree() {
  // 场景
  scene = new THREE.Scene();
  // --- 【问题2解决】恢复灰白色背景 ---
  scene.background = new THREE.Color(0xf5f5f5);

  // 相机
  camera = new THREE.PerspectiveCamera(50, container.value.clientWidth / container.value.clientHeight, 0.1, 1000);
  camera.position.set(0, 0.5, 3.5);

  // 渲染器
  // --- 【问题2解决】移除 alpha:true ---
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.exposure = 1; 
  container.value.appendChild(renderer.domElement);

  // --- 【问题1解决】使用环境贴图提供高级光照 ---
  const rgbeLoader = new RGBELoader();
  // 确保你的.hdr文件路径正确
  rgbeLoader.load('/hdri/neutral_studio_1k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    // 将环境贴图应用到场景，所有物体都会被它照亮
    scene.environment = texture; 
    scene.environmentIntensity = 0.45; 
  });

  // 控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.7;
  controls.target.set(0, 0, 0);

  // 加载模型 (这部分代码保持不变)
  const loader = new GLTFLoader();
  loader.load(
    props.modelPath, 
    (gltf) => {
      const model = gltf.scene;

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const desiredSize = 3.0;
      const scale = desiredSize / maxDim;
      model.scale.setScalar(scale);

      const newBox = new THREE.Box3().setFromObject(model);
      const newCenter = newBox.getCenter(new THREE.Vector3());
      model.position.sub(newCenter);

      scene.add(model);
    },
    undefined,
    (error) => {
      console.error(`An error happened while loading model: ${props.modelPath}`, error);
    }
  );
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = container.value.clientWidth / container.value.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
}

function animate() {
  animationFrameId = requestAnimationFrame(animate);
  if (controls) controls.update();
  if (renderer && scene && camera) renderer.render(scene, camera);
}
</script>

<style scoped>
.viewer-container {
  width: 100%;
  height: 100%;
  cursor: grab;
}
.viewer-container:active {
  cursor: grabbing;
}
</style>