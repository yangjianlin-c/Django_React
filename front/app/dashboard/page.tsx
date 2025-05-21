'use client'

import { withAuth } from '@/lib/withAuth'

function Dashboard() {
    return <div className="p-6 text-xl">欢迎进入仪表盘</div>
}

export default withAuth(Dashboard)
