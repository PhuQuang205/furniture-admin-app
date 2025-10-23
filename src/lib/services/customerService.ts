import api from "@/lib/axios";

// 🧩 Mô tả 1 khách hàng
export interface CustomerResponse {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	avatarUrl: string | null;
	gender: "MALE" | "FEMALE" | null;
	phoneNumber: string | null;
	verified: boolean;
	enabled: boolean;
}

// 🧩 Mô tả response phân trang
export interface CustomerPageResponse {
	data: CustomerResponse[]; // backend trả về mảng content
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
}

export const customerService = {
	// 🟢 Lấy danh sách khách hàng (phân trang + tìm kiếm + sort)
	async getAllCustomer(
		page = 0,
		size = 10,
		keyword = "",
		sortField = "id",
		sortDir = "asc"
	): Promise<CustomerPageResponse> {
		const params = new URLSearchParams({
			page: String(page),
			size: String(size),
			sortField,
			sortDir,
		});

		if (keyword.trim() !== "") {
			params.append("keyword", keyword.trim());
		}

		const res = await api.get(`/customers?${params.toString()}`);
		return res.data;
	},

	// 🟡 Cập nhật trạng thái kích hoạt của khách hàng
	async updateEnableCustomer(id: number, enabled: boolean) {
		return api.patch(`/customers/${id}/enabled`, null, {
			params: { enabled },
		});
	},
};
