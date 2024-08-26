interface AmenityCategoryType {
  id: number;
  hotelId: number;
  name: string;
  img: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface AmenityType {
  id: number;
  categoryId: number;
  foodCategory: AmenityCategoryType;
  name: string;
  description: string;
  img: string;
  price: number;
  availability: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type { AmenityCategoryType, AmenityType };
