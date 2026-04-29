export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableClasses: string[];
}

export interface PNR {
  itinerary: Flight[];
  names: string[];
  phone?: string;
  ticketingLimit?: string;
  status: 'OPEN' | 'CONFIRMED' | 'TICKETED';
}

export interface TerminalLine {
  text: string;
  type: 'command' | 'response' | 'error';
  timestamp: number;
}
