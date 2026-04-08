import '../global.css'
import { Tabs } from 'expo-router'
import { LayoutDashboard, ClipboardList, BarChart3, BookOpen, Users } from 'lucide-react-native'

const TAB_BAR_STYLE = {
  backgroundColor: '#0A0A0A',
  borderTopColor: '#2A2A2A',
  borderTopWidth: 1,
  height: 60,
  paddingBottom: 8,
}

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: TAB_BAR_STYLE,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#505050',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首頁',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="s1"
        options={{
          title: '規劃',
          tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="b1"
        options={{
          title: '三桶金',
          tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="c1"
        options={{
          title: '內容',
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="c2"
        options={{
          title: '社群',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
      {/* 非 Tab 頁面：隱藏 tab bar */}
      {['s2', 's3', 'b2', 'b3', 'b4'].map(name => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{ href: null }}
        />
      ))}
    </Tabs>
  )
}
