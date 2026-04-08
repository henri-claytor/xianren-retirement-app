import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BookOpen } from 'lucide-react-native'
import { PageHeader } from '../src/components/Layout'

export default function C1Screen() {
  return (
    <SafeAreaView className="flex-1 bg-xianren-bg">
      <PageHeader title="C1 內容頻道" subtitle="退休知識與文章" icon={BookOpen} />
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-xianren-text-muted text-sm text-center">C1 內容頻道（實作中）</Text>
      </View>
    </SafeAreaView>
  )
}
