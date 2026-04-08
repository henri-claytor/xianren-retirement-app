import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DollarSign } from 'lucide-react-native'
import { PageHeader } from '../src/components/Layout'

export default function S1Screen() {
  return (
    <SafeAreaView className="flex-1 bg-xianren-bg">
      <PageHeader
        title="S1 財務現況輸入"
        subtitle="建立你的財務基準"
        icon={DollarSign}
      />
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-xianren-text-muted text-sm text-center">
          S1 財務輸入頁面{'\n'}（實作中）
        </Text>
      </View>
    </SafeAreaView>
  )
}
