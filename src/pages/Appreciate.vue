<template>
  <div class="appreciate-container" @scroll="handleScroll">
    <!-- 顶部导航，用于在不同展品间切换 -->
    <nav class="item-nav">
      <router-link 
        to="/appreciate/hubi" 
        class="nav-link" 
        :class="{active: id === 'hubi'}">
        湖笔
      </router-link>
      <router-link 
        to="/appreciate/huimo" 
        class="nav-link" 
        :class="{active: id === 'huimo'}">
        徽墨
      </router-link>
      <router-link 
        to="/appreciate/xuanzhi" 
        class="nav-link" 
        :class="{active: id === 'xuanzhi'}">
        宣纸
      </router-link>
      <router-link to="/" class="nav-link back-home">返回首页</router-link>
    </nav>

    <!-- 使用 v-if 根据 id 动态渲染对应的展区 -->
    <!-- 每个展区现在是独立的，不再是长卷轴的一部分 -->
    <transition name="fade" mode="out-in">
      <div :key="id">
        <!-- 湖笔展区 -->
        <section v-if="id === 'hubi'" class="item-section">
          <div class="info-block left-block" :style="getParallaxStyle(0.15)">
            <h2 class="item-title">湖笔 · 锋颖如锥</h2>
            <div class="info-content">
              <h3>【 善琏颖锋，笔之冠冕 】</h3>
              <p>湖笔，产于浙江湖州善琏镇，始于秦，兴于晋，盛于元。其“尖、齐、圆、健”四德兼备，被誉为“笔中之冠”，为历代书画大家所推崇。</p>
            </div>
          </div>
          <div class="showcase-block right-showcase" :style="getParallaxStyle(-0.1)">
            <div class="item-3d-viewer">
              <ThreeDViewer model-path="/models/hubi.glb" />
            </div>
          </div>
        </section>

        <!-- 徽墨展区 -->
        <section v-if="id === 'huimo'" class="item-section">
          <div class="showcase-block left-showcase" :style="getParallaxStyle(0.1)">
            <div class="item-3d-viewer">
              <ThreeDViewer model-path="/models/huimo.glb" />
            </div>
          </div>
          <div class="info-block right-block" :style="getParallaxStyle(-0.15)">
            <h2 class="item-title">徽墨 · 一点如漆</h2>
            <div class="info-content">
              <h3>【 千锤百炼，点墨成金 】</h3>
              <p>制墨需经炼烟、和胶、杵捣、成型、晾墨、描金等复杂工序。其中“捣杵”环节尤为关键，需上万次捶打，方能使烟料与胶体均匀融合，墨质坚实细腻，所谓“点墨成金”。</p>
            </div>
          </div>
        </section>

        <!-- 宣纸展区 -->
        <section v-if="id === 'xuanzhi'" class="item-section paper-section">
          <div class="info-block left-block" :style="getParallaxStyle(0.15)">
            <h2 class="item-title">宣纸 · 润墨有韵</h2>
            <div class="info-content">
              <h3>【 生熟有别，韵味各异 】</h3>
              <p>生宣吸水性强，墨迹晕染丰富，能产生千变万化的墨韵，宜于写意山水。熟宣经矾水加工，纸性变熟，不洇墨，宜于工笔细描。点击右侧体验二者差异。</p>
            </div>
          </div>
          <div class="showcase-block right-showcase paper-showcase" :style="getParallaxStyle(-0.1)">
            <div class="paper-interaction-area">
              <div class="ink-drop-zone" @click="dropInk('sheng')">
                <span class="zone-label">生宣</span>
                <div class="ink-dot sheng" :style="inkStyle.sheng"></div>
              </div>
              <div class="ink-drop-zone" @click="dropInk('shu')">
                <span class="zone-label">熟宣</span>
                <div class="ink-dot shu" :style="inkStyle.shu"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ThreeDViewer from '../components/common/ThreeDViewer.vue';

// 关键：接收从路由传递过来的 id prop
const props = defineProps({
  id: {
    type: String,
    required: true,
    validator: (value) => ['hubi', 'huimo', 'xuanzhi'].includes(value)
  }
});

