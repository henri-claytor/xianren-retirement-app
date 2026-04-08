import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BarChart3 } from 'lucide-react-native'
import { PageHeader } from '../src/components/Layout'

export default function B1Screen() {
  return (
    <SafeAreaView className="flex-1 bg-xianren-bg">
      <PageHeader title="B1 三桶金總覽" subtitle="資產配置分析" icon={BarChart3} />
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-xianren-text-muted text-sm text-center">B1 三桶金總覽（實作中）</Text>
      </View>
    </SafeAreaView>
  )
}
