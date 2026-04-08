export interface FinancialSnapshot {
  // 基本資料
  name: string
  currentAge: number
  retirementAge: number
  expectedLifespan: number

  // 資產（手動輸入）
  cash: number            // 現金/活存
  fixedDeposit: number    // 定存
  savingsInsurance: number // 儲蓄險現值
  realEstateSelfUse: number // 不動產自住市值
  realEstateRental: number  // 不動產出租市值
  otherAssets: number      // 其他資產

  // 股票/ETF/基金持倉（簡化）
  stocks: StockHolding[]
  etfs: ETFHolding[]
  funds: FundHolding[]

  // 月收入
  salary: number
  salaryGrowthRate: number // %
  rentalIncome: number
  sideIncome: number
  laborPension: number       // 勞保月退（退休後）
  laborRetirementFund: number // 勞退月退（退休後）

  // 月支出（嫺人三分類）
  essentialExpenses: ExpenseItem[]   // 生活必需
  lifestyleExpenses: ExpenseItem[]   // 生活風格（≤30%）
  transitionalExpenses: TransitionalExpense[] // 階段性支出

  // 負債
  liabilities: Liability[]

  // 計算設定
  inflationRate: number     // 通膨率 % (預設 2)
  investmentReturn: number  // 投資報酬率 % (預設 5)

  // 手動歸桶覆蓋
  bucketOverrides?: Record<string, 'short' | 'mid' | 'long'>
}

export interface StockHolding {
  id: string
  market: 'tw' | 'us'
  symbol: string
  name: string
  shares: number
  currentPrice: number   // 手動輸入（prototype）
  currency: 'TWD' | 'USD'
  costPrice: number
}

export interface ETFHolding {
  id: string
  market: 'tw' | 'us'
  symbol: string
  name: string
  shares: number
  currentPrice: number
  currency: 'TWD' | 'USD'
  costPrice: number
  bondRatio: number  // 債券比例 %（手動輸入）
  bondRatioMissing?: boolean  // 債券比例待補
}

export interface FundHolding {
  id: string
  fundCode: string
  name: string
  units: number
  nav: number          // 淨值
  currency: 'TWD' | 'USD'
  costNav: number
  bondRatio: number    // 債券比例 %
  bondRatioMissing?: boolean  // 債券比例待補
}

export interface ExpenseItem {
  id: string
  name: string
  amount: number
}

export interface TransitionalExpense {
  id: string
  name: string
  amount: number
  startAge: number
  endAge: number
}

export interface Liability {
  id: string
  name: string
  monthlyPayment: number
  remainingMonths: number
}

export interface Snapshot {
  id: string
  date: string
  label: string
  data: FinancialSnapshot
  totalAssets: number
  investableAssets: number
  shortBucket: number
  midBucket: number
  longBucket: number
}

export type BucketType = 'short' | 'mid' | 'long' | 'self-use'

export interface BucketItem {
  id: string
  name: string
  symbol?: string
  value: number
  bucket: BucketType
  bucketOverride?: BucketType
  bucketReason: string
  needsReview?: boolean
}
