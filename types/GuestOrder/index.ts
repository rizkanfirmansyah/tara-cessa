interface FoodAdditionalItemType {
  id: number;
  foodItemId: number;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

interface FoodItemType {
  id: number;
  orderId: number;
  foodId: number;
  name: string;
  price: number;
  qty: number;
  note: string;
  prepared: number;
  foodAdditional: FoodAdditionalItemType[];
  createdAt: string;
  updatedAt: string;
}

interface AmenityItemType {
  id: number;
  orderId: number;
  amenityId: number;
  name: string;
  price: number;
  qty: number;
  note: string;
  prepared: number;
  createdAt: string;
  updatedAt: string;
}

interface FacilityItemType {
  id: number;
  orderId: number;
  facilityId: number;
  name: string;
  price: number;
  qty: number;
  note: string;
  prepared: number;
  destination: string;
  time: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderType {
  id: number;
  hotelId: number;
  roomId: number;
  roomNo: string;
  orderDate: string;
  verified: number;
  preparing: number;
  delivery: number;
  arrived: number;
  paid: number;
  foodItems: FoodItemType[];
  amenityItems: AmenityItemType[];
  facilityItems: FacilityItemType[];
  roomTypeItems: any; // Kamu bisa menentukan tipe yang sesuai jika kamu tahu
  eventItems: any; // Kamu bisa menentukan tipe yang sesuai jika kamu tahu
  createdAt: string;
  updatedAt: string;
}

export type { OrderType, FacilityItemType, AmenityItemType, FoodItemType, FoodAdditionalItemType };
