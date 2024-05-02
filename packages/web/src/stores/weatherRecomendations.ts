import { defineStore } from 'pinia'
import { useGeolocationStore } from './geolocation';
import { testAvatar } from '../assets/images/testAvatar'

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
      const url = new URL('https://refined-legend-421215.uc.r.appspot.com/api/weather/recommendation');
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
    async requestWeather() {
      let clothesRetrieved = false;
      let data;

      while (!clothesRetrieved) {
        try {
          data = await this.fetchWeatherRecommendation();

          if (data.clothes.length > 0) {
            clothesRetrieved = true;
          }
        } catch (error) {
          console.error('Error fetching weather recommendation:', error);
        }
      }

      this.weather.description = data.weather.description;
      this.weather.temperature = data.weather.temperature + '°C';
      this.weather.emojis = data.weather.emojis;
      // this.image = data.image;
      this.image = testAvatar;
      this.clothes = data.clothes;
      this.recommendation = data.recommendation;
    },
    async verifyWeatherRecommendation(data) {
      const url = new URL('https://refined-legend-421215.uc.r.appspot.com/api/weather/verify');
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
      const url = new URL('https://refined-legend-421215.uc.r.appspot.com/api/stable-diffusion/predict');
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
