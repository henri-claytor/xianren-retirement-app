import type { FinancialSnapshot } from './types'

export const DEFAULT_SNAPSHOT: FinancialSnapshot = {
  name: '嫺人',
  currentAge: 0,
  retirementAge: 0,
  expectedLifespan: 90,

  cash: 500000,
  fixedDeposit: 1000000,
  savingsInsurance: 800000,
  realEstateSelfUse: 15000000,
  realEstateRental: 0,
  otherAssets: 0,

  stocks: [
    { id: 's1', market: 'tw', symbol: '2330', name: '台積電', shares: 100, currentPrice: 850, currency: 'TWD', costPrice: 600 },
    { id: 's2', market: 'us', symbol: 'AAPL', name: 'Apple Inc.', shares: 50, currentPrice: 195, currency: 'USD', costPrice: 150 },
  ],
  etfs: [
    { id: 'e1', market: 'tw', symbol: '0050', name: '元大台灣50', shares: 1000, currentPrice: 148, currency: 'TWD', costPrice: 120, bondRatio: 0 },
    { id: 'e2', market: 'tw', symbol: '00679B', name: '元大美債20年', shares: 5000, currentPrice: 35, currency: 'TWD', costPrice: 38, bondRatio: 100 },
  ],
  funds: [
    { id: 'f1', fundCode: 'F001', name: '聯博-全球高收益債券基金', units: 10000, nav: 12.5, currency: 'USD', costNav: 11.0, bondRatio: 90 },
  ],

  salary: 80000,
  salaryGrowthRate: 2,
  rentalIncome: 0,
  sideIncome: 10000,
  laborPension: 15000,
  laborRetirementFund: 8000,

  essentialExpenses: [
    { id: 'e1', name: '房租/房貸', amount: 20000 },
    { id: 'e2', name: '飲食', amount: 15000 },
    { id: 'e3', name: '交通', amount: 5000 },
    { id: 'e4', name: '保險', amount: 8000 },
    { id: 'e5', name: '醫療', amount: 3000 },
  ],
  lifestyleExpenses: [
    { id: 'l1', name: '旅遊', amount: 8000 },
    { id: 'l2', name: '娛樂/餐廳', amount: 5000 },
    { id: 'l3', name: '進修', amount: 3000 },
  ],
  transitionalExpenses: [
    { id: 't1', name: '子女教育費', amount: 15000, startAge: 45, endAge: 60 },
  ],

  liabilities: [
    { id: 'lb1', name: '房貸', monthlyPayment: 20000, remainingMonths: 120 },
  ],

  inflationRate: 2,
  investmentReturn: 5,

  stressTestResult: null,
}
