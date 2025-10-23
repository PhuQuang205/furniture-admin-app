"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", revenue: 4000, orders: 2400 },
  { month: "Feb", revenue: 3000, orders: 1398 },
  { month: "Mar", revenue: 2000, orders: 9800 },
  { month: "Apr", revenue: 2780, orders: 3908 },
  { month: "May", revenue: 1890, orders: 4800 },
  { month: "Jun", revenue: 2390, orders: 3800 },
  { month: "Jul", revenue: 3490, orders: 4300 },
  { month: "Aug", revenue: 2100, orders: 2400 },
  { month: "Sep", revenue: 2780, orders: 3908 },
  { month: "Oct", revenue: 3890, orders: 4800 },
  { month: "Nov", revenue: 4490, orders: 5300 },
  { month: "Dec", revenue: 5200, orders: 6100 },
]

export function OverviewChart() {
  return (
    <Card className="border-2 h-[500px] shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>Overview</CardTitle>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs rounded hover:bg-muted">ALL</button>
          <button className="px-3 py-1 text-xs rounded hover:bg-muted">1M</button>
          <button className="px-3 py-1 text-xs rounded hover:bg-muted">6M</button>
          <button className="px-3 py-1 text-xs rounded bg-primary text-primary-foreground">1Y</button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#06b6d4"
                fillOpacity={1}
                fill="url(#colorOrders)"
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
