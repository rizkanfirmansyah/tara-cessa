interface FrontDeskType {
    id?: number;
    room_number: string;
    name: string;
    sender?: string;
    sender_position?: string;
    greeting?: string;
    checkin: Date;
    checkout: Date;
}
  
export type { FrontDeskType };
  