export interface NewsItem {
  id: string;
  category: 'BTC' | 'หุ้น' | 'คริปโต' | 'ตลาดไทย' | 'MACRO';
  type: 'crypto' | 'stock' | 'macro';
  time: string;
  title: string;
  source: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  aiSummary: string;
  url: string;
  isDemo: boolean;
}

export const DEMO_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    category: 'BTC',
    type: 'crypto',
    time: '14:20',
    title: 'Bitcoin พุ่งทะลุ 104,000 ดอลลาร์ หลังมีแรงซื้อจากสถาบันใหญ่',
    source: 'CoinDesk',
    sentiment: 'POSITIVE',
    aiSummary: 'สถาบันการเงินระดับโลกเพิ่มสัดส่วนการถือครอง BTC Spot ETF ส่งผลให้เกิดแรงซื้อต่อเนื่องหนุนราคาทะลุแนวต้านสำคัญ',
    url: '#',
    isDemo: true
  },
  {
    id: 'news-2',
    category: 'หุ้น',
    type: 'stock',
    time: '13:45',
    title: 'NVIDIA รายงานผลประกอบการดีกว่าคาด หนุนหุ้นเทคโนโลยีทั่วโลก',
    source: 'Reuters',
    sentiment: 'POSITIVE',
    aiSummary: 'ความต้องการชิป AI รุ่นใหม่ Blackwell พุ่งสูงอย่างต่อเนื่อง ดันรายได้ Q3 โตทะลุเป้า หนุน Sentiment หุ้นกลุ่ม AI Semiconductor',
    url: '#',
    isDemo: true
  },
  {
    id: 'news-3',
    category: 'คริปโต',
    type: 'crypto',
    time: '12:30',
    title: 'Ethereum แตะ 3,250 ดอลลาร์ นักวิเคราะห์ชี้แนวโน้มยังเป็นขาขึ้น',
    source: 'Cointelegraph',
    sentiment: 'POSITIVE',
    aiSummary: 'กิจกรรมบน Layer 2 และปริมาณการ Stake ของ ETH เพิ่มขึ้น ทำให้อุปทานหมุนเวียนลดลง ช่วยเสริมโมเมนตัมขาขึ้น',
    url: '#',
    isDemo: true
  },
  {
    id: 'news-4',
    category: 'ตลาดไทย',
    type: 'stock',
    time: '11:15',
    title: 'SET ปิดบวก 16.32 จุด รับข่าวเศรษฐกิจไทยและแรงซื้อจากต่างชาติ',
    source: 'กรุงเทพธุรกิจ',
    sentiment: 'POSITIVE',
    aiSummary: 'Fund Flow ต่างชาติไหลกลับเข้าตลาดหุ้นไทย หนุนหุ้นกลุ่มพลังงานและการเงิน PTT, BBL ปรับตัวขึ้นโดดเด่น',
    url: '#',
    isDemo: true
  },
  {
    id: 'news-5',
    category: 'คริปโต',
    type: 'crypto',
    time: '10:05',
    title: 'Solana (SOL) พุ่ง 8% หลังประกาศพัฒนาระบบใหม่เร็วขึ้น',
    source: 'The Block',
    sentiment: 'POSITIVE',
    aiSummary: 'การอัปเกรด Firedancer ช่วยเพิ่ม Throughput และลด Latency ดึงดูดเม็ดเงินและ DeFi TVL ไหลเข้าสู่ระบบนิเวศ',
    url: '#',
    isDemo: true
  },
  {
    id: 'news-6',
    category: 'หุ้น',
    type: 'stock',
    time: '09:30',
    title: 'ธนาคารกลางสหรัฐฯ (Fed) ส่งสัญญาณคงดอกเบี้ยตามคาดการณ์',
    source: 'Bloomberg',
    sentiment: 'NEUTRAL',
    aiSummary: 'ประธานเฟดระบุว่าเงินเฟ้อเริ่มเข้าสู่กรอบเป้าหมาย แต่ยังต้องจับตาข้อมูลการจ้างงานอย่างใกล้ชิดก่อนปรับลดอัตราดอกเบี้ย',
    url: '#',
    isDemo: true
  }
];

export class NewsProvider {
  getNews(category?: string, sentiment?: string): NewsItem[] {
    let result = [...DEMO_NEWS];

    if (category && category !== 'All' && category !== 'ทั้งหมด') {
      result = result.filter((n) => n.category === category || n.type === category.toLowerCase());
    }

    if (sentiment && sentiment !== 'All') {
      result = result.filter((n) => n.sentiment === sentiment.toUpperCase());
    }

    return result;
  }
}
