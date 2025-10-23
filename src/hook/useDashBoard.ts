"use client";

import {
	dashboardService,
	Order,
	BestSellingProduct,
	OrderByCategory,
} from "@/lib/services/dashboardService";
import { useCallback, useEffect, useState } from "react";
import { DashboardSummary, NewCustomer } from "@/lib/services/dashboardService";

export const useDashboard = () => {
	const [totalSumary, setTotalSumary] = useState<DashboardSummary>();
	const [newCustomers, setNewCustomers] = useState<NewCustomer[]>([]);
	const [recentOrder, setRecentOrder] = useState<Order[]>([]);
	const [bestSellingProducts, setBestSellingProducts] = useState<
		BestSellingProduct[]
	>([]);
	const [ordersByCategory, setOrdersByCategory] = useState<OrderByCategory[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [size] = useState(10);
	const [page, setPage] = useState(0);
	const [totalPage, setTotalPage] = useState(0);
	const [totalElements, setTotalElements] = useState(0);
	const [period] = useState("THIS_MONTH");

	// 🟦 Tổng quan dashboard
	const getTotalSumary = useCallback(async () => {
		try {
			const res = await dashboardService.getSumary();
			setTotalSumary(res);
		} catch (err) {
			console.error("Failed to fetch dashboard summary:", err);
		}
	}, []);

	// 🟩 Danh sách khách hàng mới
	const getListNewCustomer = useCallback(async () => {
		try {
			const res = await dashboardService.getNewCustomers();
			setNewCustomers(res);
		} catch (err) {
			console.error("Failed to fetch new customers:", err);
		}
	}, []);

	// 🟧 Danh sách đơn hàng mới
	const getListRecentOrders = useCallback(
		async (pageParam = page, sizeParam = size) => {
			try {
				const res = await dashboardService.getRecentOrders(pageParam, sizeParam);
				setRecentOrder(res.data);
				setPage(res.page);
				setTotalPage(res.totalPages);
				setTotalElements(res.totalElements);
			} catch (err) {
				console.error("Failed to fetch recent orders:", err);
			}
		},
		[page, size]
	);

	// 🟥 Sản phẩm bán chạy
	const getBestSellingProducts = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await dashboardService.getBestSellingProducts(period);
			setBestSellingProducts(data);
		} catch (err) {
			console.error("Failed to get best selling products:", err);
			setError("Không thể tải danh sách sản phẩm bán chạy 😢");
		} finally {
			setLoading(false);
		}
	}, [period]);

	// 🟪 Đơn hàng theo danh mục
	const getOrdersByCategory = useCallback(async () => {
		try {
			const res = await dashboardService.getOrderByCategory(period);
			setOrdersByCategory(res);
		} catch (error) {
			console.error("Failed to fetch orders by category:", error);
		}
	}, [period]);

	// 🔁 Gọi tất cả API khi load dashboard
	useEffect(() => {
		getTotalSumary();
		getListNewCustomer();
		getListRecentOrders(page, size);
		getBestSellingProducts();
		getOrdersByCategory(); // ✅ bổ sung
	}, [
		getTotalSumary,
		getListNewCustomer,
		getListRecentOrders,
		getBestSellingProducts,
		getOrdersByCategory,
		page,
		size,
	]);

	// ✅ Return đầy đủ để component dùng được tất cả
	return {
		size,
		page,
		totalPage,
		totalElements,
		totalSumary,
		recentOrder,
		newCustomers,
		bestSellingProducts,
		ordersByCategory, // ✅ bổ sung để truyền ra ngoài
		loading,
		error,

		getTotalSumary,
		getListNewCustomer,
		getListRecentOrders,
		getBestSellingProducts,
		getOrdersByCategory, // ✅ bổ sung

		setPage,
		refresh: getListRecentOrders,
	};
};
