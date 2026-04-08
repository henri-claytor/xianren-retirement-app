import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TrendingUp } from 'lucide-react-native'
import { PageHeader } from '../src/components/Layout'

export default function S2Screen() {
  return (
    <SafeAreaView className="flex-1 bg-xianren-bg">
      <PageHeader title="S2 退休試算" subtitle="退休資產推估" icon={TrendingUp} />
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-xianren-text-muted text-sm text-center">S2 退休試算（實作中）</Text>
      </View>
    </SafeAreaView>
  )
}
