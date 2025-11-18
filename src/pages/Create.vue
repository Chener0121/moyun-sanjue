<template>
  <div class="create-container">
    <header class="page-header">
      <router-link to="/" class="back-home-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        <span>返回首页</span>
      </router-link>
      <div class="title-group">
        <h1 class="page-title">用·创</h1>
        <p class="page-subtitle">融古于今，将诗意融入日常</p>
      </div>
      <div class="header-placeholder"></div>
    </header>

    <div v-if="!artStore.artworkUrl" class="no-artwork-prompt">
      <h2>您尚未创作</h2>
      <p>请先前往“承·艺”板块挥洒笔墨，或从我们的名家库中汲取灵感。</p>
      <div class="prompt-actions">
        <router-link to="/inherit" class="action-btn primary">前往创作</router-link>
        <button @click="useSampleArtwork" class="action-btn">使用范例</button>
      </div>
    </div>

    <div v-else class="editor-area">
      <div class="product-list">
        <h3>选择载体</h3>
        <div 
          v-for="p in products" 
          :key="p.name" 
          @click="selectedProduct = p" 
          class="product-item"
          :class="{ active: selectedProduct.name === p.name }"
        >
          <div class="item-icon">
            <img :src="p.icon" :alt="p.name">
          </div>
          <span>{{ p.name }}</span>
        </div>
      </div>

      <div class="preview-area">
        <div class="preview-canvas-wrapper" ref="previewWrapperRef">
          <canvas 
            ref="previewCanvasRef"
            @mousedown="startDrag"
            @mousemove="drag"
            @mouseup="endDrag"
            @mouseleave="endDrag"
          ></canvas>
        </div>
      </div>

      <div class="controls-area">
        <h3>调整作品</h3>
        <div class="control-group">
          <label for="size-slider">缩放</label>
          <input type="range" id="size-slider" min="0.1" max="2" step="0.05" v-model="artworkControls.scale" @input="drawPreview">
        </div>
        <div class="control-group">
          <label for="rotate-slider">旋转</label>
          <input type="range" id="rotate-slider" min="-180" max="180" step="1" v-model="artworkControls.rotation" @input="drawPreview">
        </div>
        <button @click="generateShareImage" class="generate-btn">生成分享图</button>
      </div>
    </div>
    
    <div v-if="shareImageUrl" class="share-modal" @click.self="shareImageUrl = null">
      <div class="share-content">
        <button class="close-modal-btn" @click="shareImageUrl = null">×</button>
        <h3>长按或右键保存您的专属作品</h3>
        <img :src="shareImageUrl" alt="分享图" class="final-artwork">
        <a :href="shareImageUrl" download="我的墨韵作品.png" class="action-btn primary">下载图片</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useArtStore } from '../store/artStore';

const products = ref([
  { name: '手机壳', template: '/images/tpl-phonecase.png', icon: '/images/icon-phone.png' },
  { name: '马克杯', template: '/images/tpl-mug.png', icon: '/images/icon-mug.png' },
  { name: '折扇', template: '/images/tpl-fan.png', icon: '/images/icon-fan.png' },
]);

const artStore = useArtStore();
const selectedProduct = ref(products.value[0]);
const previewCanvasRef = ref(null);
const previewWrapperRef = ref(null);
const shareImageUrl = ref(null);
let ctx;

const artworkControls = reactive({
  scale: 1,
  rotation: 0,
  x: 0,
  y: 0,
});

let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

const useSampleArtwork = () => {
  artStore.setArtwork('/images/sample-artwork.png');
};

onMounted(() => {
  if (artStore.artworkUrl) {
    setupCanvas();
  }
});

watch(selectedProduct, () => {
  if (artStore.artworkUrl) {
    artworkControls.x = 0;
    artworkControls.y = 0;
    drawPreview();
  }
});

watch(() => artStore.artworkUrl, (newUrl) => {
  if (newUrl) {
    if (!ctx) {
      setupCanvas();
    } else {
      drawPreview();
    }
  }
});

function setupCanvas() {
  import('vue').then(({ nextTick }) => {
    nextTick(() => {
      if (!previewCanvasRef.value) return;
      ctx = previewCanvasRef.value.getContext('2d');
      const wrapper = previewWrapperRef.value;
      const dpr = window.devicePixelRatio || 1;
      const rect = wrapper.getBoundingClientRect();
      previewCanvasRef.value.width = rect.width * dpr;
      previewCanvasRef.value.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      previewCanvasRef.value.style.width = `${rect.width}px`;
      previewCanvasRef.value.style.height = `${rect.height}px`;
      drawPreview();
    });
  });
}

