interface ChatDepartementType {
  id: number;
  hotelID: number;
  department: string;
  icon: string;
}

type ChatType = {
  departmentId: number;
  roomNo: string;
  guestName: string;
  id: string;
  message: string;
  owner: string;
  sessionId: string;
  timestamp: string;
};

type GroupedMessages = {
  [departmentId: number]: { 
    [roomNo: string]: ChatType[];
  };
};
export type { ChatDepartementType, ChatType, GroupedMessages };
