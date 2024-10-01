<template>
  <div class="settings-page">
    <div class="logo" @click="goToPage('')">
      <img src="../../assets/images/logo_small.svg" alt="bomboloo">
    </div>
    <div class="header">
      <h1>Settings</h1>
      <img
        src="../../assets/images/delete-40.svg"
        alt="delete"
        title="Reset Settings"
        class="delete-icon"
        @click="resetSelection"
      >
    </div>
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
        :value="user.gender"
        placeholder="Gender"
        class="gender"
        @update:value="handleGenderChange"
      ></CustomSelect>

      <CustomSelect
        :options="ages"
        :value="user.age"
        placeholder="Age"
        class="age"
        @update:value="handleAgeChange"
      ></CustomSelect>

      <CustomSelect
        class="country"
        :options="countries"
        :value="user.location.country"
        placeholder="Select country"
        @update:value="handleCountryChange"
      ></CustomSelect>

      <CustomSelect
        class="city"
        :options="cities"
        :value="user.location.city"
        :disabled="!user.location.country || !cities?.length"
        placeholder="Select city"
        @update:value="handleCityChange"
      ></CustomSelect>

      <CustomSelect
        class="language"
        :options="languages"
        :value="user.language"
        placeholder="Language"
        @update:value="handleLanguageChange"
      ></CustomSelect>

      <div class="submit">
        <button @click="submit">Let's Go</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, reactive } from 'vue';
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
  language: defaultLanguage,
});

const ages = Array.from({ length: 10 }, (_, i) => {
      const value = i + 3;
      return { value };
    },
  )
;

const countries = ref([]);
const cities = ref([]);

// Disable button on condition
// const isDisabled = computed(() => !user.name || !user.gender || !user.age || !user.location.country || !user.location.city);

onMounted(async () => {
  await getCountryList();
});

const getCountryList = async () => {
  // cities are absent for these excluded countries
  const exclusions = [
    'AX', 'AS', 'AQ', 'BV', 'VG', 'BQ', 'CW', 'CD', 'GF',
    'TF', 'HM', 'FM', 'MC', 'MP', 'PS', 'BL', 'SH', 'MF',
    'SX', 'SS', 'SJ', 'TJ', 'TV', 'UM', 'VI', 'VA', 'EH',
  ];
  // fix old country names in order to get their city list
  const renameMap = { Czechia: 'Czech Republic', Eswatini: 'Swaziland' };
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    const filtered = data.filter(country => !exclusions.includes(country.cca2));
    countries.value = filtered.map(country => {
      const name = country.name.common;
      const label = renameMap[name] ?? name;
      return { value: country.cca2, label };
    }).sort(sortByAlphabet);
  } catch (error) {
    console.error('Error fetching countries: ', error);
  }
};

const getCityList = async (country) => {
  try {
    const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ country: country.label }),
    });

    let data = await response.json();

    if (!data) {
      data = await secondTrialRequestForCities(country.value);
    }

    if (data && data.data && Array.isArray(data.data)) {
      cities.value = data.data.map(city => ({ value: city, label: city })).sort(sortByAlphabet);
    } else {
      console.error('Unexpected response structure:', data);
      cities.value = [];
    }
  } catch {
    try {
      const data = await secondTrialRequestForCities(country.value);
      cities.value = data;
    } catch (error) {
      console.error('Error fetching cities: ', error);
      cities.value = [];
    }
  }
};

const handleCountryChange = async (newCountry) => {
  user.location.country = newCountry;
  await getCityList(newCountry);
};

const handleCityChange = (newCity) => {
  user.location.city = newCity;
  console.log('user: ', user);
};

const secondTrialRequestForCities = async (iso2) => {
  const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ iso2 }),
  });

  const data = await response.json();

  return data;
};

const resetSelection = () => {
  user.age = null;
  user.name = null;
  user.gender = null;
  user.location.country = null;
  user.location.city = null;
  user.language = defaultLanguage;
  localStorageService.removeUser();
};

const goToPage = (page) => {
  router.push(`/${page}`);
};

const handleGenderChange = (newGender) => {
  user.gender = newGender;
};

const handleAgeChange = (newAge) => {
  user.age = newAge;
};

const handleLanguageChange = (newLanguage) => {
  user.language = newLanguage;
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

$form-elements: name, gender, country, city, age, language, submit;

@each $element in $form-elements {
  .#{$element} {
    grid-area: $element;

    &:focus-visible {
      outline: none;
    }
  }
}

.settings-page {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #f5f5f5;
  box-sizing: border-box;

  .header {
    display: grid;
    grid-template-columns: 1fr auto 0.5fr 0.5fr;
    align-items: center;
    text-align: center;
    padding: 10px;
    position: relative;

    h1 {
      grid-column: 2;
    }

    .delete-icon {
      grid-column: 4;
      margin-left: 20px;
      cursor: pointer;
      width: 40px;
    }
  }

  .form {
    display: grid;
    grid-template-areas:
      "name country"
      "gender city"
      "age language"
      "submit submit";
    grid-template-columns: 1fr 1fr;
    align-items: baseline;
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

.country,
.city,
.language {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;

  .custom-select {
    display: flex;
    justify-content: flex-end;
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
