"use client";

import { OverviewChart } from "./overview-chart";
import { SalesByCategoryChart } from "./sales-by-category-chart";
import { NewAccountsTable } from "./new-accounts-table";
import { RecentTransactionsTable } from "./recent-transactions-table";
import { RecentOrdersTable } from "./recent-orders-table";
import { useDashboard } from "@/hook/useDashBoard";
import { MetricCardList } from "@/components/metric-list";
import { DateRangePicker } from "@/components/DateRangePicker";
import { EmitParams } from "@/components/DateRangePicker";

export function Dashboard() {
	const {
		totalSumary,
		newCustomers,
		recentOrder,
		size,
		page,
		totalElements,
		totalPage,
		refresh,
		bestSellingProducts,
		ordersByCategory,
		setPage,
		getStats,
		setPeriod,
		setCustomRange,
		stats,
	} = useDashboard();

	// 🟪 Xử lý khi thay đổi bộ lọc thời gian
	const handleOnchange = async (params: EmitParams) => {
		console.log(params)
		try {
			// 🧭 Trường hợp chọn preset (THIS_WEEK, THIS_MONTH, ...)
			if (params.period) {
				setPeriod(params.period);
				setCustomRange({}); // reset custom range
				await getStats();
				console.log("📅 Lọc theo preset:", params.period);
			}
			// 🧭 Trường hợp chọn custom range (yyyy/mm/dd ~ yyyy/mm/dd)
			else if (params.startDate && params.endDate) {
				setPeriod(""); // reset period
				setCustomRange({
					startDate: params.startDate,
					endDate: params.endDate,
				});
				await getStats();
				console.log(
					`📅 Lọc theo khoảng: ${params.startDate} → ${params.endDate}`
				);
			}
		} catch (err) {
			console.error("❌ Lỗi khi thay đổi bộ lọc thời gian:", err);
		}
	};

	console.log("📊 Stats:", stats);

	return (
		<div className="space-y-8">
			{/* 🟦 Tổng quan */}
			<MetricCardList totalSumary={totalSumary} />

			{/* 🟩 Bộ lọc thời gian */}
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-semibold">Biểu đồ thống kê</h1>
				<DateRangePicker onChange={handleOnchange} />
			</div>

			{/* 🟨 Biểu đồ */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
				<div className="lg:col-span-2">
					<OverviewChart stats={stats} />
				</div>
				<div>
					<SalesByCategoryChart ordersByCategory={ordersByCategory} />
				</div>
			</div>

			{/* 🟥 Bảng thông tin */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{newCustomers && <NewAccountsTable newCustomers={newCustomers} />}
				<RecentTransactionsTable bestSellingProducts={bestSellingProducts} />
			</div>

			{/* 🟧 Đơn hàng gần đây */}
			{recentOrder && (
				<RecentOrdersTable
					recentOrders={recentOrder}
					page={Number(page)}
					size={size}
					totalElements={Number(totalElements)}
					totalPages={Number(totalPage)}
					setPage={setPage}
					refesh={refresh}
				/>
			)}
		</div>
	);
}
