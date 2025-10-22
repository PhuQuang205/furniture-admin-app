"use client";

import { useState, useCallback } from "react";
import {
	orderService,
	OrderResponse,
	OrderStatusRequest,
} from "@/lib/services/orderService";

export const useOrders = () => {
	const [orders, setOrders] = useState<OrderResponse[]>([]);
	const [selectedOrder, setSelectedOrder] = useState<OrderResponse>();
	const [loading, setLoading] = useState(false);

	// 🟢 Lấy danh sách đơn hàng có phân trang
	const fetchOrders = useCallback(async (page: number = 0, size: number = 10) => {
		try {
			setLoading(true);
			const res = await orderService.getAll(page, size);
			setOrders(res.data);
		} catch (error) {
			console.error("❌ Failed to fetch orders:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	// 🟢 Lấy toàn bộ danh sách đơn hàng (không phân trang)
	const fetchAllOrders = useCallback(async () => {
		try {
			setLoading(true);
			const res = await orderService.getAllOrders();
			setOrders(res);
		} catch (error) {
			console.error("❌ Failed to fetch all orders:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	// 🟢 Lấy chi tiết 1 đơn hàng
	const fetchOrderById = useCallback(async (id: number) => {
		try {
			setLoading(true);
			const order = await orderService.getById(id);
			setSelectedOrder(order);
		} catch (error) {
			console.error("❌ Failed to fetch order detail:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	// 🟡 Cập nhật trạng thái đơn hàng
	const updateOrderStatus = useCallback(
		async (id: number, data: OrderStatusRequest) => {
			try {
				setLoading(true);
				await orderService.updateStatus(id, data);
				console.log("✅ Cập nhật trạng thái đơn hàng thành công!");
				// Cập nhật lại danh sách nếu cần
				await fetchOrders();
			} catch (error) {
				console.error("❌ Failed to update order status:", error);
			} finally {
				setLoading(false);
			}
		},
		[fetchOrders]
	);

	// 🟢 Chấp nhận hoàn đơn
	const approveReturn = useCallback(async (id: number) => {
		try {
			setLoading(true);
			await orderService.approveReturn(id);
			console.log("✅ Đã chấp nhận hoàn đơn!");
			await fetchOrders();
		} catch (error) {
			console.error("❌ Failed to approve return:", error);
		} finally {
			setLoading(false);
		}
	}, [fetchOrders]);

	// 🔴 Từ chối hoàn đơn
	const rejectReturn = useCallback(async (id: number) => {
		try {
			setLoading(true);
			await orderService.rejectReturn(id);
			console.log("✅ Đã từ chối hoàn đơn!");
			await fetchOrders();
		} catch (error) {
			console.error("❌ Failed to reject return:", error);
		} finally {
			setLoading(false);
		}
	}, [fetchOrders]);

	return {
		orders,
		selectedOrder,
		loading,
		fetchOrders,
		fetchAllOrders,
		fetchOrderById,
		updateOrderStatus,
		approveReturn,
		rejectReturn,
	};
};
