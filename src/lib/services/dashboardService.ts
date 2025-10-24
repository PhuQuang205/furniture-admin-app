import api from "@/lib/axios";

// 🟦 Tổng quan thống kê
export interface DashboardSummary {
	totalOrders: number;
	totalRevenue: number;
	totalCustomers: number;
	totalProducts: number;
	shippingOrders: number;
}

// 🟩 Khách hàng mới
export interface NewCustomer {
	id: number;
	registrationDate: string;
	fullName: string;
	email: string;
	avatarUrl?: string | null;
	verified: boolean;
}

// 🟧 Đơn hàng
export interface Order {
	id: number;
	firstName: string;
	lastName: string;
	provinceName: string;
	wardName: string;
	addressLine: string;
	phoneNumber: string;
	email: string;
	total: string; // vì API trả chuỗi "272000"
	orderTime: string;
	paymentMethod: "ZALOPAY" | "STRIPE" | string;
	paymentStatus: "PENDING" | "PAID" | "FAILED" | string;
	status: "NEW" | "PROCESSING" | "COMPLETED" | "CANCELLED" | string;
}

export interface PaginatedOrdersResponse {
	data: Order[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
}

export interface BestSellingProduct {
	productId: number;
	productName: string;
	mainImageUrl: string;
	totalQuantity: number;
}

export interface OrderByCategory {
	categoryName: string;
	orderCount: number;
	percentage: number;
}

export interface DashboardStatsItem {
	label: string;
	revenue: number;
	orderCount: number;
}

export interface GetStatsParams {
	period?: string;
	startDate?: string;
	endDate?: string;
	date?: string;
}

// 🧩 Dashboard service
export const dashboardService = {
	// Tổng quan hệ thống
	async getSumary(): Promise<DashboardSummary> {
		const res = await api.get("/dashboard/summary");
		return res.data;
	},

	// Thống kê đơn hàng theo danh mục
	async getStatsByCategory(
		period: string = "THIS_MONTH"
	): Promise<OrderByCategory[]> {
		const res = await api.get(`/dashboard/stats/by-category?period=${period}`);
		return res.data;
	},

	// Sản phẩm bán chạy
	async getBestSellingProducts(
		period: string = "THIS_MONTH"
	): Promise<BestSellingProduct[]> {
		const res = await api.get(
			`/dashboard/best-selling-products?period=${period}`
		);
		return res.data;
	},

	// Khách hàng mới đăng ký
	async getNewCustomers(): Promise<NewCustomer[]> {
		const res = await api.get("/dashboard/new-customers");
		return res.data;
	},

	// Danh sách đơn hàng mới nhất
	async getRecentOrders(
		page: number = 0,
		size: number = 10
	): Promise<PaginatedOrdersResponse> {
		const res = await api.get("/orders", {
			params: {
				page,
				size,
				sortField: "orderTime",
				sortDir: "desc",
			},
		});
		return res.data;
	},

	async getStats(params: GetStatsParams = {}) {
		try {
			// 1️⃣ Ưu tiên gọi theo loại params hợp lệ
			if (params.period) {
				// ===== /dashboard/stats?period=THIS_YEAR =====
				const res = await api.get("/dashboard/stats", {
					params: { period: params.period },
				});
				return res.data;
			}

			if (params.startDate && params.endDate) {
				// ===== /dashboard/stats/custom-range?startDate=...&endDate=... =====
				const res = await api.get("/dashboard/stats/custom-range", {
					params: { startDate: params.startDate, endDate: params.endDate },
				});
				return res.data;
			}

			if (params.date) {
				// ===== /dashboard/stats/by-day?date=2025-10-23 =====
				const res = await api.get("/dashboard/stats/by-day", {
					params: { date: params.date },
				});
				return res.data;
			}

			// 2️⃣ Nếu không có params nào → mặc định LAST_YEAR
			const res = await api.get("/dashboard/stats", {
				params: { period: "LAST_YEAR" },
			});
			return res.data;
		} catch (error) {
			console.error("❌ Lỗi khi gọi getStats:", error);
		}
	},


	async getStatsByDay(date: string): Promise<DashboardStatsItem[]> {
		const res = await api.get("/dashboard/stats/by-day", { params: { date } });
		return res.data;
	},

	async getStatsByCustomRange(
		startDate: string,
		endDate: string
	): Promise<DashboardStatsItem[]> {
		const res = await api.get("/dashboard/stats/custom-range", {
			params: { startDate, endDate },
		});
		return res.data;
	},

	// Đơn hàng theo danh mục (API khác với getStatsByCategory — nếu backend có endpoint riêng)
	async getOrderByCategory(
		period: string = "THIS_MONTH"
	): Promise<OrderByCategory[]> {
		const res = await api.get(`/dashboard/stats/by-category?period=${period}`);
		return res.data;
	},
};
