interface RoomManageType {
  id: number;
  hotelId: number;
  roomId: number | null;
  no: string;
  guestName: string;
  greetings: string;
  sender: string;
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

export type { RoomManageType };
