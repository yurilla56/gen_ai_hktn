<template>
  <div class="dress-checker">
    <div class="features">
    <div class="back-btn" @click="goToPage('')">
        <img alt="Dress Checker" src="../../assets/images/arrow-back.svg" />
    </div>
    <div class="left-blocks">
      <div v-show="showBadge" class="badge"><img alt="Brilliant" src="../../assets/images/brilliant.png" /></div> 
        <div class="avatar">
          <img v-if="imageSrc" :src="imageSrc" :alt="locationName" />
        </div>
        <div class="action-icons">
            <div v-if="clothingItems.length > 0">
                <div v-for="(item, index) in clothingItems" :key="index">
                  <span v-if="clothesIcons[item.name.toLowerCase()]" class="clothes-icon">{{ clothesIcons[item.name.toLowerCase()] }}</span>
                  <span v-else class="normal-text">{{ item.name.toLowerCase() }}</span>
                <span v-if="item.status" class="clothes-status"><img :alt="item.name.toLowerCase()" src="../../assets/images/checked.svg" /></span>
                <span v-else class="clothes-status"><img :alt="item.name.toLowerCase()" src="../../assets/images/unchecked.svg" /></span>
                </div>
            </div>
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
  import { onMounted, computed, ref } from 'vue'
  import { useGeolocationStore } from '../../stores/geolocation';
  import { useWeatherRecomendationsStore } from '../../stores/weatherRecomendations';
  import { useRouter } from 'vue-router'
  // import { useSpeechSynthesis } from '@vueuse/core';
  import BaseCamera from '@/components/BaseCamera.vue';
  
  const router = useRouter()
  const geolocationStore = useGeolocationStore();
  const weatherStore = useWeatherRecomendationsStore();
  const locationName = computed(() => geolocationStore.locationName);
  const imageSrc = computed(() => weatherStore.image);
  const clothes = computed(() => weatherStore.clothes);
  const clothingItems = ref([]);
  const showBadge = ref(false);
  const clothesIcons = {
    shorts: '🩳',
    "t-shirt": '👕',
    jacket: '🧥',
    scarf: '🧣',
    umbrella: '☔',
    sunhat: '🧢',
    sunglasses: '🕶',
    trousers: '👖',
    cardigan: '👚',
    "long sleeve top": '🥼',
    jeans: '👖',
    skirt: '👗',
    dress: '💃🏻',
  }
  
  const goToPage = (page) => {
    router.push(`/${page}`)
  }

  const updateStatuses = (clothingItems, updateObject) => {
    for (const item of clothingItems.value) {
        if (item.name in updateObject) { // Use 'in' operator
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
        image: data
    };
    const responce = await weatherStore.verifyWeatherRecommendation(requestData);
    updateStatuses(clothingItems, responce.clothes);
  });
  
  onMounted(async () => {  
    for (const item of clothes.value) {
        clothingItems.value.push({ name: item, status: false });
    }
  })
</script>
  
<style scoped>
.dress-checker {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;

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
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: row;
  
      .left-blocks {
        position: relative;
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: column;

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
            height: 80%;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        .action-icons {
            height: 20%;

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
                  right: 3px;
                  bottom: 3px;
                }
            }
        }
      }
  
      .camera-block {
        width: 50%;
        height: 100%;
      }

      .camera {
        width: 100%;
        height: 100%;
      }
    }
}
</style>
  