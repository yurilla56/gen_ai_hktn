<template>
<button @click="handleClick">{{ text }}</button>
</template>

<script setup>
// import { ref } from 'vue';

defineProps({
  text: {
    type: String,
    default: 'Click me!'
  },
});

const handleClick = (event) => {
// Handle button click logic
console.log('event', event);
};
</script>