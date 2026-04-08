import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PieChart } from 'lucide-react-native'
import { PageHeader } from '../src/components/Layout'

export default function B2Screen() {
  return (
    <SafeAreaView className="flex-1 bg-xianren-bg">
      <PageHeader title="B2 三桶金明細" subtitle="各桶資產明細" icon={PieChart} />
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-xianren-text-muted text-sm text-center">B2 三桶金明細（實作中）</Text>
      </View>
    </SafeAreaView>
  )
}
