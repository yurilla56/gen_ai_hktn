<template>
  <router-view/>
</template>

<script setup lang="ts">
import { onMounted, provide } from 'vue';
import events from '@/stores/events.json';

let currentHero = null;

onMounted(() => {
  currentHero = 'penguin';
  provide('currentHero', currentHero);

  const currentEvent = checkEventToday();
  provide('currentEvent', currentEvent);
});

const checkEventToday = () => {
  const today = new Date();
  const formattedToday = `${today.getMonth() + 1}-${today.getDate()}`;

  for (let event of events.data) {
    const { start, end } = event.period;
    if (isDateWithinRange(formattedToday, start, end)) {
      return event.name;
    }
  }
  return null;
}
const isDateWithinRange = (date, start, end) => {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-${start}`);
  const endDate = new Date(`${currentYear}-${end}`);
  const checkDate = new Date(`${currentYear}-${date}`);

  return checkDate >= startDate && checkDate <= endDate;
}
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
