import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Activity } from 'lucide-react-native'
import { PageHeader } from '../src/components/Layout'

export default function B3Screen() {
  return (
    <SafeAreaView className="flex-1 bg-xianren-bg">
      <PageHeader title="B3 現金流規劃" subtitle="退休現金流試算" icon={Activity} />
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-xianren-text-muted text-sm text-center">B3 現金流規劃（實作中）</Text>
      </View>
    </SafeAreaView>
  )
}
