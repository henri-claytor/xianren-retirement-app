// CH 徽章：標示頁面/區塊對應的嫺人課程章節
// 使用：<CourseBadge ch="CH1" />
// 位置變體：inline（預設，靠文字）/ absolute（右上角絕對定位）

type Chapter = 'CH1' | 'CH2' | 'CH3' | 'CH4' | 'CH5' | 'CH6'

const CH_LABEL: Record<Chapter, string> = {
  CH1: '現在的你，離退休有多遠？',
  CH2: '從現況到缺口：認識你的退休風險',
  CH3: '建立你的投資判斷力',
  CH4: '讓錢穩定流進來：三桶金策略',
  CH5: '退休之外，你還要照顧誰？',
  CH6: '退休不只是「不工作」',
}

// 徽章顯示暫時停用（保留元件與簽章以便日後快速恢復）
// 若要重新顯示章節徽章，移除此 early return 即可
export default function CourseBadge(_: {
  ch: Chapter
  variant?: 'inline' | 'absolute'
  showLabel?: boolean
}) {
  void CH_LABEL
  return null
}
