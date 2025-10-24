import api from "@/lib/axios";

// 🧱 Mô tả từng danh mục
export interface CategoryResponse {
	id: number;
	name: string;
	alias: string;
	image?: string;
	enabled: boolean;
}

// 📄 Mô tả cấu trúc phản hồi có phân trang
export interface CategoryPageResponse {
	data: CategoryResponse[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
}

export interface CategoryRequest {
	name: string;
	alias: string;
	enabled: boolean;
}

export const categoryService = {
	async getAll(
		page: number = 0,
		size: number = 10,
		keyword: string = "",
		sortField = "id",
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

		const res = await api.get(`/categories?${params.toString()}`);
		return res.data;
	},
	
	async getListCategories() {
		const res = await api.get("/categories?page=0&size=100&sortField=name&sortDir=asc");
		return res.data;
	},

	async getById(id: number) {
		const res = await api.get(`/categories/${id}`);
		return res.data;
	},

	// 🟢 Tạo mới danh mục (POST)
	async createCategory(categoryData: CategoryRequest, imageFile?: File | null) {
		const formData = new FormData();

		formData.append(
			"category",
			new Blob([JSON.stringify(categoryData)], { type: "application/json" })
		);

		if (imageFile) {
			formData.append("image", imageFile);
		}

		const res = await api.post(`/categories`, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});

		return res.data;
	},

	async updateCategory(categoryData: CategoryRequest, imageFile?: File | null) {
		const formData = new FormData();

		formData.append(
			"category",
			new Blob([JSON.stringify(categoryData)], { type: "application/json" })
		);

		if (imageFile) {
			formData.append("image", imageFile);
		}

		const res = await api.put(`/categories`, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});

		return res.data;
	},

	async updateStatus(id: number, enabled: boolean) {
		const res = await api.patch(`/categories/${id}?enabled=${enabled}`);
		return res.data;
	},

	async delete(id: number) {
		const res = await api.delete(`/categories/${id}`);
		return res.data;
	},
};
