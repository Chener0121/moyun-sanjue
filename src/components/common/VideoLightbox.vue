// 文件路径: src/components/common/VideoLightbox.vue

<template>
  <transition name="lightbox-fade">
    <div v-if="visible" class="lightbox-overlay" @click.self="close">
      <div class="lightbox-container">
        <button class="close-button" @click="close">×</button>
        <video 
          v-if="videoUrl"
          :src="videoUrl" 
          controls 
          autoplay 
          class="lightbox-video"
        ></video>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  videoUrl: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<style lang="scss" scoped>
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.lightbox-container {
  position: relative;
  width: 80vw;
  max-width: 1200px;
  aspect-ratio: 16 / 9; // 保持16:9的视频比例
}

.lightbox-video {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.close-button {
  position: absolute;
  top: -50px; // 放在视频上方
  right: 0;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  font-size: 3rem;
  color: white;
  cursor: pointer;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.3s ease, transform 0.3s ease;

  &:hover {
    opacity: 1;
    transform: rotate(90deg);
  }
}

// 过渡动画
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.4s ease;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}
</style>