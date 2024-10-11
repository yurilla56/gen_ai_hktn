<template>
  <div class="event-page" :style="{ backgroundColor: '#f4941f' }">
    <div class="arrow-back" @click="router.back()">
      <img src="../../assets/images/arrow-back.svg" alt="Back">
    </div>
    <div class="wrapper">
      <div class="icon">
        <img v-if="currentEvent" :src="require(`@/assets/images/events/${currentEvent.toLowerCase()}/icon.svg`)">
      </div>
      <div v-if="imagePaths.length" class="image-container">
        <div
          v-for="(path, index) in imagePaths"
          :key="index"
          @click="saveImageName(path)">
          <img
            :src="require(`@/assets/images/events/${currentEvent.toLowerCase()}/outfits/${currentHero}/${path}`)"
            :alt="currentEvent || 'Event Look'"
            :class="'responsive-image' + (path === 'ghost.svg' ? ' brighten-img' : '')"
          />
        </div>
        <!-- Surprise-me option is common for all events -->
        <div @click="saveImageName('surprise-me')">
          <img
            src="../../assets/images/events/common/surprise-me.svg"
            alt="Surprise Me"
            class="responsive-image">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const eventDetails = inject('currentEvent');
const currentHero = inject('currentHero');

const currentEvent = ref(null);
const imagePaths = ref([]);

const loadEventImages = (eventName) => {
  const context = require.context('@/assets/images/events/', true, /\.(png|jpg|jpeg|svg)$/);
  const images = context.keys().filter(path =>
    path.includes(`${eventName.toLowerCase()}/outfits`) && !path.includes('surprise-me.svg')
  );
  imagePaths.value = images.map(path => path.split('/').pop());
};

watch(currentEvent, (newEvent) => {
  if (newEvent) {
    loadEventImages(newEvent);
  } else {
    imagePaths.value = [];
  }
});

onMounted(() => {
  currentEvent.value = eventDetails;
});

// @Todo: replace with a call to AI API for a random outfit
// const getSurpriseMeImage = () => {
//   const randomIndex = Math.floor(Math.random() * imagePaths.value.length);
//   return imagePaths.value[randomIndex];
// }

const saveImageName = (outfit) => {
  if (outfit === 'surprise-me') {
    outfit = 'surprise-me.svg';
  }
  localStorage.setItem('selectedOutfit', outfit);
  router.push('/dress-checker');
};

</script>

<style scoped>
.event-page {
  margin: 0;
  padding: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container {
  margin-top: 30px;
  display: flex;
  gap: 40px;
}

.responsive-image {
  min-width: 173px;
  min-height: 173px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
  border: 7px solid transparent;
  border-radius: 16px;

  img {
    width: 100%;
    height: auto;
    transition: filter 0.3s ease;
  }

  &:hover {
    cursor: pointer;
    filter: brightness(80%);
    border-color: #6e41e2;
  }
}

.brighten-img {
  filter: brightness(120%);
}

.arrow-back {
  position: absolute;
  background: #EBEDF5;
  border-radius: 100%;
  padding: 30px 10px 10px 30px;
  left: -25px;
  top: -25px;
  cursor: pointer;
  z-index: 1;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.icon img {
  transition: transform 0.2s;
}

.icon img:hover {
  animation: bounce 0.6s ease-in-out infinite;
}
</style>

