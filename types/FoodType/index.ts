interface FoodCategoryType {
    id: number;
    hotelId: number;
    name: string;
    img: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
}

interface FoodType {
    id: number;
    categoryId: number;
    foodCategory: FoodCategoryType;
    name: string;
    description: string;
    img: string;
    price: number;
    availability: boolean;
    stock: number;
    favorite: number;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
}

interface FoodAdditionalType {
    id: number;
    foodId: number;
    name: string;
    price: number;
    createdAt?: string;
    updatedAt?: string;
}

export type { FoodCategoryType, FoodType, FoodAdditionalType };
