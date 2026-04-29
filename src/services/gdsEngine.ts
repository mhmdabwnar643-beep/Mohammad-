import { Flight, PNR } from '../types';

const MOCK_FLIGHTS: Flight[] = [
  { id: '1', airline: 'MS', flightNumber: '777', origin: 'CAI', destination: 'LHR', departureTime: '10:00', arrivalTime: '14:30', price: 650, availableClasses: ['Y', 'C', 'F'] },
  { id: '2', airline: 'BA', flightNumber: '154', origin: 'CAI', destination: 'LHR', departureTime: '08:00', arrivalTime: '12:15', price: 720, availableClasses: ['Y', 'J'] },
  { id: '3', airline: 'LH', flightNumber: '581', origin: 'CAI', destination: 'FRA', departureTime: '02:00', arrivalTime: '06:10', price: 550, availableClasses: ['Y', 'M', 'C'] },
  { id: '4', airline: 'MS', flightNumber: '955', origin: 'CAI', destination: 'JFK', departureTime: '03:15', arrivalTime: '11:45', price: 1200, availableClasses: ['Y', 'C'] },
  { id: '5', airline: 'EK', flightNumber: '927', origin: 'DXB', destination: 'CAI', departureTime: '15:20', arrivalTime: '18:50', price: 450, availableClasses: ['Y', 'C', 'F'] },
];

export class GDSEngine {
  private pnr: PNR = { itinerary: [], names: [], status: 'OPEN' };
  private availabilityResults: Flight[] = [];
  private receivedFrom: string = '';

  processCommand(cmd: string): string {
    const cleanCmd = cmd.trim().toUpperCase().replace(/\s+/g, ' ');
    
    if (cleanCmd.startsWith('AN')) return this.handleAvailability(cleanCmd);
    if (cleanCmd.startsWith('SS')) return this.handleSell(cleanCmd);
    if (cleanCmd.startsWith('NM1') || cleanCmd.startsWith('NM 1')) return this.handleName(cleanCmd);
    if (cleanCmd.startsWith('RF')) return this.handleReceivedFrom(cleanCmd);
    if (cleanCmd === 'RT') return this.handleRetrieve();
    if (cleanCmd.startsWith('RT')) return this.handleRetrieveLocator(cleanCmd);
    if (cleanCmd === 'IG') return this.handleIgnore();
    if (cleanCmd === 'IR') return this.handleIgnoreRetrieve();
    if (cleanCmd === 'ER' || cleanCmd === 'ET') return this.handleEndRetrieve();
    if (cleanCmd.startsWith('AP')) return this.handlePhone(cleanCmd);
    if (cleanCmd.startsWith('TK')) return this.handleTicketing(cleanCmd);
    if (cleanCmd.startsWith('DAN')) return this.handleCitySearch(cleanCmd);
    if (cleanCmd.startsWith('FQD')) return this.handleFareQuote(cleanCmd);
    if (cleanCmd.startsWith('FXP') || cleanCmd.startsWith('FXB')) return this.handleFarePricing();
    if (cleanCmd.startsWith('FP')) return this.handlePayment(cleanCmd);
    if (cleanCmd === 'HELP') return 'AVAIL: AN | SELL: SS | NAME: NM1 | SIGN: RF | PHONE: AP | TICKET: TK | RETR: RT | IG: IG | END: ER | CITY: DAN';

    return 'INVALID ENTRY - CHECK FORMAT OR USE HELP';
  }

  private handleReceivedFrom(cmd: string): string {
    this.receivedFrom = cmd.substring(2).trim();
    if (!this.receivedFrom) return 'FORMAT: RF[NAME]';
    return `OK ${this.receivedFrom}`;
  }

  private handleIgnoreRetrieve(): string {
    this.pnr = { itinerary: [], names: [], status: 'OPEN' };
    this.receivedFrom = '';
    return 'IGNORE AND RETRIEVE COMPLETED - NO PNR ACTIVE';
  }

  private handlePayment(cmd: string): string {
    return `${cmd} OK`;
  }

  private handleCitySearch(cmd: string): string {
    const city = cmd.substring(3).trim();
    if (city === 'CAIRO' || city === 'CAI') return 'CAI  CAIRO.EG\nALX  ALEXANDRIA.EG\nHRG  HURGHADA.EG';
    if (city === 'LONDON' || city === 'LON') return 'LHR  LONDON HEATHROW.GB\nLGW  LONDON GATWICK.GB\nSTN  LONDON STANSTED.GB';
    return `CITY SEARCH RESULTS FOR ${city} - NOT FOUND`;
  }

  private handleFarePricing(): string {
    if (this.pnr.itinerary.length === 0) return 'NO ITINERARY TO PRICE';
    return `** FARE DISPLAY - FXP **\n 01  FARE   USD   650.00\n     TAX    USD   120.00\n     TOTAL  USD   770.00\n     NON REFUNDABLE / CHANGES AT 50USD\n     *PRICED WITH BEST BUY*`;
  }

