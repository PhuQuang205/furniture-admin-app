"use client";

import React, { useEffect } from "react";
import { useOrders } from "@/hook/useOrder";
import { OrderTable } from "./OrderTable";
import { Loader2 } from "lucide-react";

export const OrderManagement = () => {
	const { orders, loading, fetchAllOrders } = useOrders();

	useEffect(() => {
		fetchAllOrders();
	}, [fetchAllOrders]);

	return (
		<div>
			<h1 className="text-lg font-semibold mb-4">Quản lý đơn hàng</h1>

			{loading ? (
				<div className="flex items-center justify-center py-10">
					<Loader2 className="animate-spin w-6 h-6 text-gray-500" />
					<span className="ml-2 text-gray-500">Đang tải dữ liệu...</span>
				</div>
			) : (
				<OrderTable orders={orders} loading={loading} />
			)}
		</div>
	);
};
