import { defineStore } from 'pinia'

export const useGeolocationStore = defineStore('geolocation', {
  state: () => ({
    lat: '',
    lon: '',
    locationName: '',
  }),
  actions: {
    async getUserLocation() {
      try {
        const position = await navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.lat = pos.coords.latitude.toString();
            this.lon = pos.coords.longitude.toString();
            this.setLocationName();
          },
          (error) => console.log('error', error)
        );
        return position;
      } catch (error) {
        console.error('Error getting geolocation:', error);
      }
    },
    async setLocationName() {
      const GEO_API_KEY = process.env.VUE_APP_GEO_API_KEY;
      const location = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.lat},${this.lon}&result_type=administrative_area_level_2&key=${GEO_API_KEY}`,{method:'POST'});
      this.locationName = (await location.json()).results[0].formatted_address;
    },
    getLocationName() {
        return this.locationName;
    }
  },
});
