interface FacilityCategoryType {
  id: number;
  hotelId: number;
  name: string;
  img: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface FacilityType {
  id: number;
  categoryId: number;
  facilityCategory: FacilityCategoryType;
  name: string;
  description: string;
  img: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type { FacilityCategoryType, FacilityType };
