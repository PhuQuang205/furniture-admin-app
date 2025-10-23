"use client";

import { MetricCard } from "@/components/metric-card";
import {
	ShoppingCart,
	TrendingUp,
	Building2,
	Gift,
	Lightbulb,
} from "lucide-react";
import { DashboardSummary } from "@/lib/services/dashboardService";

interface MetricCardListProps {
	totalSumary?: DashboardSummary;
}

export function MetricCardList({ totalSumary }: MetricCardListProps) {
	const metrics = [
		{
			title: "Tổng số đơn hàng",
			value: totalSumary ? totalSumary.totalOrders : "—",
			icon: ShoppingCart,
			color: "text-blue-500",
		},
		{
			title: "Tổng doanh thu",
			value: totalSumary
				? `${totalSumary.totalRevenue.toLocaleString("vi-VN")} ₫`
				: "—",
			icon: TrendingUp,
			color: "text-green-500",
		},
		{
			title: "Tổng số khách hàng",
			value: totalSumary ? totalSumary.totalCustomers : "—",
			icon: Building2,
			color: "text-purple-500",
		},
		{
			title: "Tổng số sản phẩm",
			value: totalSumary ? totalSumary.totalProducts : "—",
			icon: Gift,
			color: "text-orange-500",
		},
		{
			title: "Đơn hàng đang giao",
			value: totalSumary ? totalSumary.shippingOrders : "—",
			icon: Lightbulb,
			color: "text-yellow-500",
		},
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
			{metrics.map((metric) => (
				<MetricCard
					key={metric.title}
					title={metric.title}
					value={String(metric.value)}
					icon={metric.icon}
					color={metric.color}
				/>
			))}
		</div>
	);
}
