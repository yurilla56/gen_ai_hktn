<template>
  <div class="dress-checker">
    <div class="features">
      <div class="back-btn" @click="router.back()">
        <img alt="Dress Checker" src="../../assets/images/arrow-back.svg" />
      </div>
      <div class="left-blocks">
        <div v-show="showBadge" class="badge"><img alt="Brilliant" src="../../assets/images/brilliant.png" /></div>
        <div class="avatar">
          <img v-if="imageSrc" :src="imageSrc" :alt="locationName" />
        </div>
        <div class="action-icons">

          <!-- When there are selected outfit elements, iterate over them -->
          <template v-if="selectedOutfitElementsPaths.length && currentEvent">
            <div v-for="(elementPath, idx) in selectedOutfitElementsPaths" :key="idx" class="outfit-items">
              <img
                :src="require(`@/assets/images/events/${currentEvent.toLowerCase()}/elements/${selectedOutfit?.split('.')[0]}/${elementPath}`)"
                :alt="currentEvent || 'Event Look Item'"
              />
              <!-- Display checked/unchecked status -->
              <span v-if="elementPath.status" class="clothes-status"><img :alt="elementPath.name?.toLowerCase()" src="../../assets/images/checked.svg" /></span>
              <span v-else class="clothes-status"><img :alt="elementPath.name?.toLowerCase()" src="../../assets/images/unchecked.svg" /></span>
            </div>
          </template>

          <!-- When there are no selected outfit elements, display clothing items -->
          <template v-else>
            <div v-for="(item, index) in clothingItems" :key="index" class="icons-wrapper">

              <!-- Display clothing icons or fallback text -->
              <span v-if="clothesIcons[item.name.toLowerCase()]" class="clothes-icon">{{ clothesIcons[item.name.toLowerCase()] }}</span>
              <span v-else class="normal-text">{{ item.name.toLowerCase() }}</span>

              <!-- Display checked/unchecked status -->
              <span v-if="item.status" class="clothes-status"><img :alt="item.name.toLowerCase()" src="../../assets/images/checked.svg" /></span>
              <span v-else class="clothes-status"><img :alt="item.name.toLowerCase()" src="../../assets/images/unchecked.svg" /></span>
            </div>
          </template>
        </div>

      </div>
      <div class="camera-block">
        <div class="camera">
          <BaseCamera @send-image-data="getImageData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, inject, watch } from 'vue';
import { useGeolocationStore } from '@/stores/geolocation';
import { useWeatherRecomendationsStore } from '@/stores/weatherRecomendations';
import { useRouter } from 'vue-router';
// import { useSpeechSynthesis } from '@vueuse/core';
import BaseCamera from '@/components/BaseCamera.vue';

const router = useRouter();
const geolocationStore = useGeolocationStore();
const weatherStore = useWeatherRecomendationsStore();
const locationName = computed(() => geolocationStore.locationName);
const clothes = computed(() => {
  if (selectedOutfitElementsPaths.value.length) {
    return selectedOutfitElementsPaths.value;
  }
  return weatherStore.clothes;
});
const clothingItems = ref([]);
const showBadge = ref(false);
const clothesIcons = {
  shorts: '🩳',
  't-shirt': '👕',
  jacket: '🧥',
  scarf: '🧣',
  umbrella: '☔',
  sunhat: '🧢',
  sunglasses: '🕶',
  trousers: '👖',
  cardigan: '👚',
  'long sleeve top': '🥼',
  jeans: '👖',
  skirt: '👗',
  dress: '💃🏻',
};

const eventDetails = inject('currentEvent');
const currentHero = inject('currentHero');

const currentEvent = ref(null);
const selectedOutfitElementsPaths = ref([]);
const selectedOutfitPath = ref(null);
const selectedOutfit = ref(null);

// const avatarHeight = computed(() => {
//   if (selectedOutfitElementsPaths?.value) {
//     if (selectedOutfitElementsPaths?.value?.length > 3) {
//       return 60;
//     }
//     return 80;
//   } else {
//     if (selectedOutfitElementsPaths?.value?.length > 3) {
//       return 60;
//     }
//     return 80;
//   }
// })
//
// const itemsHeight = computed(() => {
//   if (selectedOutfitElementsPaths?.value) {
//     if (selectedOutfitElementsPaths?.value?.length > 3) {
//       return 40;
//     }
//     return 20;
//   } else {
//     if (selectedOutfitElementsPaths?.value?.length > 3) {
//       return 40;
//     }
//     return 20;
//   }
// })

