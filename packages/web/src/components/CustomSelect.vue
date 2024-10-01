<template>
  <div class="custom-select" :class="[{'active': isClassActive}, { disabled }]">
    <button
      ref="selectBtn"
      class="select-button"
      role="combobox"
      aria-labelledby="select button"
      aria-haspopup="listbox"
      :aria-expanded="ariaExpanded"
      :disabled="disabled"
      aria-controls="select-dropdown"
      @click.stop="handleButtonClick"
    >
      <span class="selected-value" :style="selectedValueStyles" v-text="selectedLabel"></span>
      <span class="arrow"></span>
    </button>

    <ul id="select-dropdown" class="select-dropdown" role="listbox">
      <li
        v-for="(option, index) in options" :key="index" :value="option.value" role="option"
        :class="{selected: isSelectedOption(option.value)}"
        aria-selected="false" tabindex="0" @keydown.enter="selectOption(option)"
        @click="selectOption(option)">
        {{ option.label || option.value }}
      </li>
    </ul>

  </div>

</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';

export default defineComponent({
  name: 'CustomSelect',
  props: {
    options: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
      default: null,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const isClassActive = ref(false);
    const ariaExpanded = computed(() => !isClassActive.value);
    const selectedOption = ref(props.placeholder);
    const selectedLabel = ref(props.placeholder);
    const selectBtn = ref<HTMLElement | null>(null);

    watch(() => props.value, (newVal) => {

      if (!newVal) {
        selectedOption.value = props.placeholder;
        selectedLabel.value = props.placeholder;
      } else {
        selectedOption.value = newVal.value;
        selectedLabel.value = newVal.label ?? newVal.value;
      }
    }, { immediate: true });

    onMounted(() => {
      if (isClassActive.value) {
        document.addEventListener('click', closeDropdown);
      }
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', closeDropdown);
    });

    const closeDropdown = (event) => {
      if (event.target !== selectBtn?.value && !selectBtn?.value?.contains(event.target)) {
        isClassActive.value = false;
      }
    };

    const updateValue = (event) => {
      const option = props.options.find(option => option.value === event.target.value);
      emit('update:value', option);
    };

    const handleButtonClick = () => {
      isClassActive.value = !isClassActive.value;

      if (isClassActive.value) {
        document.addEventListener('click', closeDropdown);
      } else {
        document.removeEventListener('click', closeDropdown);
      }
    };

    const selectOption = (option) => {
      if (selectedOption.value === option.value) {
        return;
      }
      selectedOption.value = option.value;
      selectedLabel.value = option.label || option.value;
      isClassActive.value = false;
      emit('update:value', option);
    };

    const isSelectedOption = (option) => selectedOption.value === option.value;

    const selectedValueStyles = computed(() => {
      if (selectedOption.value === props.placeholder) {
        return {
          color: '#8e8e8e',
        };
      }

      return { color: '#000' };
    });

    return {
      isClassActive,
      ariaExpanded,
      selectedOption,
      selectedValueStyles,
      selectedLabel,
      updateValue,
      handleButtonClick,
      selectOption,
      isSelectedOption,
    };
  },
});
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
  height: 56px;
  color: #000;
  margin-top: 3rem;
  font-family: Arial, sans-serif;

  &:focus-visible {
    outline: none;
  }
}

.select-button {
  max-width: 410px;
  min-height: 56px;
  height: 100%;
  width: 100%;
  font-size: 16px;
  background-color: #fff;
  padding: 0.675em 1em;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:focus-visible {
    outline: none;
  }
}

.selected-value {
  text-align: left;
  color: #8e8e8e;
}

.arrow {
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid #000;
  transition: transform ease-in-out 0.3s;
}

.select-dropdown {
  position: absolute;
  list-style: none;
  width: 100%;
  max-width: 410px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px;
  margin-top: 2px;
  max-height: 200px;
  overflow-y: auto;
  transition: 0.5s ease;
  transform: scaleY(0);
  opacity: 0;
  visibility: hidden;
  z-index: 1;
  color: black;
  box-sizing: border-box;
}

.select-dropdown:focus-within {
  box-shadow: 0 10px 25px rgba(128, 128, 128, 0.6);
}

.select-dropdown li {
  position: relative;
  cursor: pointer;
  padding: 6px;
}

.select-dropdown li.selected {
  background-color: #f2f2f2;
}

.select-dropdown::-webkit-scrollbar {
  width: 7px;
}

.select-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 25px;
}

.select-dropdown::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 25px;
}

.select-dropdown li:hover {
  background-color: #f2f2f2;
}

.custom-select.active .arrow {
  transform: rotate(180deg);
}

.custom-select.active .select-dropdown {
  opacity: 1;
  visibility: visible;
  transform: scaleY(1);
}

.custom-select.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.select-button.disabled {
  cursor: not-allowed;
}

</style>
