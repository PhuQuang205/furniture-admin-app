"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#f59e0b", "#ec4899"];

interface OrderByCategory {
  categoryName: string;
  orderCount: number;
  percentage: number;
}

interface SalesByCategoryChartProps {
  ordersByCategory: OrderByCategory[];
}

export function SalesByCategoryChart({ ordersByCategory }: SalesByCategoryChartProps) {
  if (!ordersByCategory || ordersByCategory.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Sales By Category</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const data = ordersByCategory.map((item) => ({
    name: item.categoryName,
    value: item.orderCount,
    percentage: item.percentage,
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>📊 Sales By Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, _, entry) =>
                  [`${value} orders (${entry.payload.percentage}%)`, entry.name]
                }
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tổng số đơn hàng */}
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">Tổng số đơn hàng</p>
          <p className="text-2xl font-bold">{total}</p>
        </div>

        {/* Legend */}
        <div className="mt-6 space-y-2">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{item.name}</span>
              </div>
              <span className="font-medium">
                {item.value} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
