<template>
  <div class="settings-page">
    <div class="logo" @click="goToPage('')">
      <img src="../../assets/images/logo_small.svg" alt="bomboloo">
    </div>
    <h1>Settings</h1>
    <div class="form">
      <input
        v-model="user.name"
        class="name element"
        type="text"
        placeholder="Your name"
        @blur="validateName"
        @keyup.enter="validateName"
      >

      <CustomSelect
        :options="genders"
        placeholder="Gender"
        class="gender"
        @update:value="handleGenderChange"
      ></CustomSelect>

      <CustomSelect
        :options="ages"
        placeholder="Age"
        class="age"
        @update:value="handleAgeChange"
      ></CustomSelect>

      <div class="location">
        <CustomSelect
          v-if="!user.location.country"
          :options="countries"
          placeholder="Select country"
          @update:value="handleCountryChange"
        ></CustomSelect>

        <CustomSelect
          v-if="user.location.country && !user.location.city"
          :options="cities"
          placeholder="Select city"
          @update:value="handleCityChange"
        ></CustomSelect>

        <div
          v-if="user.location.country && user.location.city"
          class="location-input-wrapper">
          <input
            id="location"
            type="text"
            :value="`${user.location.country}, ${user.location.city}`"
            readonly
          >

          <div
            v-if="user.location.country && user.location.city"
            class="reset-icon"
            @click="resetSelection">
            <img src="../../assets/images/unchecked.svg" alt="delete">
          </div>
        </div>
      </div>

      <CustomSelect
        class="language"
        :options="languages"
        :default-value="defaultLanguage"
        placeholder="Country"
        @update:value="handleLanguageChange"
      ></CustomSelect>

      <div class="submit">
        <button :disabled="isDisabled" @click="submit">Let's Go</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, reactive, computed } from 'vue';
import CustomSelect from '@/components/CustomSelect.vue';
import localStorageService from '../../../service/utils/localStorageService';

const router = useRouter();

const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const languages = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
];

const defaultLanguage = languages[0];

const user = reactive({
  name: null,
  gender: null,
  age: null,
  location: {
    country: null,
    city: null,
  },
  language: defaultLanguage.label,
});

const ages = Array.from({ length: 10 }, (_, i) => {
      const value = i + 3;
      return { value };
    },
  )
;

const countries = ref([]);
const cities = ref([]);

const isDisabled = computed(() => !user.name || !user.gender || !user.age || !user.location.country || !user.location.city);

onMounted(async () => {
  await getCountryList();
});

const getCountryList = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    countries.value = data.map(country => ({ value: country.cca2, label: country.name.common })).sort(sortByAlphabet);
  } catch (error) {
    console.error('Error fetching countries: ', error);
  }
};

const getCityList = async (newCountry) => {
  try {
    const response = await fetch(`http://api.geonames.org/searchJSON?country=${newCountry.value}&maxRows=10&username=bomboloo`);
    const data = await response.json();
    cities.value = data.geonames.map(city => ({ value: city.geonameId, label: city.name })).sort(sortByAlphabet);
  } catch (error) {
    console.error('Error fetching cities: ', error);
    cities.value = [];
  }
};

const handleCountryChange = async (newCountry) => {
  user.location.country = newCountry.label;
  await getCityList(newCountry);
};

const handleCityChange = (newCity) => {
  user.location.city = newCity.label;
  console.log('user: ', user);
};

const resetSelection = () => {
  user.location.country = null;
  user.location.city = null;
};

const goToPage = (page) => {
  router.push(`/${page}`);
};

const handleGenderChange = (newGender) => {
  user.gender = newGender.label;
};

const handleAgeChange = (newAge) => {
  user.age = newAge.value;
};

const handleLanguageChange = (newLanguage) => {
  user.language = newLanguage.label;
};

const validateName = () => {
  const namePattern = /^[a-zA-Z]{3,}$/;
  if (!namePattern.test(user.name)) {
    user.name = null;
  }
};

const submit = () => {
  localStorageService.setUser(user);
};

const sortByAlphabet = (a, b) => a.label.localeCompare(b.label);

</script>

<style lang="scss" scoped>

$form-elements: name, gender, location, age, language, submit;

@each $element in $form-elements {
  .#{$element} {
    grid-area: $element;

    &:focus-visible {
      outline: none;
    }
  }
}

.settings-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #f5f5f5;
  box-sizing: border-box;

  .form {
    display: grid;
    grid-template-areas:
      "name ."
      "gender location"
      "age language"
      "submit submit";
    grid-template-columns: 1fr 1fr;
    width: 100%;
    align-self: center;
    max-width: 948px;
    grid-gap: 20px;
    padding: 20px;

    .element {
      max-width: 410px;
      height: 56px;
      width: 100%;
      padding: 10px;
      border: none;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      font-size: 16px;
      box-sizing: border-box;

      &:focus {
        border-color: #007bff;
        outline: none;
      }
    }
  }
}

.logo {
  align-self: start;

  &:hover {
    cursor: pointer;
  }
}

.lets-go {
  align-self: center;
  background-color: purple;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

.location,
.language {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;

  .custom-select {
    display: flex;
    justify-content: flex-end;
  }
}

.location-input-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 410px;
  height: 56px;
  box-sizing: border-box;

  input {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 16px;
    padding: 10px;
    box-sizing: border-box;
    cursor: pointer;
    background-color: #fff;

    &:focus {
      border-color: #007bff;
      outline: none;
    }
  }
}

.reset-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;

  img {
    width: 28px;
  }
}

.submit {
  margin-top: 30px;

  button {
    width: 90%;
    padding: 20px;
    box-sizing: border-box;
    border: none;
    border-radius: 64px;
    background-color: #5214CC;
    font-family: Montserrat, sans-serif;
    font-weight: bold;
    font-size: 48px;
    color: #ffffff;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }

    &:active {
      outline: none;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      transition: box-shadow 0.3s ease, opacity 0.3s ease;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none;

      &:hover {
        box-shadow: none;
      }
    }
  }
}

</style>
