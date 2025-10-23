"use client";

import { OverviewChart } from "./overview-chart";
import { SalesByCategoryChart } from "./sales-by-category-chart";
import { NewAccountsTable } from "./new-accounts-table";
import { RecentTransactionsTable } from "./recent-transactions-table";
import { RecentOrdersTable } from "./recent-orders-table";
import { useDashboard } from "@/hook/useDashBoard";
import { MetricCardList } from "@/components/metric-list";

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
	} = useDashboard();
	console.log(ordersByCategory);
	return (
		<div className="space-y-8">
			<MetricCardList totalSumary={totalSumary} />
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<OverviewChart />
				</div>
				<div>
					<SalesByCategoryChart ordersByCategory={ordersByCategory} />
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{newCustomers && <NewAccountsTable newCustomers={newCustomers} />}
				<RecentTransactionsTable bestSellingProducts={bestSellingProducts} />
			</div>

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
