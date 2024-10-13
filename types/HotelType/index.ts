interface HotelType {
  length: number;
  id: number;
  name: string;
  branch: string;
  city: string;
  province: string;
  state: string;
  defaultGreeting: string;
  defaultLink: string;
  apiKey: string;
  restoOpen: number;
  createdAt: string;
  updatedAt: string;
}

interface HotelProfileType {
  id: number;
  hotelId: number;
  logoColor: string;
  logoWhite: string;
  logoBlack: string;
  primaryColor: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type { HotelType, HotelProfileType };
