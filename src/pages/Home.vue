<template>
  <div class="home-container" ref="containerRef">
    <!-- 导航栏部分保持不变 -->
    <nav class="top-navigation" :class="{ 'is-scrolled': isScrolled }">
      <div class="nav-logo" @click="scrollToScreen(0)">墨韵三绝</div>
      <div class="nav-menu">
        <a @click="scrollToScreen(1)" class="nav-link">引言</a>
        <a @click="scrollToScreen(2)" class="nav-link">概览</a>
        <a @click="scrollToScreen(3)" class="nav-link">启程</a>
        <router-link to="/appreciate/hubi" class="action-button">进入展馆</router-link>
      </div>
    </nav>

    <div class="scroll-wrapper" ref="wrapperRef">
      <!-- 第1屏：英雄视频 (无改动) -->
      <section class="screen hero-section" data-title="首页">
        <video ref="videoPlayer" autoplay muted loop playsinline class="hero-video-bg">
          <source src="/videos/ink-drop.mp4" type="video/mp4">
        </video>
        <div class="video-overlay"></div>
        <div class="hero-content">
          <h1 class="main-title">墨韵三绝</h1>
          <p class="subtitle">数字文房的诗意栖居</p>
        </div>
        <div class="scroll-down-indicator">
          <span>滚动探索</span>
        </div>
      </section>

      <!-- 第2屏：引言 (无改动) -->
      <section class="screen intro-section" data-title="引言">
        <div class="intro-grid">
          <div class="intro-image-wrapper animate-on-scroll">
            <img src="/images/shanshui-bg.jpg" alt="水墨意境">
          </div>
          <div class="intro-text-container animate-on-scroll">
            <h2 class="section-title">引言</h2>
            <div class="intro-text-wrapper">
              <p>自古人文荟萃，其文房雅物，尤以湖笔、徽墨、宣纸为最，世称“文房三宝”。笔之刚柔，墨之五色，纸之肌理，共同承载了华夏千年书画之魂。</p>
              <p>今天，我们以数字技术为舟，邀您渡入这片墨色晕染的感官世界。在这里，古老的“三绝”不再是静默的陈列，而是可以被感知、被探索的生命体。开启您的翰墨探索之旅。</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 第3屏：三绝概览 (无改动) -->
      <section class="screen overview-section" data-title="概览">
        <div class="overview-card-container">
          <div class="overview-card animate-on-scroll" @click="openLightbox('hubi')">
            <div class="card-bg" style="background-image: url('/images/overview-hubi.jpg')"></div>
            <div class="card-overlay"></div>
            <div class="card-content">
              <h3>湖笔</h3>
              <p class="keyword">锋颖如锥</p>
            </div>
          </div>
          <div class="overview-card animate-on-scroll" @click="openLightbox('huimo')">
            <div class="card-bg" style="background-image: url('/images/overview-huimo.jpg')"></div>
            <div class="card-overlay"></div>
            <div class="card-content">
              <h3>徽墨</h3>
              <p class="keyword">一点如漆</p>
            </div>
          </div>
          <div class="overview-card animate-on-scroll" @click="openLightbox('xuanzhi')">
            <div class="card-bg" style="background-image: url('/images/overview-xuanzhi.jpg')"></div>
            <div class="card-overlay"></div>
            <div class="card-content">
              <h3>宣纸</h3>
              <p class="keyword">润墨有韵</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 第4屏：核心体验入口 (已美化) -->
      <section class="screen entry-section" data-title="启程">
        <div class="entry-content">
          <h2 class="section-title animate-on-scroll">开启你的诗意栖居</h2>
          <div class="entry-grid">
            <router-link to="/appreciate/hubi" class="entry-point animate-on-scroll">
              <div class="entry-icon-wrapper"><img src="/images/icon-seal.png" alt="鉴物印章"></div>
              <div class="entry-text"><h3>鉴·物</h3><p>数字书房</p></div>
            </router-link>
            <router-link to="/inherit" class="entry-point animate-on-scroll">
              <div class="entry-icon-wrapper"><img src="/images/icon-brush.png" alt="承艺毛笔"></div>
              <div class="entry-text"><h3>承·艺</h3><p>互动书写</p></div>
            </router-link>
            <router-link to="/create" class="entry-point animate-on-scroll">
              <div class="entry-icon-wrapper"><img src="/images/icon-creation.png" alt="用创壁纸"></div>
              <div class="entry-text"><h3>用·创</h3><p>文创生成</p></div>
            </router-link>
          </div>
        </div>
        <footer class="home-footer">
          <p>设计与实现：陈鹏 & 王群英 & 夏榴欣</p>
        </footer>
      </section>
    </div>

    <!-- 灯箱播放器结构 (无改动) -->
    <div v-if="isLightboxVisible" class="lightbox-overlay" @click="closeLightbox">
      <div class="lightbox-content" @click.stop>
        <video :src="lightboxVideoSrc" controls autoplay playsinline class="lightbox-video"></video>
        <button class="close-button" @click="closeLightbox">×</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// --- 脚本逻辑 (无改动) ---
