"use client";

import {
	dashboardService,
	Order,
	BestSellingProduct,
	OrderByCategory,
	DashboardStatsItem,
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
	const [stats, setStats] = useState<DashboardStatsItem[]>();
	const [ordersByCategory, setOrdersByCategory] = useState<OrderByCategory[]>(
		[]
	);
	const [customRange, setCustomRange] = useState<{
		startDate?: string;
		endDate?: string;
	}>({});
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [size] = useState(10);
	const [page, setPage] = useState(0);
	const [totalPage, setTotalPage] = useState(0);
	const [totalElements, setTotalElements] = useState(0);
	const [periodd] = useState("THIS_MONTH");
	const [period, setPeriod] = useState("THIS_MONTH");

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
				const res = await dashboardService.getRecentOrders(
					pageParam,
					sizeParam
				);
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
			const res = await dashboardService.getOrderByCategory(periodd);
			setOrdersByCategory(res);
		} catch (error) {
			console.error("Failed to fetch orders by category:", error);
		}
	}, [periodd]);

	// 🟪 Thống kê tổng hợp (đa dạng endpoint)
	const getStats = useCallback(async () => {
		try {
			let res;

			// 🧩 1️⃣ Nếu có chọn ngày cụ thể → /stats/by-day
			if (selectedDate) {
				res = await dashboardService.getStatsByDay(selectedDate);
			}
			// 🧩 2️⃣ Nếu có chọn custom range → /stats/custom-range
			else if (customRange.startDate && customRange.endDate) {
				res = await dashboardService.getStatsByCustomRange(
					customRange.startDate,
					customRange.endDate
				);
			}
			// 🧩 3️⃣ Mặc định → /dashboard/stats?period=...
			else {
				res = await dashboardService.getStats({period});
			}

			setStats(res);
		} catch (error) {
			console.error("Failed to fetch dashboard stats:", error);
			setStats([]); // tránh lỗi khi render
		}
	}, [period, selectedDate, customRange]);

	useEffect(() => {
		getTotalSumary();
		getListNewCustomer();
		getListRecentOrders(page, size);
		getBestSellingProducts();
		getOrdersByCategory();
		getStats();
	}, [
		getTotalSumary,
		getListNewCustomer,
		getListRecentOrders,
		getBestSellingProducts,
		getOrdersByCategory,
		getStats,
		page,
		size,
	]);

	return {
		size,
		page,
		totalPage,
		totalElements,
		totalSumary,
		recentOrder,
		newCustomers,
		bestSellingProducts,
		ordersByCategory,
		loading,
		error,
		stats,

		getTotalSumary,
		getListNewCustomer,
		getListRecentOrders,
		getBestSellingProducts,
		getOrdersByCategory,
		getStats,

		setPage,
		setCustomRange,
		setSelectedDate,
		setPeriod,
		refresh: getListRecentOrders,
	};
};
