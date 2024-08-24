export type RoleType = {
    id: number;
    name: string;
    canManageUser: number;
    canManageData: number;
    canManageHotels: number;
    canManageDevices: number;
    frontdesk: number;
    createdAt?: string;
    updatedAt?: string;
};

export type UserType = {
    id: number;
    email: string;
    name: string;
    roleId: number;
    hotelId: number;
    role: RoleType;
    token: string;
    createdAt: string;
    updatedAt: string;
};

export type ApiResponseType = {
    response_code: number;
    message: string;
    data: any;
};
