import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Users } from 'lucide-react-native'
import { PageHeader } from '../src/components/Layout'

export default function C2Screen() {
  return (
    <SafeAreaView className="flex-1 bg-xianren-bg">
      <PageHeader title="C2 社群" subtitle="退休族交流社群" icon={Users} />
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-xianren-text-muted text-sm text-center">C2 社群（實作中）</Text>
      </View>
    </SafeAreaView>
  )
}
