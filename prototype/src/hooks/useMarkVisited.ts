import { useEffect } from 'react'
import { useStore } from '../store/useStore'

/**
 * 工具頁載入時記錄到 visitedTools，餵 NextActions 規則使用。
 * 重複進入不會重複寫入（store 內部去重）。
 */
export function useMarkVisited(toolId: string) {
  const { markToolVisited } = useStore()
  useEffect(() => {
    markToolVisited(toolId)
    // markToolVisited 只在 mount 時觸發一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolId])
}
