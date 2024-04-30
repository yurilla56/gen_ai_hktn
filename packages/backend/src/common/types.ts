import { IWeather } from '../integrations/open-weather-map/types';

export enum Verification {
  PASS = 'PASS',
  FAIL = 'FAIL',
}

export interface ILocation {
  lat: number;
  lon: number;
}

export interface IVerificationResult {
  result: Verification;
  details?: string;
}

export interface IVerifyClothes {
  readonly clothes: string[];
  readonly image: string;
}

export interface IWeatherAndRecommendation {
  weather: IWeather;
  recommendation: string;
  clothes: string[];
  image: string;
}
