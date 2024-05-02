<template>
  <div class="home">
    <div v-if="isAvatarLoaded" class="features">
      <div class="left-blocks">
        <div class="settings">
          <img alt="Dress Checker" src="../../assets/images/settings.svg" />
        </div>
        <div class="weather">
          <div class="weather__icons">
            {{ emojis }}
          </div>
          <div class="weather__info">
            {{ `${locationName} ${temperature}` }}
          </div>
          <p v-show="false">{{ weatherText }}</p>
        </div>
        <div class="dress-checker" @click="goToPage('dress-checker')">
          <img alt="Dress Checker" src="../../assets/images/photo-camera.svg" />
          <p>Dress Checker</p>
        </div>
        <div class="other-apps">
          <div class="learning-app">
            <img alt="learning app" src="../../assets/images/learning-icon.svg" />
            <p>Learning</p>
          </div>
          <div class="look-app">
            <img alt="look app" src="../../assets/images/look-icon.svg" />
            <p>Look</p>
          </div>
        </div>
      </div>
      <div class="main-block">
        <div class="avatar">
          <img v-if="imageSrc" :src="imageSrc" alt="text" />
        </div>
        <div class="action-icons">
          <div @click="play(weatherText)">
            <img alt="Say description" src="../../assets/images/microphone-btn.png" />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="start-page">
      <img alt="Bomboloo" src="../../assets/images/start-logo.svg" />
      <div class="app-description" @click="showHome">child AI assistant</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useGeolocationStore } from '../../stores/geolocation';
import { useWeatherRecomendationsStore } from '../../stores/weatherRecomendations';
import { useRouter } from 'vue-router';

const router = useRouter()

const isAvatarLoaded = ref(false);
const geolocationStore = useGeolocationStore();
const lat = computed(() => geolocationStore.lat);
const locationName = computed(() => geolocationStore.locationName);
const weatherStore = useWeatherRecomendationsStore();
const weatherText = computed(() => weatherStore.weather.description);
const temperature = computed(() => weatherStore.weather.temperature);
const emojis = computed(() => weatherStore.weather.emojis);
const imageSrc = computed(() => weatherStore.image);

const showHome = () => {
  isAvatarLoaded.value = false;
};

const synth = ref(null);
const playing = ref(false);

const play = (text) => {
  if ('speechSynthesis' in window) {
    let to_speak = new SpeechSynthesisUtterance(text);
    to_speak.onend = () => {
      playing.value = false;
    }
    if (!playing.value) {
      const voices = synth.value.getVoices();
      to_speak.voice = voices[84];
      setTimeout(() => {
        synth.value.speak(to_speak);
        playing.value = true;
      }, 1000);
    } else {
      synth.value.cancel();
      playing.value = false;
    }
  }
}

const goToPage = (page) => {
  router.push(`/${page}`)
}

onMounted(async () => {
  await geolocationStore.getUserLocation();
  synth.value = window.speechSynthesis;
})

watch(lat, async () => {
  await weatherStore.requestWeather();

  if (imageSrc.value.length > 0) {
    isAvatarLoaded.value = true;
  }
});

watch(imageSrc, (newVal) => {
  if (newVal.length > 0) {
    isAvatarLoaded.value = true;
  }
})
</script>

<style scoped>
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;

  .start-page {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;

    .app-description {
      color: #ACAFBF;
      font-size: 22px;
    }
  }

  .features {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;

    .left-blocks {
      width: 45%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .settings {
      position: absolute;
      background: #EBEDF5;
      border-radius: 100%;
      padding: 30px 10px 10px 30px;
      left: -25px;
      top: -25px;
      cursor: pointer;
    }

    .main-block {
      position: relative;
      height: 100%;
      width: 100%;
    }

    .weather {
      height: 40%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .weather__info {
      color: #5214CC;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .weather__icons {
      font-size: 5rem;
    }

    .dress-checker {
      height: 30%;
      background: #5214CC;
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .other-apps {
      height: 30%;
      display: flex;
      flex-direction: row;
    }

    .learning-app {
      width: 50%;
      background: #99DDFF;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .look-app {
      width: 50%;
      background: #FFC000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .avatar {
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .action-icons {
      position: absolute;
      bottom: 20px;
      width: 100%;
      display: flex;
      justify-content: center;
      cursor: pointer;
    }
  }
}
</style>