// --- 核心修正点：重构 drawPreview 函数 ---
function drawPreview() {
  if (!ctx) return;
  const canvas = previewCanvasRef.value;
  const dpr = window.devicePixelRatio || 1;
  const canvasWidth = canvas.width / dpr;
  const canvasHeight = canvas.height / dpr;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const productImg = new Image();
  productImg.src = selectedProduct.value.template;
  productImg.onload = () => {
    // --- 计算保持比例的尺寸和位置 ---
    const canvasRatio = canvasWidth / canvasHeight;
    const imgRatio = productImg.naturalWidth / productImg.naturalHeight;
    
    let drawWidth, drawHeight, drawX, drawY;

    if (imgRatio > canvasRatio) {
      // 图片比画布更“宽”，以画布宽度为基准
      drawWidth = canvasWidth;
      drawHeight = drawWidth / imgRatio;
      drawX = 0;
      drawY = (canvasHeight - drawHeight) / 2; // 垂直居中
    } else {
      // 图片比画布更“高”，以画布高度为基准
      drawHeight = canvasHeight;
      drawWidth = drawHeight * imgRatio;
      drawX = (canvasWidth - drawWidth) / 2; // 水平居中
      drawY = 0;
    }

    // 绘制产品模板（保持比例）
    ctx.drawImage(productImg, drawX, drawY, drawWidth, drawHeight);
    
    if (artStore.artworkUrl) {
      const artImg = new Image();
      artImg.src = artStore.artworkUrl;
      artImg.onload = () => {
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;

        ctx.save();
        ctx.translate(centerX + artworkControls.x, centerY + artworkControls.y);
        ctx.rotate(artworkControls.rotation * Math.PI / 180);
        
        const artRatio = artImg.width / artImg.height;
        // 注意：这里的缩放基准也应该相对于保持比例后的模板图尺寸
        const artBaseWidth = drawWidth * 0.5 * artworkControls.scale;
        const artDrawWidth = artBaseWidth;
        const artDrawHeight = artBaseWidth / artRatio;

        ctx.drawImage(artImg, -artDrawWidth / 2, -artDrawHeight / 2, artDrawWidth, artDrawHeight);
        
        ctx.restore();
      };
    }
  };
}

function startDrag(event) {
  isDragging = true;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
  previewCanvasRef.value.style.cursor = 'grabbing';
}

function drag(event) {
  if (!isDragging) return;

  const dx = event.clientX - lastMouseX;
  const dy = event.clientY - lastMouseY;

  artworkControls.x += dx;
  artworkControls.y += dy;

  lastMouseX = event.clientX;
  lastMouseY = event.clientY;

  drawPreview();
}

function endDrag() {
  isDragging = false;
  previewCanvasRef.value.style.cursor = 'grab';
}

function generateShareImage() {
  shareImageUrl.value = previewCanvasRef.value.toDataURL('image/png');
}
</script>

<style lang="scss" scoped>
.preview-area .preview-canvas-wrapper canvas {
  cursor: grab;
}

.create-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 2rem 5%;
  background-color: #f9f9f7;
  box-sizing: border-box;
  overflow: hidden;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-shrink: 0;

  .title-group {
    text-align: center;
  }

  .page-title {
    font-size: 3rem;
    margin: 0;
  }
  .page-subtitle {
    font-size: 1.1rem;
    color: #666;
    margin-top: 0.5rem;
    font-family: var(--font-body);
  }

  .back-home-btn, .header-placeholder {
    flex: 1;
  }

  .back-home-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-body);
    color: #555;
    text-decoration: none;
    transition: color 0.2s ease;
    &:hover {
      color: var(--color-seal-red);
    }
  }

  .header-placeholder {}
}

.no-artwork-prompt {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  h2 {
    font-size: 2.5rem;
  }
  p {
    font-size: 1.1rem;
    color: #666;
    margin: 1rem 0 2rem 0;
  }
  .prompt-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
}

.action-btn {
  padding: 0.8rem 2rem;
  border-radius: 30px;
  font-family: var(--font-body);
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  &.primary {
    background-color: var(--color-mo-black);
    color: white;
    border: 1px solid var(--color-mo-black);
    &:hover {
      background-color: var(--color-seal-red);
      border-color: var(--color-seal-red);
    }
  }
  &.secondary {
    background-color: white;
    color: var(--color-mo-black);
    border: 1px solid #ddd;
    &:hover {
      border-color: var(--color-mo-black);
    }
  }
}

.editor-area {
  display: grid;
  grid-template-columns: 250px 1fr 250px;
  gap: 2rem;
  flex-grow: 1;
  min-height: 0;
}

.product-list, .controls-area {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  h3 {
    font-size: 1.5rem;
    margin-top: 0;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
    flex-shrink: 0;
  }
}

.product-list {
  .product-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    margin-bottom: 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    border: 1px solid transparent;
    .item-icon {
      width: 40px;
      height: 40px;
      margin-right: 1rem;
      img { width: 100%; height: 100%; object-fit: contain; }
    }
    span {
      font-family: var(--font-body);
      font-size: 1.1rem;
    }
    &.active {
      background-color: #f0f0f0;
      border-color: #ddd;
    }
    &:hover:not(.active) {
      background-color: #f9f9f9;
    }
  }
}

.preview-area {
  background-color: #e9e9e9; // 给预览区一个背景色，方便看到留白
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  .preview-canvas-wrapper {
    width: 100%;
    height: 100%;
  }
}

.controls-area {
  .control-group {
    margin-bottom: 2rem;
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-family: var(--font-body);
    }
    input[type="range"] {
      width: 100%;
    }
  }
  .generate-btn {
    width: 100%;
    padding: 1rem;
    background-color: var(--color-seal-red);
    color: white;
    border-radius: 6px;
    font-size: 1.1rem;
    font-family: var(--font-body);
    transition: opacity 0.2s ease;
    margin-top: auto;
    &:hover {
      opacity: 0.9;
    }
  }
}

.share-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  .share-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    position: relative;
    h3 {
      margin-top: 0;
      font-size: 1.5rem;
    }
    .final-artwork {
      max-width: 70vw;
      max-height: 60vh;
      margin: 1.5rem 0;
      border: 1px solid #eee;
    }
    .close-modal-btn {
      position: absolute;
      top: 10px; right: 10px;
      font-size: 1.5rem;
      color: #aaa;
      &:hover { color: var(--color-mo-black); }
    }
  }
}
</style>