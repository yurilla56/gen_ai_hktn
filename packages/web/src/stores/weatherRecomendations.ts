import { defineStore } from 'pinia'
import { useGeolocationStore } from './geolocation';
import { fallbackAvatar } from '../assets/images/fallbackAvatar'

const apiKey = process.env.VUE_APP_X_API_KEY;


export const useWeatherRecomendationsStore = defineStore('weatherRecomendations', {
  state: () => ({
    weather: {
      description: '',
      temperature: '',
      emojis: ''
    },
    clothes: [],
    recommendation: '',
    image: ''
  }),
  actions: {
    async fetchWeatherRecommendation() {
      const geolocationStore = useGeolocationStore();
      const lat = geolocationStore.lat;
      const lon = geolocationStore.lon;
      const url = new URL('https://or2-msq-epm-gnai5-t1iylu.oa.r.appspot.com/api/weather/recommendation');
      url.searchParams.set('lat', lat);
      url.searchParams.set('lon', lon);
    
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'x-api-key': apiKey,
        },
      });
    
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
    
      return await response.json();
    },

    async fetchQuizzes() {
      const url = new URL('https://or2-msq-epm-gnai5-t1iylu.oa.r.appspot.com/api/quizzes');
    
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'x-api-key': apiKey,
        },
      });
    
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
    
      return await response.json();
    },

    async requestWeather() {
      // let clothesRetrieved = false;
      let data;

      // while (!clothesRetrieved) {
        try {
          data = await this.fetchWeatherRecommendation();

          // if (data.clothes.length > 0) {
          //   clothesRetrieved = true;
          // }
        } catch (error) {
          console.error('Error fetching weather recommendation:', error);
        }
      // }

      // const testAvatar = await this.getAvatar();
      // console.log('testAvatar', testAvatar);

      const dataDummy = {
        clothes: ['shorts', 't-shirt', 'sunhat', 'sunglasses'],
        weather: {
          description: 'Hi there! Today in Fethiye, the weather is very sunny and warm. It feels like a big, cozy hug from the sun! The temperature is quite hot, just like a warm bath. The sky is clear with no clouds. Have fun and stay cool!',
          temperature: 31,
          emojis: '☀️'
        },
        recommendation: 'You should wear a t-shirt and shorts, and don\'t forget your sunglasses, sunhat and to apply sunscreen! ',
      };

      this.weather.description = data?.weather?.description ?? dataDummy.weather.description;
      this.weather.temperature = (data?.weather?.temperature ?? dataDummy.weather.temperature) + '°C';
      this.weather.emojis = data?.weather?.emojis ?? dataDummy.weather.emojis;
      // this.image = data.image;
      this.image = fallbackAvatar;
      this.clothes = data?.clothes ?? dataDummy.clothes;
      this.recommendation = data?.recommendation ?? dataDummy.recommendation;
    },
    async verifyWeatherRecommendation(data) {
      console.log('verifyWeatherRecommendation');
      const url = new URL('https://or2-msq-epm-gnai5-t1iylu.oa.r.appspot.com/api/weather/verify');
      const dataString = JSON.stringify(data);
    
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'x-api-key': apiKey,
        },
        body: dataString
      });
    
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
    
      return await response.json();
    },
    async getAvatar() {
      const url = new URL('https://or2-msq-epm-gnai5-t1iylu.oa.r.appspot.com/api/stable-diffusion/predict');
      // const avatarDescription = 'this is a cartoon drawn penguin';
      // const clothesString = this.clothes.join(', ');
      // const weatherDescription = this.weather.description;
      // const prompt = {
      //   prompt: `You will receive avatar description, that depicts outlook of avatar, also you will get list of clothes, in which avatar must be dressed up, also you will get weather conditions for background
      //   Avatar description: ${avatarDescription}  
      //   List of clothes: ${clothesString}
      //   Weather conditions: ${weatherDescription}
      //   You must draw image based on all this information`
      // };
      const prompt = {
          prompt: 'You will receive avatar description, that depicts outlook of avatar, also you will get list of clothes, in which avatar must be dressed up, also you will get weather conditions for background \n Avatar description: this is a cartoon drawn penguin \n List of clothes: t-shirt, shorts, jacket \n Weather conditions: The weather in Fethiye is clear sky with a temperature of 22.97°C and humidity of 45% \n You must draw image based on all this information'
      };
      const dataString = JSON.stringify(prompt);
    
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-type': 'application/json',
          'x-api-key': apiKey,
        },
        body: dataString
      });
      const test = await response.json();
    
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
    
      return test;
    },
  },
})
