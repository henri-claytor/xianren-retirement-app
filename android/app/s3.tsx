import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Target } from 'lucide-react-native'
import { PageHeader } from '../src/components/Layout'

export default function S3Screen() {
  return (
    <SafeAreaView className="flex-1 bg-xianren-bg">
      <PageHeader title="S3 目標設定" subtitle="退休目標規劃" icon={Target} />
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-xianren-text-muted text-sm text-center">S3 目標設定（實作中）</Text>
      </View>
    </SafeAreaView>
  )
}
