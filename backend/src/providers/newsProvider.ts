export interface NewsItem {
  id: string;
  category: 'BTC' | 'หุ้น' | 'คริปโต' | 'ตลาดไทย' | 'MACRO';
  type: 'crypto' | 'stock' | 'macro';
  time: string;
  title: string;
  source: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  aiSummary: string;
  fullContent: string;
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
    fullContent: 'Bitcoin ทะลุระดับ 104,000 ดอลลาร์เป็นครั้งแรกในประวัติศาสตร์ โดยมีปัจจัยหนุนสำคัญจากการซื้อสะสมอย่างต่อเนื่องของสถาบันการเงินยักษ์ใหญ่ผ่าน BTC Spot ETF นักวิเคราะห์มองว่าเป็นสัญญาณของการยอมรับในสินทรัพย์ดิจิทัลในฐานะ \'Digital Gold\' อย่างแท้จริง แม้จะมีแรงเทขายทำกำไรบ้างในระยะสั้น แต่แนวโน้มโดยรวมยังคงแข็งแกร่ง',
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
    fullContent: 'NVIDIA ประกาศผลประกอบการไตรมาสที่ 3 ที่น่าประทับใจ โดยรายได้และกำไรเติบโตเหนือความคาดหมายของนักวิเคราะห์ จากความต้องการชิปสำหรับ AI ที่ไม่มีท่าทีว่าจะแผ่วลง โดยเฉพาะชิปรุ่น Blackwell ที่ได้รับคำสั่งซื้อล่วงหน้ามหาศาล ส่งผลให้หุ้นกลุ่มเทคโนโลยีทั่วโลกปรับตัวขึ้นตามทิศทางของ NVIDIA',
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
    fullContent: 'ราคา Ethereum ฟื้นตัวขึ้นแตะระดับ 3,250 ดอลลาร์ โดยได้รับแรงหนุนจากกิจกรรมที่เพิ่มขึ้นในเครือข่าย Layer 2 และปริมาณ ETH ที่ถูกนำไป Stake ในระบบเพิ่มขึ้นเรื่อยๆ ซึ่งส่งผลให้อุปทานหมุนเวียนในตลาดลดลง ตามกลไกของ Ethereum 2.0 ซึ่งนักวิเคราะห์เชื่อว่านี่เป็นปัจจัยพื้นฐานที่แข็งแกร่งสำหรับแนวโน้มขาขึ้นในระยะยาว',
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

  getNewsById(id: string): NewsItem | undefined {
    return DEMO_NEWS.find((n) => n.id === id);
  }
}
