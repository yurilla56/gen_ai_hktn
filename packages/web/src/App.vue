<template>
  <router-view/>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleMessage = (event) => {
  if (event.origin === 'https://halloween-app-dot-or2-msq-epm-gnai5-t1iylu.oa.r.appspot.com') {
    if (event.data.action === 'navigateBack') {
      router.push('/');
    }
  }
};

onMounted(() => {
  window.addEventListener('message', handleMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
});
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}

#app {
  height: 100vh;
  min-height: 412px;
  overflow: auto;
  font-family: Montserrat, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
