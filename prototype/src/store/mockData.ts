export interface MockStock {
  symbol: string
  name: string
  price: number
  currency: 'TWD' | 'USD'
  market: 'tw' | 'us'
  type: 'stock' | 'etf' | 'fund'
  bondRatio?: number // ETF/基金才有
}

export const MOCK_TW_STOCKS: MockStock[] = [
  { symbol: '2330', name: '台積電', price: 850, currency: 'TWD', market: 'tw', type: 'stock' },
  { symbol: '2317', name: '鴻海', price: 185, currency: 'TWD', market: 'tw', type: 'stock' },
  { symbol: '2454', name: '聯發科', price: 1280, currency: 'TWD', market: 'tw', type: 'stock' },
  { symbol: '2882', name: '國泰金', price: 62, currency: 'TWD', market: 'tw', type: 'stock' },
  { symbol: '2881', name: '富邦金', price: 88, currency: 'TWD', market: 'tw', type: 'stock' },
  { symbol: '2412', name: '中華電', price: 125, currency: 'TWD', market: 'tw', type: 'stock' },
  { symbol: '2308', name: '台達電', price: 310, currency: 'TWD', market: 'tw', type: 'stock' },
  { symbol: '2303', name: '聯電', price: 48, currency: 'TWD', market: 'tw', type: 'stock' },
  { symbol: '6505', name: '台塑化', price: 88, currency: 'TWD', market: 'tw', type: 'stock' },
  { symbol: '1301', name: '台塑', price: 82, currency: 'TWD', market: 'tw', type: 'stock' },
]

export const MOCK_TW_ETFS: MockStock[] = [
  { symbol: '0050', name: '元大台灣50', price: 148, currency: 'TWD', market: 'tw', type: 'etf', bondRatio: 0 },
  { symbol: '0056', name: '元大高股息', price: 38, currency: 'TWD', market: 'tw', type: 'etf', bondRatio: 0 },
  { symbol: '00878', name: '國泰永續高股息', price: 21, currency: 'TWD', market: 'tw', type: 'etf', bondRatio: 0 },
  { symbol: '00919', name: '群益台灣精選高息', price: 22, currency: 'TWD', market: 'tw', type: 'etf', bondRatio: 0 },
  { symbol: '00679B', name: '元大美債20年', price: 35, currency: 'TWD', market: 'tw', type: 'etf', bondRatio: 100 },
  { symbol: '00720B', name: '元大投資等級公司債', price: 38, currency: 'TWD', market: 'tw', type: 'etf', bondRatio: 100 },
  { symbol: '00751B', name: '富邦美債7-10', price: 35, currency: 'TWD', market: 'tw', type: 'etf', bondRatio: 100 },
  { symbol: '00713', name: '元大台灣高息低波', price: 58, currency: 'TWD', market: 'tw', type: 'etf', bondRatio: 0 },
  { symbol: '006208', name: '富邦台50', price: 95, currency: 'TWD', market: 'tw', type: 'etf', bondRatio: 0 },
  { symbol: '00885', name: '富邦越南', price: 18, currency: 'TWD', market: 'tw', type: 'etf', bondRatio: 0 },
]

export const MOCK_US_STOCKS: MockStock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 195, currency: 'USD', market: 'us', type: 'stock' },
  { symbol: 'MSFT', name: 'Microsoft', price: 415, currency: 'USD', market: 'us', type: 'stock' },
  { symbol: 'NVDA', name: 'NVIDIA', price: 875, currency: 'USD', market: 'us', type: 'stock' },
  { symbol: 'GOOGL', name: 'Alphabet', price: 168, currency: 'USD', market: 'us', type: 'stock' },
  { symbol: 'AMZN', name: 'Amazon', price: 182, currency: 'USD', market: 'us', type: 'stock' },
  { symbol: 'META', name: 'Meta Platforms', price: 512, currency: 'USD', market: 'us', type: 'stock' },
  { symbol: 'TSLA', name: 'Tesla', price: 175, currency: 'USD', market: 'us', type: 'stock' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway B', price: 415, currency: 'USD', market: 'us', type: 'stock' },
]

export const MOCK_US_ETFS: MockStock[] = [
  { symbol: 'VTI', name: 'Vanguard Total Stock Market', price: 235, currency: 'USD', market: 'us', type: 'etf', bondRatio: 0 },
  { symbol: 'VOO', name: 'Vanguard S&P 500', price: 495, currency: 'USD', market: 'us', type: 'etf', bondRatio: 0 },
  { symbol: 'QQQ', name: 'Invesco QQQ (Nasdaq 100)', price: 445, currency: 'USD', market: 'us', type: 'etf', bondRatio: 0 },
  { symbol: 'BND', name: 'Vanguard Total Bond Market', price: 73, currency: 'USD', market: 'us', type: 'etf', bondRatio: 100 },
  { symbol: 'AGG', name: 'iShares Core US Aggregate Bond', price: 95, currency: 'USD', market: 'us', type: 'etf', bondRatio: 100 },
  { symbol: 'TLT', name: 'iShares 20+ Year Treasury', price: 92, currency: 'USD', market: 'us', type: 'etf', bondRatio: 100 },
]

export const MOCK_FUNDS: MockStock[] = [
  { symbol: 'F001', name: '聯博-全球高收益債券基金', price: 12.5, currency: 'USD', market: 'tw', type: 'fund', bondRatio: 90 },
  { symbol: 'F002', name: '富蘭克林坦伯頓全球債券基金', price: 8.2, currency: 'USD', market: 'tw', type: 'fund', bondRatio: 95 },
  { symbol: 'F003', name: '施羅德環球股票收益基金', price: 25.8, currency: 'USD', market: 'tw', type: 'fund', bondRatio: 10 },
  { symbol: 'F004', name: '摩根新興市場股票基金', price: 18.5, currency: 'USD', market: 'tw', type: 'fund', bondRatio: 5 },
  { symbol: 'F005', name: '安聯收益成長基金', price: 15.2, currency: 'USD', market: 'tw', type: 'fund', bondRatio: 45 },
  { symbol: 'F006', name: '元大台灣高股息基金', price: 32.5, currency: 'TWD', market: 'tw', type: 'fund', bondRatio: 0 },
  { symbol: 'F007', name: '國泰全球不動產基金', price: 28.8, currency: 'TWD', market: 'tw', type: 'fund', bondRatio: 15 },
]

export const ALL_SECURITIES = [
  ...MOCK_TW_STOCKS,
  ...MOCK_TW_ETFS,
  ...MOCK_US_STOCKS,
  ...MOCK_US_ETFS,
  ...MOCK_FUNDS,
]

export function searchSecurities(query: string, type?: 'stock' | 'etf' | 'fund', market?: 'tw' | 'us'): MockStock[] {
  if (!query || query.length < 1) return []
  const q = query.toLowerCase()
  return ALL_SECURITIES.filter(s => {
    if (type && s.type !== type) return false
    if (market && s.market !== market) return false
    return s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
  }).slice(0, 8)
}
