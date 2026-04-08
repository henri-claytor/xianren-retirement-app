import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Lightbulb } from 'lucide-react-native'
import { PageHeader } from '../src/components/Layout'

export default function B4Screen() {
  return (
    <SafeAreaView className="flex-1 bg-xianren-bg">
      <PageHeader title="B4 退休建議" subtitle="個人化退休策略" icon={Lightbulb} />
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-xianren-text-muted text-sm text-center">B4 退休建議（實作中）</Text>
      </View>
    </SafeAreaView>
  )
}
