<template>
  <div class="inherit-container">
    <div class="toolbar">
      <!-- 核心修正点 1：增加一个返回首页的按钮 -->
      <div class="tool-group navigation-group">
        <router-link to="/" class="back-home-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          <span>返回首页</span>
        </router-link>
      </div>

      <!-- 工具栏 -->
      <div class="tool-group">
        <label>笔毫:</label>
        <button @click="setBrush('langhao')" :class="{active: brush.type === 'langhao'}">狼毫</button>
        <button @click="setBrush('jianhao')" :class="{active: brush.type === 'jianhao'}">兼毫</button>
      </div>
      <div class="tool-group">
        <label>墨色:</label>
        <button @click="setInk('nongmo')" :class="{active: ink.color === '#1A1A1A'}">浓墨</button>
        <button @click="setInk('danmo')" :class="{active: ink.color === '#666666'}">淡墨</button>
      </div>
      <div class="tool-group">
        <button @click="clearCanvas">清空画板</button>
        <button @click="toggleLinmo">临摹《兰亭序》</button>
      </div>

      <!-- 完成按钮放在最右侧 -->
      <div class="tool-group action-group">
        <button @click="saveAndNext" class="next-step-btn">完成创作，前往生成</button>
      </div>
    </div>
    
    <div class="canvas-wrapper">
      <canvas ref="canvasRef"></canvas>
      <img v-if="showLinmo" src="/images/lantingxu.png" class="linmo-bg" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useArtStore } from '../store/artStore';

const canvasRef = ref(null);
const router = useRouter();
const artStore = useArtStore();
let ctx, isDrawing = false, lastX = 0, lastY = 0;

const brush = reactive({ type: 'langhao', size: 10 });
const ink = reactive({ color: '#1A1A1A' });
const showLinmo = ref(false);

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  const wrapper = canvas.parentElement;
  canvas.width = wrapper.clientWidth;
  canvas.height = wrapper.clientHeight;

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);
});

function startDrawing(e) {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
  if (!isDrawing) return;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  
  const distance = Math.sqrt(Math.pow(e.offsetX - lastX, 2) + Math.pow(e.offsetY - lastY, 2));
  const speed = distance / 5;
  const newWidth = Math.max(brush.size / (speed + 1), brush.size / 5);
  
  ctx.lineWidth = newWidth;
  ctx.strokeStyle = ink.color;
  ctx.stroke();
  
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
  isDrawing = false;
}

function setBrush(type) {
  brush.type = type;
  brush.size = type === 'langhao' ? 10 : 15;
}

function setInk(type) {
  ink.color = type === 'nongmo' ? '#1A1A1A' : '#666666';
}

function clearCanvas() {
  if (canvasRef.value) {
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  }
}

function toggleLinmo() {
  showLinmo.value = !showLinmo.value;
}

function saveAndNext() {
  if (canvasRef.value) {
    const imageDataUrl = canvasRef.value.toDataURL('image/png');
    artStore.setArtwork(imageDataUrl);
    router.push('/create');
  }
}
</script>

<style lang="scss" scoped>
.inherit-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #eee;
}

/* --- 核心修正点 2：修改工具栏样式 --- */
.toolbar {
  display: flex;
  justify-content: space-between; // 两端对齐
  align-items: center;
  gap: 2rem;
  padding: 0.8rem 2rem; // 调整内边距
  background: var(--color-xuan-white);
  border-bottom: 1px solid var(--color-light-gray);
  flex-shrink: 0;
  
  .tool-group {
    display: flex;
    align-items: center;
    gap: 1rem; // 统一工具组内间距
  }

  .navigation-group {
    // 这个组在最左边
  }

  .action-group {
    // 这个组在最右边
  }

  label {
    font-family: var(--font-body);
    color: #666;
    font-size: 0.9rem;
  }

  button, .back-home-btn {
    font-family: var(--font-body);
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: 1px solid #ddd;
    background-color: white;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &.active { 
      background-color: var(--color-mo-black);
      color: white;
      border-color: var(--color-mo-black);
    }
    &:hover:not(.active) {
      border-color: var(--color-mo-black);
      color: var(--color-mo-black);
    }
  }

  .back-home-btn {
    border-color: transparent;
    color: #555;
    font-weight: 600;
    &:hover {
      background-color: #f5f5f5;
      color: var(--color-seal-red);
    }
    svg {
      width: 18px;
      height: 18px;
    }
  }

  .next-step-btn {
    background-color: var(--color-seal-red);
    color: white;
    border-color: var(--color-seal-red);
    font-weight: 600;
    &:hover { 
      color: white; 
      opacity: 0.9; 
    }
  }
}
.canvas-wrapper {
  flex-grow: 1;
  position: relative;
  background-image: url('/images/xuan-paper-texture.jpg');
  
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    cursor: crosshair;
  }
  .linmo-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0.15;
    pointer-events: none;
  }
}
</style>