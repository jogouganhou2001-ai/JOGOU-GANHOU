
export const TICKET_PRICE = 5.00;
export const INITIAL_PRIZE = 15000.00; // 15k Start (More realistic for 30min draws)
export const PRIZE_PERCENTAGE = 0.70; // 70% goes to prize
export const OPS_PERCENTAGE = 0.30;   // 30% goes to operations/profit

export const MOCK_WINNERS = [
  {
    id: '1',
    name: 'Carlos Silva',
    date: '15 Out 2023',
    prize: 18500.00,
    avatar: 'https://picsum.photos/id/1005/100/100',
    testimonial: 'Ganhei 18 mil rapidinho. Paguei minhas dívidas na hora!'
  },
  {
    id: '2',
    name: 'Mariana Souza',
    date: '08 Out 2023',
    prize: 12450.00,
    avatar: 'https://picsum.photos/id/1011/100/100',
    testimonial: 'Adorei a transparência. O PIX caiu em 5 minutos.'
  },
  {
    id: '3',
    name: 'João Pedro',
    date: '01 Out 2023',
    prize: 42000.00,
    avatar: 'https://picsum.photos/id/1012/100/100',
    testimonial: 'Comprei 2 tickets e levei o acumulado da noite. Surreal!'
  }
];

export const TRANSPARENCY_REPORTS = [
  { id: 'r1', month: 'Setembro', year: 2023, totalCollected: 65000.00, totalPaid: 45500.00 },
  { id: 'r2', month: 'Agosto', year: 2023, totalCollected: 58000.00, totalPaid: 40600.00 },
  { id: 'r3', month: 'Julho', year: 2023, totalCollected: 61200.00, totalPaid: 42840.00 },
];
