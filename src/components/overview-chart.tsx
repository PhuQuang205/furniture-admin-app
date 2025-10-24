"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ✅ Định nghĩa kiểu dữ liệu dựa theo API
export interface StatsItem {
  label: string; // ví dụ: "2025-10"
  revenue: number; // doanh thu
  orderCount: number; // số đơn hàng
}

interface OverviewChartProps {
  stats?: StatsItem[]; // dữ liệu truyền vào từ API
}

export function OverviewChart({ stats = [] }: OverviewChartProps) {
  // Chuyển dữ liệu từ API sang dạng phù hợp với biểu đồ
  const chartData = stats.map((item) => ({
    tháng: item.label,
    doanhThu: item.revenue,
    đơnHàng: item.orderCount,
  }));

  return (
    <Card className="border-2 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>Tổng quan</CardTitle>        
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorDoanhThu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDonHang" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="tháng" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                formatter={(value, name) => {
                  if (name === "doanhThu") return [`${value.toLocaleString()} ₫`, "Doanh thu"];
                  if (name === "đơnHàng") return [value, "Đơn hàng"];
                  return [value, name];
                }}
              />
              <Legend
                formatter={(value) => {
                  if (value === "doanhThu") return "Doanh thu";
                  if (value === "đơnHàng") return "Số đơn hàng";
                  return value;
                }}
              />

              <Area
                type="monotone"
                dataKey="doanhThu"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorDoanhThu)"
              />
              <Area
                type="monotone"
                dataKey="đơnHàng"
                stroke="#06b6d4"
                fillOpacity={1}
                fill="url(#colorDonHang)"
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
