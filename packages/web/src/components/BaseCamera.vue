<template>
    <div class="wrapper">
        <div class="video-container">
            <video v-if="isCameraOpen" ref="camera" class="camera-video" :width="450" :height="337" autoplay playsinline ></video>
            <canvas v-show="isPhotoTaken" id="photoTaken" ref="canvas" class="canvas-photo" :width="450" :height="337"></canvas>
        </div>
        <div class="show-camera" @click="toggleCamera()">
            <span v-if="!isCameraOpen">Turn On Camera</span>
            <span v-else>Turn Off Camera</span>
        </div>
        <div class="take-photo" @click="takePhoto">
            <img src="../assets/images/camera-btn.png" alt="Snap!" />
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

const emit = defineEmits(['sendImageData'])

const createCameraElement = () => {
    const constraints = (window.constraints = {
        audio: false,
        video: true
    })

    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
            camera.value.srcObject = stream
        })
    .catch(error => {
        alert(error, "May the browser didn't support or there is some errors.")
    })
}

const stopCameraStream = () => {
    const tracks = camera.value.srcObject.getTracks()

    tracks.forEach(track => {
        track.stop()
    })
}

const toggleCamera = () => {
    if (isCameraOpen.value) {
        isCameraOpen.value = false
        isPhotoTaken.value = false
        stopCameraStream()
    } else {
        isCameraOpen.value = true
        createCameraElement()
    }
}

const takePhoto = () => {
    if (isCameraOpen.value) {
        isPhotoTaken.value = !isPhotoTaken.value;
        const context = canvas.value.getContext('2d');
        const photoFromVideo = camera.value;
        context.drawImage(photoFromVideo, 0, 0, 450, 337);
        imageData.value = canvas.value.toDataURL().split(',');
        emit('sendImageData', imageData.value[1]);
    } else {
        alert('First open your camera')
    }
}
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
  
.take-photo {
    position: absolute;
    cursor: pointer;
    width: 120px;
    height: 120px;
    bottom: 20px;
}
  
.show-camera {
    position: absolute;
    cursor: pointer;
    top: 15px;
    right: 36%;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100px;
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
  