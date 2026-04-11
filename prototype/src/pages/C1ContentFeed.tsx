import { useState } from 'react'
import { BookOpen, Eye, Clock } from 'lucide-react'
import { PageHeader, Card } from '../components/Layout'

const CATEGORIES = ['全部', '退休知識', '稅務規劃', '投資入門', '生活規劃']

const ARTICLES = [
  {
    id: 1, category: '退休知識', isVip: false,
    title: '退休後第一年：三桶金策略如何讓你睡得安穩',
    desc: '退休第一年是心理調適最難的時期，資產配置策略決定你是否能安心度過這個關鍵期。',
    date: '04/07', views: 787, readMins: 5,
    color: 'from-blue-600 to-blue-800',
  },
  {
    id: 2, category: '稅務規劃', isVip: true,
    title: '【稅務規劃】勞退自提節稅完整攻略，年省 6 萬起跳',
    desc: '勞退自提最高可抵扣 6% 薪資所得，搭配 IRA 帳戶規劃，退休前稅務優化不可忽視。',
    date: '04/05', views: 626, readMins: 8,
    color: 'from-amber-600 to-orange-700',
  },
  {
    id: 3, category: '投資入門', isVip: false,
    title: '4% 提領率是神話還是準則？用數據重新審視',
    desc: '1994 年的 Trinity Study 提出 4% 法則至今已 30 年，市場環境已變，這個數字還適用嗎？',
    date: '04/03', views: 572, readMins: 6,
    color: 'from-green-700 to-teal-800',
  },
  {
    id: 4, category: '退休知識', isVip: true,
    title: '【VIP】Monte Carlo 模擬：你的退休計畫通過壓力測試了嗎',
    desc: '用 1000 次隨機模擬驗證你的退休計畫，找出破產機率超過 10% 的危險情境。',
    date: '04/01', views: 413, readMins: 10,
    color: 'from-purple-700 to-indigo-800',
  },
  {
    id: 5, category: '生活規劃', isVip: false,
    title: '退休後的時間比你想像中多 8 倍：如何避免意義感流失',
    desc: '退休後每週多出 40 小時自由時間，如何填滿而不感到空虛是比財務更重要的課題。',
    date: '03/28', views: 335, readMins: 4,
    color: 'from-rose-700 to-pink-800',
  },
  {
    id: 6, category: '稅務規劃', isVip: false,
    title: '房屋出租收入如何報稅？退休族必知的 5 個節稅眉角',
    desc: '退休後靠租金補貼生活費是常見選擇，但報稅細節處理不好可能繳冤枉稅。',
    date: '03/25', views: 310, readMins: 5,
    color: 'from-sky-600 to-cyan-800',
  },
]

export default function C1ContentFeed() {
  const [activeCategory, setActiveCategory] = useState('全部')

  const filtered = activeCategory === '全部'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === activeCategory)

  return (
    <div>
      <PageHeader title="退休知識" subtitle="文章與影音內容精選" icon={BookOpen} />

      {/* 分類 Tab */}
      <div className="sticky top-0 z-10 bg-[#0F0F0F] border-b border-[#2A2A2A]">
        <div className="flex overflow-x-auto scrollbar-none px-4 py-2 gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#252525] text-[#A0A0A0] hover:text-white'
              }`}
              style={{ fontSize: '11px' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 文章列表 */}
      <div className="px-4 py-3 space-y-3">
        {filtered.map(article => (
          <Card key={article.id} className="overflow-hidden">
            <div className="flex gap-3 p-3">
              {/* 縮圖 */}
              <div className={`shrink-0 w-20 h-16 rounded-xl bg-gradient-to-br ${article.color} flex items-center justify-center relative overflow-hidden`}>
                {article.isVip && (
                  <span className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-bold px-1 py-0.5 rounded">VIP</span>
                )}
                <BookOpen size={20} className="text-white/50" />
              </div>

              {/* 內容 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2A2A2A] text-[#A0A0A0]">{article.category}</span>
                </div>
                <p className="text-white font-medium leading-snug mb-1.5 line-clamp-2" style={{ fontSize: '12px' }}>
                  {article.title}
                </p>
                <div className="flex items-center gap-3 text-[#505050]" style={{ fontSize: '10px' }}>
                  <span className="flex items-center gap-1"><Clock size={10} />{article.date}</span>
                  <span className="flex items-center gap-1"><Eye size={10} />{article.views}</span>
                  <span>{article.readMins} 分鐘</span>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center text-[#505050] py-12" style={{ fontSize: '13px' }}>
            此分類暫無文章
          </div>
        )}

        <div className="bg-blue-900/20 rounded-xl p-3 text-blue-300 text-center" style={{ fontSize: '11px' }}>
          📌 更多內容持續更新中，VIP 文章需訂閱解鎖
        </div>
      </div>
    </div>
  )
}
