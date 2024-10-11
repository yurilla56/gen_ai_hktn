<template>
  <div class="wrapper">
    <div class="video-container">
      <video
        v-if="isCameraOpen"
        ref="camera"
        class="camera-video"
        :width="450"
        :height="337"
        autoplay
        playsinline>

      </video>
      <canvas
        v-show="isPhotoTaken"
        id="photoTaken"
        ref="canvas"
        class="canvas-photo"
        :width="450"
        :height="337">
      </canvas>
    </div>
    <div v-if="!isCameraOpen" class="show-camera">
      <div class="no-camera-btn">
        <img src="../assets/images/no-photography.svg" title="Turn On Camera">
      </div>
      <div class="turn-on-camera-btn" @click="toggleCamera()">
        <span>Turn On Camera</span>
      </div>
    </div>
    <span v-else>Turn Off Camera</span>
    <div class="interactive-buttons">
      <div class="microphone" @click="speak">
        <img alt="Say description" src="../assets/images/microphone-btn.png" />
      </div>
      <div v-if="isCameraOpen" class="take-photo" @click="takePhoto">
        <img src="../assets/images/camera-btn.png" alt="Snap!" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const isCameraOpen = ref(false);
const isPhotoTaken = ref(false);

const camera = ref(null);
const canvas = ref(null);
const imageData = ref([]);

const emit = defineEmits(['sendImageData']);

const createCameraElement = () => {
  const constraints = (window.constraints = {
    audio: false,
    video: true,
  });

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(stream => {
      camera.value.srcObject = stream;
    })
    .catch(error => {
      alert(error, 'May the browser didn\'t support or there is some errors.');
    });
};

const stopCameraStream = () => {
  const tracks = camera.value.srcObject.getTracks();

  tracks.forEach(track => {
    track.stop();
  });
};

const toggleCamera = () => {
  if (isCameraOpen.value) {
    isCameraOpen.value = false;
    isPhotoTaken.value = false;
    stopCameraStream();
  } else {
    isCameraOpen.value = true;
    createCameraElement();
  }
};

const takePhoto = () => {
  if (isCameraOpen.value) {
    isPhotoTaken.value = !isPhotoTaken.value;
    const context = canvas.value.getContext('2d');
    const photoFromVideo = camera.value;
    context.drawImage(photoFromVideo, 0, 0, 450, 337);
    imageData.value = canvas.value.toDataURL().split(',');
    emit('sendImageData', imageData.value[1]);
  } else {
    alert('First open your camera');
  }
};
//@Todo: replace with actual speech
const speak = () => console.log('Speak');
</script>

<style scoped>
.wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  background-color: #EBEDF5;
}

.interactive-buttons {
  position: fixed;
  display: flex;
  gap: 32px;
  bottom: 35px;
}

.take-photo,
.microphone {
  cursor: pointer;
  width: 120px;
  height: 120px;
}

.show-camera {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  transform: translateY(-50%);
  top: 50%;
  gap: 20px;
  height: 50%;
  min-height: 230px;
}

.turn-on-camera-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: #3f0f9e;
  max-width: 382px;
  height: 72px;
  width: 40%;
  border-radius: 40px;

  span {
    color: #ffffff;
    font-size: 24px;
    font-weight: bold;
  }
}

.video-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  canvas, video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  canvas {
    opacity: 0;
    position: absolute;
    height: auto;
  }
}
</style>
