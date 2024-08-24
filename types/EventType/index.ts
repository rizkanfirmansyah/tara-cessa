interface EventCategoryType {
    id: number;
    hotelId: number;
    name: string;
    img: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null; // Beri tipe string atau null untuk deletedAt
}

// Membuat antarmuka untuk event
interface EventType {
    id: number;
    categoryId: number;
    eventCategory: EventCategoryType;
    name: string;
    description: string;
    img: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null; // Beri tipe string atau null untuk deletedAt
}
export type { EventType, EventCategoryType };
