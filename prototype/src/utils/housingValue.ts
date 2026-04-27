/**
 * 房屋市值顯示用（純展示，不影響任何計算）
 *
 * 自住與出租房屋在資產負債表上的顯示隨通膨逐年調整，但此調整不得回饋到：
 *   - A1 達成率、最早退休年齡
 *   - A2 Monte Carlo 壓力測試
 *   - B1–B4 提領計畫
 *   - stableCoverage 穩定現金流覆蓋率
 * 所有計算仍使用 FinanceData 內的原始 realEstateSelfUse / realEstateRental。
 */

export function housingValueAtAge(
  age: number,
  baseValue: number,
  inflationRatePct: number,
  currentAge: number,
): number {
  const years = Math.max(0, age - currentAge)
  return baseValue * Math.pow(1 + inflationRatePct / 100, years)
}
