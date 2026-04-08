import { ScrollView, View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LayoutDashboard } from 'lucide-react-native'
import { PageHeader, StatCard, fmtTWD } from '../src/components/Layout'
import { useStore, calcSummary } from '../src/store/useStore'

export default function DashboardScreen() {
  const { data } = useStore()
  const s = calcSummary(data)

  return (
    <SafeAreaView className="flex-1 bg-xianren-bg">
      <PageHeader
        title="嫺人退休規劃"
        subtitle="財務現況總覽"
        icon={LayoutDashboard}
      />
      <ScrollView className="flex-1 px-4 py-3">
        <View className="flex-row flex-wrap gap-1.5 mb-4">
          <StatCard label="月收入合計" value={fmtTWD(s.monthlyIncome, true)} color="blue" />
          <StatCard label="月支出合計" value={fmtTWD(s.monthlyExpense, true)} color="amber" />
        </View>
        <View className="flex-row flex-wrap gap-1.5 mb-4">
          <StatCard label="可投資資產" value={fmtTWD(s.investableAssets, true)} color="purple" />
          <StatCard
            label="月結餘"
            value={fmtTWD(s.monthlySurplus, true)}
            sub={`儲蓄率 ${s.savingsRate.toFixed(0)}%`}
            color={s.monthlySurplus >= 0 ? 'green' : 'red'}
          />
        </View>

        {/* 三桶金摘要 */}
        <View className="bg-xianren-surface2 border border-xianren-border rounded-xl p-3 mb-4">
          <Text className="text-xianren-text-secondary font-semibold text-xs mb-3">三桶金分布</Text>
          <View className="flex-row gap-1.5">
            <StatCard label="短期桶" value={fmtTWD(s.shortBucket, true)} color="blue" />
            <StatCard label="中期桶" value={fmtTWD(s.midBucket, true)} color="purple" />
            <StatCard label="長期桶" value={fmtTWD(s.longBucket, true)} color="amber" />
          </View>
        </View>

        <View className="bg-xianren-surface2 border border-xianren-border rounded-xl p-3">
          <Text className="text-xianren-text-muted text-xs text-center">
            使用「規劃」頁面輸入財務資料
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
