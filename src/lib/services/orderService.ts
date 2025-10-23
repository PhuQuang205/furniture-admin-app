import api from "@/lib/axios";

export type OrderStatus =
	| "NEW"
	| "CANCELLED"
	| "PROCESSING"
	| "PACKAGED"
	| "PICKED"
	| "SHIPPING"
	| "DELIVERED"
	| "RETURN_REQUESTED"
	| "RETURNED"
	| "RETURN_REJECTED";

export const ORDER_STATUS_LABELS: Record<OrderStatus, OrderStatus> = {
	NEW: "NEW",
	CANCELLED: "CANCELLED",
	PROCESSING: "PROCESSING",
	PACKAGED: "PACKAGED",
	PICKED: "PICKED",
	SHIPPING: "SHIPPING",
	DELIVERED: "DELIVERED",
	RETURN_REQUESTED: "RETURN_REQUESTED",
	RETURNED: "RETURNED",
	RETURN_REJECTED: "RETURN_REJECTED",
};

export interface OrderDetailResponse {
	productId: number;
	productName: string;
	imageUrl: string;
	price: number;
	quantity: number;
}

export interface OrderTrackResponse {
	id: number;
	notes: string;
	updatedTime: string;
	status: OrderStatus;
}

export interface OrderResponse {
	id: number;
	firstName: string;
	lastName: string;
	provinceName: string;
	wardName: string;
	addressLine: string;
	phoneNumber: string;
	email: string;
	shippingCost: number;
	productCost: number;
	subtotal: number;
	total: number;
	deliverDays: number;
	deliverDate: string | null;
	status: OrderStatus;
	paymentMethod: string;
	paymentStatus: string;
	orderTime: string;
	details: OrderDetailResponse[];
	orderTracks: OrderTrackResponse[];
}

// 📄 Cấu trúc phản hồi có phân trang
export interface OrderPageResponse {
	data: OrderResponse[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
}

// 🟡 Request cập nhật trạng thái đơn hàng
export interface OrderStatusRequest {
	status: OrderStatus;
	notes?: string;
}

export const orderService = {	
	async getAll(
		page: number = 0,
		size: number = 10,
		keyword = "",
		sortField: string = "id",
		sortDir = "asc"
	) {
		const params = new URLSearchParams({
			page: String(page),
			size: String(size),
			sortField,
			sortDir,
		});

		if (keyword.trim() !== "") {
			params.append("keyword", keyword.trim());
		}

		const res = await api.get(`/orders?${params.toString()}`);
		return res.data as OrderPageResponse;
	},

	// 🟢 Lấy toàn bộ danh sách đơn hàng (không phân trang)
	async getAllOrders() {
		const res = await api.get(`/orders`);
		return res.data.data ?? res.data;
	},

	// 🟢 Lấy chi tiết một đơn hàng (GET /orders/{id})
	async getById(id: number) {
		const res = await api.get(`/orders/${id}`);
		return res.data as OrderResponse;
	},

	// 🟡 Cập nhật trạng thái đơn hàng (PATCH /orders/{id}/status)
	async updateStatus(id: number, data: OrderStatusRequest) {
		const res = await api.patch(`/orders/${id}/status`, data, {
			headers: { "Content-Type": "application/json" },
		});
		return res.data;
	},

	// 🟢 Chấp nhận hoàn đơn (POST /orders/{id}/approve-return)
	async approveReturn(id: number) {
		const res = await api.post(`/orders/${id}/approve-return`);
		return res.data;
	},

	// 🔴 Từ chối hoàn đơn (POST /orders/{id}/reject-return)
	async rejectReturn(id: number) {
		const res = await api.post(`/orders/${id}/reject-return`);
		return res.data;
	},
};
