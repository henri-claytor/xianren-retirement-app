import { useState } from 'react'
import { Users, ThumbsUp, MessageCircle } from 'lucide-react'
import { PageHeader, Card } from '../components/Layout'

interface Post {
  id: number
  author: string
  authorInitial: string
  authorColor: string
  time: string
  content: string
  likes: number
  comments: number
  image?: string
}

const POSTS: Post[] = [
  {
    id: 1,
    author: '王大明', authorInitial: '王', authorColor: 'bg-blue-600',
    time: '4天前',
    content: '【退休第一年心得】終於在 58 歲提早退休了！最大的感悟是：退休前最怕沒錢，退休後最怕沒事做。三桶金策略幫我解決了財務焦慮，但時間管理才是真正的挑戰。建議大家退休前先想好每週的「必做清單」，不然真的很容易陷入空虛感。我目前的安排是：每週固定兩天義工、一天學語言、兩天陪孫子，剩下時間才是真正的自由時間。',
    likes: 72, comments: 18,
  },
  {
    id: 2,
    author: '李淑惠', authorInitial: '李', authorColor: 'bg-purple-600',
    time: '2天前',
    content: '請問大家勞保老年年金是選擇「月退」還是「一次領」比較划算？我今年 63 歲，健康狀況還好，但一次領感覺比較安全... 算了一下如果活到 85 歲月退比較多，但誰知道能活多久呢😅 想聽聽大家的經驗分享。',
    likes: 45, comments: 31,
  },
  {
    id: 3,
    author: '陳建國', authorInitial: '陳', authorColor: 'bg-green-700',
    time: '1週前',
    content: '分享一個真實案例：我朋友 60 歲退休，退休金 1200 萬，覺得很夠用。結果夫妻倆三年內：出國旅遊花了 150 萬、幫兒子買房出了 300 萬、醫療費用 80 萬。三年就花掉 530 萬，突然發現錢不夠用了。提醒大家退休規劃一定要把這些「大額支出」也算進去，不只是日常生活費！',
    likes: 118, comments: 42,
  },
  {
    id: 4,
    author: '張美玲', authorInitial: '張', authorColor: 'bg-rose-600',
    time: '3天前',
    content: '今天去銀行詢問了投資型保單，理專說可以幫我「規劃退休」，但我越聽越不對勁。手續費 3%、每年管理費 1.5%，說什麼「長期報酬穩定」。大家要小心這類產品，費用吃掉的報酬非常可觀。我後來直接買 0050 和美債 ETF，省下的費用 20 年後差距非常大！',
    likes: 203, comments: 67,
  },
  {
    id: 5,
    author: '林志遠', authorInitial: '林', authorColor: 'bg-amber-600',
    time: '5天前',
    content: '推薦一個退休後的好去處：社區大學！學費便宜（一學期幾百元）、課程多元、還能交到同齡朋友。我去年開始學水彩和太極拳，不只豐富了生活，還認識了一群退休好友，每週固定聚會。退休不是終點，是新生活的開始！',
    likes: 89, comments: 24,
  },
]

function PostCard({ post }: { post: Post }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = post.content.length > 80

  return (
    <Card className="p-3">
      {/* 作者資訊 */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-full ${post.authorColor} flex items-center justify-center shrink-0`}>
          <span className="text-white font-bold text-xs">{post.authorInitial}</span>
        </div>
        <div>
          <p className="text-main font-semibold" style={{ fontSize: '12px' }}>{post.author}</p>
          <p className="text-faint" style={{ fontSize: '10px' }}>{post.time}</p>
        </div>
      </div>

      {/* 內文 */}
      <p className="text-main leading-relaxed mb-2" style={{ fontSize: '12px' }}>
        {isLong && !expanded ? post.content.slice(0, 80) + '...' : post.content}
        {isLong && !expanded && (
          <button
            className="text-blue-600 ml-1 font-medium"
            onClick={() => setExpanded(true)}
            style={{ fontSize: '12px' }}
          >
            繼續閱讀
          </button>
        )}
      </p>

      {/* 互動計數 */}
      <div className="flex items-center gap-4 pt-2 border-t border-base">
        <span className="flex items-center gap-1 text-faint" style={{ fontSize: '11px' }}>
          <ThumbsUp size={12} /> {post.likes}
        </span>
        <span className="flex items-center gap-1 text-faint" style={{ fontSize: '11px' }}>
          <MessageCircle size={12} /> {post.comments}
        </span>
      </div>
    </Card>
  )
}

export default function C2CommunityFeed() {
  return (
    <div>
      <PageHeader title="退休社團" subtitle="同齡族群交流退休心得" icon={Users} />

      <div className="px-4 py-3 space-y-3">
        {/* 社團公告 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <p className="font-semibold text-blue-700 mb-1" style={{ fontSize: '12px' }}>📢 社團公告</p>
          <p className="text-blue-600/80" style={{ fontSize: '11px' }}>
            歡迎分享退休規劃心得、提問財務問題、交流生活經驗。本社團為模擬展示，內容僅供參考。
          </p>
        </div>

        {POSTS.map(post => (
          <PostCard key={post.id} post={post} />
        ))}

        <div className="text-center text-faint py-4" style={{ fontSize: '11px' }}>
          — 以上為示範貼文 —
        </div>
      </div>
    </div>
  )
}