const getSelectedImage = (event) => {
  selectedOutfit.value = localStorage.getItem('selectedOutfit');

  if (selectedOutfit.value && event && currentHero) {
    selectedOutfitPath.value = `${event.toLowerCase()}/outfits/${currentHero}/${selectedOutfit.value}`;
    selectedOutfitElementsPaths.value = getEventOutfitClothingItems(event, selectedOutfit.value);
  } else {
    selectedOutfitPath.value = null;
  }

};

const resetSelectedImage = () => {
  localStorage.removeItem('selectedOutfit');
};

const imageSrc = computed(() => {
  if (selectedOutfitPath.value) {
    return require(`@/assets/images/events/${selectedOutfitPath.value}`);
  } else {
    return weatherStore.image;
  }
});

const updateStatuses = (clothingItems, updateObject) => {
  for (const item of clothingItems.value) {
    if (item.name in updateObject) {
      item.status = updateObject[item.name];
    }
  }
  showBadge.value = true;
  setTimeout(() => {
    showBadge.value = false;
  }, 3000);
};

const getImageData = (async (data) => {
  let requestData = {
    clothes: weatherStore.clothes,
    image: data,
  };
  let responce = null;
  try {
    responce = await weatherStore.verifyWeatherRecommendation(requestData);
    updateStatuses(clothingItems, responce.clothes);
  } catch (error) {
    console.error('Error fetching weather recommendation:', error);
    updateStatuses(clothingItems, ['shorts', 't-shirt', 'sunhat']);
  }
});

const getEventOutfitClothingItems = (event, selectedOutfitPath) => {
  const context = require.context('@/assets/images/events/', true, /\.(png|jpg|jpeg|svg)$/);
  const selectedOutfit = selectedOutfitPath.split('.')[0];
  const images = context.keys().filter(path => path.includes(`${event.toLowerCase()}/elements/${selectedOutfit}`));
  return images.map(path => path.split('/').pop());
};

onMounted(() => {
  currentEvent.value = eventDetails;

  for (const item of clothes.value) {
    clothingItems.value.push({ name: item, status: false });
  }
});

watch(currentEvent, (newEvent) => {
  if (newEvent) {
    getSelectedImage(newEvent);
    if (selectedOutfitPath.value) {
      resetSelectedImage();
    }
  } else {
    selectedOutfitPath.value = null;
  }
});


</script>

<style scoped>
.dress-checker {
  height: 100%;
  //display: flex;
  //flex-direction: column;
  //align-items: center;
  //justify-content: space-evenly;

  .back-btn {
    position: absolute;
    background: #EBEDF5;
    border-radius: 100%;
    padding: 30px 10px 10px 30px;
    left: -25px;
    top: -25px;
    cursor: pointer;
    z-index: 1;
  }

  .features {
    //height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;

    .left-blocks {
      position: relative;
      width: 50%;
      height: 100%;
      //display: flex;
      //flex-direction: column;

      .badge {
        position: absolute;
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: space-evenly;
        background: #2d0b6f7a;
        z-index: 1;
      }

      .avatar {
        width: 100%;
        height: 80vh;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .action-icons {
        display: grid;
        grid-template-columns: repeat(3, 1fr);

        .clothes-icon {
          font-size: 6rem;
        }

        div {
          position: relative;
          display: flex;
          height: 100%;
          justify-content: space-around;
          align-items: center;
          flex-grow: 1;

          .clothes-status {
            position: absolute;
            right: 20px;
            bottom: 3px;
          }
        }
      }
    }

    .camera-block {
      width: 50%;
      height: auto;
    }

    .camera {
      width: 100%;
      height: 100%;
    }
  }
}

.outfit-items {
  img {
    height: calc(100vw / 7);
    width: 100%;
    object-fit: cover;
    object-position: top;
    box-sizing: border-box;
    padding: 5px;
  }

  .clothes-status img {
    height: 32%;
  }
}
</style>