const videoPlayer = ref(null);
const containerRef = ref(null);
const wrapperRef = ref(null);
const isScrolled = ref(false);
let currentScreen = 0;
const screenCount = 4;
let isScrolling = false;
let touchStartY = 0;

const scrollToScreen = (screenIndex) => {
  if (isScrolling || screenIndex < 0 || screenIndex >= screenCount) return;
  isScrolling = true;
  currentScreen = screenIndex;
  const targetScrollTop = screenIndex * window.innerHeight;
  if (wrapperRef.value) {
    wrapperRef.value.style.transform = `translateY(-${targetScrollTop}px)`;
  }
  isScrolled.value = screenIndex > 0;
  const screens = document.querySelectorAll('.screen');
  screens.forEach((screen, index) => {
    const elements = screen.querySelectorAll('.animate-on-scroll');
    if (index === currentScreen) {
      elements.forEach(el => el.classList.add('is-visible'));
    } else {
      elements.forEach(el => el.classList.remove('is-visible'));
    }
  });
  setTimeout(() => {
    isScrolling = false;
  }, 1000);
};

const handleWheel = (event) => {
  event.preventDefault();
  if (isScrolling) return;
  if (event.deltaY > 0) {
    scrollToScreen(currentScreen + 1);
  } else {
    scrollToScreen(currentScreen - 1);
  }
};

const handleTouchStart = (event) => {
  touchStartY = event.touches[0].clientY;
};

const handleTouchMove = (event) => {
  event.preventDefault();
  if (isScrolling) return;
  const touchEndY = event.touches[0].clientY;
  if (touchStartY - touchEndY > 50) {
    scrollToScreen(currentScreen + 1);
  } else if (touchEndY - touchStartY > 50) {
    scrollToScreen(currentScreen - 1);
  }
};

const isLightboxVisible = ref(false);
const lightboxVideoSrc = ref('');

const videoMap = {
  hubi: '/videos/hubi-intro.mp4',
  huimo: '/videos/huimo-intro.mp4',
  xuanzhi: '/videos/xuanzhi-intro.mp4'
};

const openLightbox = (videoKey) => {
  if (videoMap[videoKey]) {
    lightboxVideoSrc.value = videoMap[videoKey];
    isLightboxVisible.value = true;
  }
};

const closeLightbox = () => {
  isLightboxVisible.value = false;
  lightboxVideoSrc.value = '';
};

const handleKeydown = (e) => {
  if (e.key === 'Escape' && isLightboxVisible.value) {
    closeLightbox();
  }
};