// --- 视差滚动逻辑 ---
const scrollY = ref(0);
const handleScroll = (event) => {
  scrollY.value = event.target.scrollTop;
};
const getParallaxStyle = (depth) => {
  return {
    transform: `translateY(${scrollY.value * depth}px)`
  };
};

// --- 宣纸交互逻辑 ---
const inkStyle = reactive({
  sheng: { transform: 'scale(0)', opacity: 0, transition: 'none' },
  shu: { transform: 'scale(0)', opacity: 0, transition: 'none' }
});
const dropInk = (type) => {
  const targetStyle = inkStyle[type];
  targetStyle.transform = 'scale(0)';
  targetStyle.opacity = 0;
  targetStyle.transition = 'none';
  setTimeout(() => {
    targetStyle.transition = 'transform 1.5s cubic-bezier(0.23, 1, 0.32, 1), opacity 1s ease-out';
    targetStyle.transform = type === 'sheng' ? 'scale(6)' : 'scale(2.5)';
    targetStyle.opacity = type === 'sheng' ? 0.8 : 1;
  }, 50);
};
</script>

<style lang="scss" scoped>
.appreciate-container {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  background-image: url('/images/xuan-paper-texture.jpg');
  background-size: cover;
  background-attachment: fixed;
  color: var(--color-mo-black);
  perspective: 1px;
}

.item-nav {
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1.5rem;
  border-radius: 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  display: flex;
  gap: 1.5rem;

  .nav-link {
    font-family: var(--font-title);
    font-size: 1.1rem;
    color: #666;
    text-decoration: none;
    transition: color 0.3s ease;
    padding: 0.5rem 0;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--color-seal-red);
      transition: width 0.3s ease;
    }

    &:hover, &.active {
      color: var(--color-mo-black);
    }
    &.active::after {
      width: 100%;
    }
  }
  .back-home {
    border-left: 1px solid #ddd;
    padding-left: 1.5rem;
    color: var(--color-seal-red);
    &:hover {
      opacity: 0.8;
    }
  }
}

.item-section {
  min-height: 100vh;
  width: 88%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

/* 其他样式 (info-block, showcase-block 等) 保持不变 */
.info-block {
  width: 45%;
  padding: 2rem;
  position: relative;

  .item-title {
    font-size: 3.5rem;
    margin-bottom: 2rem;
    position: relative;
    display: inline-block;
    padding-bottom: 1rem;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60%;
      height: 3px;
      background: var(--color-seal-red);
    }
  }

  .info-content {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='f' x='-20%25' y='-20%25' width='140%25' height='140%25'%3E%3CfeGaussianBlur stdDeviation='10'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='100' height='100' fill='%23fdfdfd'/%3E%3Cg filter='url(%23f)'%3E%3Crect x='20' y='20' width='60' height='60' fill='%23f5f5f5'/%3E%3C/g%3E%3C/svg%3E");
    background-size: cover;
    padding: 2.5rem;
    border-radius: 15px;
    box-shadow: 0 15px 40px rgba(0,0,0,0.1);

    h3 {
      font-size: 1.5rem;
      color: var(--color-seal-red);
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.1rem;
      line-height: 2.2;
      color: #333;
    }
  }
}

.showcase-block {
  width: 50%;
  height: 70vh;
}

.item-3d-viewer {
  width: 100%;
  height: 100%;
  background: transparent;
}

.paper-showcase {
  border-radius: 8px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
  overflow: hidden;
  background-color: rgba(255,255,255,0.5);
  backdrop-filter: blur(5px);
}
.paper-interaction-area {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
}
.ink-drop-zone {
  flex: 1;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background-color: rgba(0,0,0,0.05); }
  &:first-child { border-right: 1px dashed rgba(0,0,0,0.2); }
}
.zone-label {
  font-family: var(--font-title);
  font-size: 2rem;
  color: rgba(0,0,0,0.2);
  user-select: none;
}
.ink-dot {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: var(--color-mo-black);
  border-radius: 50%;
  pointer-events: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>