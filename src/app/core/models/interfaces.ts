export interface IMessage {
  id: number;
  message: string;
  timestamp: string;
  isUser: boolean;
  name: string
}


export interface IPAddress {
  ip: string
}


export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  birthdate: string; // Consider using Date type if the date manipulation is needed
  base64Barcode: string;
}
