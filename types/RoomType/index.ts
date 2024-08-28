interface RoomManageType {
  id: number;
  hotelId: number;
  roomId: number | null;
  no: string;
  guestName: string;
  greetings: string;
  sender: string;
  link: string;
  senderPosition: string;
  guestPhoto: string;
  macAddr: string;
  wifiSsid: string;
  checkInTime?: string;
  checkOutTime?: string;
  wifiPassword: string;
  createdAt: string;
  updatedAt: string;
}

interface LoungeType {
  id: number;
  hotelId: number;
  tableName: string;
  tableNo: string;
  location: string;
  link: string;
}

interface PoolTableType {
  id: number;
  hotelId: number;
  poolTableName: string;
  poolTableNo: string;
  location: string;
  link: string;
}

export type { RoomManageType, LoungeType, PoolTableType };