onMounted(() => {
  const container = containerRef.value;
  if (container) {
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
  }
  const video = videoPlayer.value;
  if (video) {
    video.play().catch(error => console.error("视频自动播放失败:", error));
  }
  scrollToScreen(0);
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  const container = containerRef.value;
  if (container) {
    container.removeEventListener('wheel', handleWheel);
    container.removeEventListener('touchstart', handleTouchStart);
    container.removeEventListener('touchmove', handleTouchMove);
  }
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style lang="scss" scoped>
/* --- 全局及通用样式 (无改动) --- */
.home-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #F5F2ED;
}
.top-navigation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  z-index: 100;
  transition: background-color 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease;
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  &.is-scrolled::before {
    opacity: 1;
  }
  .nav-logo {
    position: absolute;
    left: 3%;
    top: 50%;
    transform: translateY(-50%);
    font-family: var(--font-body);
    font-size: 1.5rem;
    font-weight: 600;
    cursor: pointer;
    color: white;
    text-shadow: 0 0 8px rgba(0, 0, 0, 0.7);
    transition: color 0.3s ease;
  }
  .nav-menu {
    position: absolute;
    right: 3%;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 2.5rem;
  }
  &.is-scrolled {
    .nav-logo, .nav-link {
      color: var(--color-mo-black);
      text-shadow: none;
    }
    .action-button {
      background-color: var(--color-mo-black);
      color: white;
      border-color: transparent;
      &:hover {
        background-color: var(--color-seal-red);
      }
    }
  }
  .nav-link {
    font-family: var(--font-body);
    font-size: 1rem;
    cursor: pointer;
    position: relative;
    color: white;
    text-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
    transition: color 0.3s ease;
    &::after {
      content: '';
      position: absolute;
      bottom: -5px; left: 0;
      width: 0; height: 2px;
      background-color: var(--color-mo-black);
      transition: width 0.3s ease;
    }
    &:hover::after { width: 100%; }
  }
  .action-button {
    background-color: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 30px;
    font-family: var(--font-body);
    transition: all 0.3s ease;
    display: inline-block;
    &:hover {
      background-color: white;
      color: var(--color-mo-black);
      transform: scale(1.05);
    }
  }
}
.scroll-wrapper {
  width: 100%;
  height: 100%;
  transition: transform 1s cubic-bezier(0.76, 0, 0.24, 1);
}
.screen {
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.section-title {
  font-family: var(--font-title);
  font-weight: 600;
}

/* --- 动画核心逻辑 (无改动) --- */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
}
.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s;
}
.overview-section .animate-on-scroll.is-visible:nth-child(1) { transition-delay: 0.3s; }
.overview-section .animate-on-scroll.is-visible:nth-child(2) { transition-delay: 0.5s; }
.overview-section .animate-on-scroll.is-visible:nth-child(3) { transition-delay: 0.7s; }

/* --- 各屏样式 (无改动, 除了 entry-section) --- */
.hero-section {
  .hero-video-bg {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    object-fit: cover; z-index: -2;
  }
  .video-overlay {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.4); z-index: -1;
  }
  .hero-content {
    text-align: center; color: white;
    .main-title {
      font-family: var(--font-title) !important;
      font-weight: normal;
      font-size: 8rem;
      transform: translateX(100%);
      margin-bottom: 0.5rem;
    }
    .subtitle {
      font-family: var(--font-body);
      font-size: 1.5rem;
      transform: translateX(100%);
    }
  }
  .scroll-down-indicator {
    position: absolute; bottom: 40px; color: white;
    animation: bounce 2s infinite;
  }
}
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.intro-section {
  background-color: #F5F2ED;
  .intro-grid {
    display: grid;
    grid-template-columns: 3fr 2fr;
    align-items: center;
    gap: 5rem;
    width: 100%;
    max-width: 1400px;
    transform: translateY(40px);
  }
  .intro-image-wrapper, .intro-text-container {
    transition: opacity 0.4s ease-out, transform 0.4s ease-out;
  }
  .intro-image-wrapper {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
    border: 1px solid rgba(0,0,0,0.05);
    max-height: 70vh;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }
  .intro-text-container {
    display: flex;
    align-items: flex-start;
    height: 100%;
    max-height: 70vh;
  }
  .section-title {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-size: 4rem;
    letter-spacing: 0.5em;
    color: var(--color-mo-black);
    padding-right: 2rem;
    margin: 0;
    margin-left: 1rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #DCD9D4;
  }
  .intro-text-wrapper {
    padding-left: 2.5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    p {
      font-family: var(--font-body);
      font-size: 1.1rem;
      line-height: 2.3;
      margin-bottom: 1rem;
      color: #4a4a4a;
      &:last-child {
        margin-bottom: 0;
      }
      &:first-of-type::first-letter {
        font-family: var(--font-title);
        font-size: 3em;
        font-weight: 600;
        color: var(--color-mo-black);
        float: left;
        line-height: 0.85;
        margin-right: 0.1em;
        margin-top: 0.05em;
      }
    }
  }
}

