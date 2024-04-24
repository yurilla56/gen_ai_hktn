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
  recommendation: string;
  image: string;
}

export interface IWeatherAndRecommendation {
  weather: string;
  recommendation: string;
  clothes: string[];
  image: string;
}