  private handleFareQuote(cmd: string): string {
    const matches = cmd.match(/FQD\s*([A-Z]{3})\s*([A-Z]{3})/);
    if (!matches) return 'FORMAT: FQD[ORIG][DEST] EX: FQD CAI LHR';
    const [_, orig, dest] = matches;
    return `FQD ${orig}${dest}/ANY  - TAX INCLUDED\n 1  MS  650.00USD  Y  NON-REF\n 2  BA  720.00USD  Y  REF/CHG FEES APPLIES\n 3  LH  550.00USD  M  RESTRICTED`;
  }

  private handleEndRetrieve(): string {
    if (this.pnr.names.length === 0 || this.pnr.itinerary.length === 0) {
        return 'INCOMPLETE PNR - NM1 AND SS COMMANDS REQUIRED';
    }
    if (!this.receivedFrom) {
        return 'RF ELEMENT MANDATORY - USE RF [YOUR NAME]';
    }
    this.pnr.status = 'CONFIRMED';
    const locator = Math.random().toString(36).substring(2, 8).toUpperCase();
    const result = `OK - PNR RECORDED: ${locator}\nRP/CAI1A0980/0980/29APR24`;
    this.pnr = { itinerary: [], names: [], status: 'OPEN' };
    this.receivedFrom = '';
    return result;
  }

  private handleAvailability(cmd: string): string {
    const regex = /AN\s*(\d{1,2}[A-Z]{3})?\s*([A-Z]{3})\s*([A-Z]{3})/;
    const matches = cmd.match(regex);
    if (!matches) return 'FORMAT ERROR: USE AN [DATE][ORIG][DEST]';
    const date = matches[1] || '20MAY';
    const origin = matches[2];
    const dest = matches[3];
    this.availabilityResults = MOCK_FLIGHTS.filter(f => f.origin === origin || f.destination === dest);
    if (this.availabilityResults.length === 0) return `NO AVAILABILITY FOR ${origin}-${dest} ON ${date}`;
    let response = `** AMADEUS AVAILABILITY - AN ${date} ${origin}${dest} **\n`;
    this.availabilityResults.forEach((f, i) => {
      response += `${i + 1}  ${f.airline}${f.flightNumber}  ${f.availableClasses.map(c => c+'9').join(' ')}  ${f.origin}${f.destination} ${f.departureTime} ${f.arrivalTime}  E0/77W \n`;
    });
    return response;
  }

  private handleSell(cmd: string): string {
    const matches = cmd.match(/SS\s*(\d+)\s*([A-Z])\s*(\d+)/);
    if (!matches) return 'FORMAT: SS[LINE][CLASS][SEATS] EX: SS1Y1';
    const [_, line, cls, seats] = matches;
    const index = parseInt(line) - 1;
    const flight = this.availabilityResults[index];
    if (!flight) return 'LINE NOT FOUND - RUN AN FIRST';
    this.pnr.itinerary.push(flight);
    return ` 1  ${flight.airline} ${flight.flightNumber} ${cls} ${flight.origin}${flight.destination} HK${seats} ${flight.departureTime} ${flight.arrivalTime}`;
  }

  private handleName(cmd: string): string {
    const name = cmd.replace(/NM1\s*|NM\s*1\s*/, '').trim();
    if (!name) return 'FORMAT: NM1[LAST]/[FIRST] [TITLE]';
    this.pnr.names.push(name);
    return ` 1. ${name}`;
  }

  private handleRetrieve(): string {
    if (this.pnr.itinerary.length === 0 && this.pnr.names.length === 0) return 'NO PNR ACTIVE';
    let response = `** RP/CAI1A0980/ **\n`;
    this.pnr.names.forEach((n, i) => response += `${i + 1}.${n}\n`);
    this.pnr.itinerary.forEach((f, i) => {
      response += `${i + 1} ${f.airline} ${f.flightNumber} Y ${f.origin}${f.destination} HK1 ${f.departureTime} ${f.arrivalTime}\n`;
    });
    if (this.pnr.phone) response += `AP ${this.pnr.phone}\n`;
    if (this.pnr.ticketingLimit) response += `TK TL${this.pnr.ticketingLimit}\n`;
    if (this.receivedFrom) response += `RF ${this.receivedFrom}\n`;
    response += `OK`;
    return response;
  }

  private handleRetrieveLocator(cmd: string): string {
    const locator = cmd.substring(2).trim();
    if (locator.length !== 6) return 'INVALID LOCATOR';
    return `RP/CAI1A0980/ \n 1.SMITH/JOHN MR \n 1 MS 777 Y 20MAY CAILHR HK1 1000 1430 \n AP 0123456789 \n TK TL20MAY \n OK`;
  }

  private handleIgnore(): string {
    this.pnr = { itinerary: [], names: [], status: 'OPEN' };
    this.receivedFrom = '';
    return 'PNR IGNORED';
  }

  private handlePhone(cmd: string): string {
    this.pnr.phone = cmd.substring(2).trim();
    return `AP ${this.pnr.phone}`;
  }

  private handleTicketing(cmd: string): string {
    this.pnr.ticketingLimit = cmd.substring(5).trim();
    return `TK TL${this.pnr.ticketingLimit}`;
  }
}