.overview-section {
  flex-direction: column;
  background: #1a1a1a;
  .overview-card-container {
    display: flex;
    justify-content: center;
    gap: 2vw;
    width: 90%;
    transform: translateY(40px)
  }
  .overview-card {
    width: 30%;
    height: 75vh;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border-radius: 12px;
    transition: transform 0.3s ease-out, box-shadow 0.3s ease-out, opacity 0.4s ease-out;
    .card-bg {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-size: cover;
      background-position: center;
      filter: grayscale(50%) brightness(0.8);
      transition: transform 0.3s ease, filter 0.3s ease;
    }
    .card-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7) 20%, transparent 60%);
    }
    .card-content {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 2.5rem;
      color: white;
      text-align: center;
      transform: translateY(20px);
      transition: transform 0.5s ease;
      h3 {
        font-size: 3.5rem;
        margin: 0;
        text-shadow: 0 2px 10px rgba(0,0,0,0.5);
      }
      .keyword {
        font-family: var(--font-body);
        font-size: 1.2rem;
        opacity: 0;
        transition: opacity 0.5s ease;
      }
    }
    &:hover {
      box-shadow: 0 25px 60px rgba(0,0,0,0.4);
      z-index: 10;
      transition-duration: 0.8s;
      transition-timing-function: cubic-bezier(0.25, 1, 0.5, 1);
      .card-bg {
        transform: scale(1.1);
        filter: grayscale(0%) brightness(1);
      }
      .card-content {
        transform: translateY(0);
        .keyword {
          opacity: 1;
        }
      }
    }
  }
}

/* ★★★ START: 美化后的 "启程" 部分样式 ★★★ */
.entry-section {
  flex-direction: column;
  background-color: #F5F2ED;
  /* 增加宣纸纹理背景，请确保图片路径正确 */
  background-image: url('/images/xuan-paper-texture.jpg'); 
  background-size: cover;
  background-position: center;
  width: 100%;

  .entry-content {
    text-align: center;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transform: translateY(40px);
  }
  
  // 针对本屏的标题进行特殊化，不影响其他屏
  .section-title {
    font-size: 3rem;
    color: #333;
    &::after {
      content: '';
      display: block;
      width: 80px;
      height: 2px;
      background: var(--color-seal-red);
      margin: 1.5rem auto 0;
    }
  }

  .entry-grid {
    display: flex;
    gap: 8rem;
    // margin-top: 2rem;
  }

  .entry-point {
    color: var(--color-mo-black);
    padding: 2.5rem;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 10px 30px rgba(40, 35, 30, 0.05);
    
    /* ★★★ FINAL FIX HERE ★★★ */
    /* Replaced 'all' with specific properties to avoid conflicts */
    transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
                background 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
                box-shadow 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
                opacity 0.4s ease-out;
    
    &:hover {
      transform: translateY(-15px) scale(1.03);
      background: white;
      box-shadow: 0 20px 45px rgba(40, 35, 30, 0.15);
    }
    
    .entry-icon-wrapper {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background-color: white;
      border: 1px solid #EAEAEA;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto 1.5rem auto;
      box-shadow: 0 8px 25px rgba(0,0,0,0.07);
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
      
      img {
        width: 50%;
        height: 50%;
        transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
      }
    }
    
    &:hover .entry-icon-wrapper {
      transform: scale(1.05);
      box-shadow: 0 12px 30px rgba(0,0,0,0.1);
      img {
        transform: scale(1.15) rotate(-8deg);
      }
    }

    .entry-text {
      h3 {
        font-size: 2rem;
        transition: color 0.3s ease;
      }
      p {
        font-family: var(--font-body);
        color: #666;
        transition: color 0.3s ease;
      }
    }

    &:hover .entry-text {
      h3 { color: var(--color-seal-red); }
      p { color: var(--color-mo-black); }
    }
  }

  .home-footer {
    width: 100%;
    padding: 1rem;
    font-size: 0.9rem;
    text-align: center;
    color: #888;
    background: transparent; // 确保页脚背景透明
  }
}
/* ★★★ END: 美化后的 "启程" 部分样式 ★★★ */


/* --- 灯箱样式 (无改动) --- */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}
.lightbox-content {
  position: relative;
  width: 80vw;
  max-width: 1200px;
  aspect-ratio: 16 / 9;
  transform: scale(0.9);
  opacity: 0;
  animation: zoomIn 0.3s ease 0.1s forwards;
}
.lightbox-video {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
.close-button {
  position: absolute;
  top: -50px;
  right: -10px;
  background: none;
  border: none;
  color: white;
  font-size: 3rem;
  font-weight: 200;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 0.5rem;
  line-height: 1;
  &:hover {
    transform: scale(1.2);
  }
}
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
@keyframes zoomIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>