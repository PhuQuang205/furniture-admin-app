import api from "@/lib/axios";

// 🧱 Mô tả chi tiết sản phẩm
export interface ProductDetail {
	name: string;
	value: string;
}

// 🖼️ Ảnh chính hoặc phụ
export interface ProductImage {
	id?: number;
	imageUrl?: string;
	position?: number;
}

// 📦 Thông tin sản phẩm
export interface ProductResponse {
	id: number;
	name: string;
	alias: string;
	shortDescription: string;
	fullDescription: string;
	enabled: boolean;
	inStock: boolean;
	cost: number;
	price: number;
	discountPercent: number;
	finalPrice?: number;
	length: number;
	width: number;
	height: number;
	weight: number;
	category: {
		id: number;
		name: string;
		alias: string;
		image?: string;
		enabled: boolean;
	};
	images: ProductImage[],
	mainImage?: ProductImage;
	details: ProductDetail[];
}

// 📄 Cấu trúc phản hồi có phân trang
export interface ProductPageResponse {
	data: ProductResponse[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
}

// 🧾 Dữ liệu gửi lên khi tạo / cập nhật sản phẩm
export interface ProductRequest {
	name: string;
	alias: string;
	shortDescription: string;
	fullDescription: string;
	enabled: boolean;
	inStock: boolean;
	cost: number;
	price: number;
	discountPercent: number;
	length: number;
	width: number;
	height: number;
	weight: number;
	categoryId: number;
	details: ProductDetail[];
}

export const productService = {
	// 🟢 Lấy danh sách sản phẩm (có phân trang)
	async getAll(page: number = 0, size: number = 10) {
		const res = await api.get(`/products`, { params: { page, size } });
		return res.data as ProductPageResponse;
	},

	// 🟢 Lấy 1 sản phẩm theo id
	async getById(id: number) {
		const res = await api.get(`/products/${id}`);
		return res.data as ProductResponse;
	},

	// 🟢 Tạo mới sản phẩm (POST)
	// Gửi 2 key: "products" (JSON) + "images" (list File[])
	async createProduct(productData: ProductRequest, imageFiles?: File[]) {
		const formData = new FormData();

		formData.append(
			"product",
			new Blob([JSON.stringify(productData)], { type: "application/json" })
		);

		if (imageFiles && imageFiles.length > 0) {
			imageFiles.forEach((file) => {
				formData.append("images", file);
			});
		}

		const res = await api.post(`/products`, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return res.data;
	},

	// 🟡 Cập nhật sản phẩm (PUT)
	async updateProduct(productData: ProductRequest, imageFiles?: File[]) {
		const formData = new FormData();

		formData.append(
			"products",
			new Blob([JSON.stringify(productData)], { type: "application/json" })
		);

		if (imageFiles && imageFiles.length > 0) {
			imageFiles.forEach((file) => {
				formData.append("images", file);
			});
		}

		const res = await api.put(`/products`, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return res.data as ProductResponse;
	},

	// 🔄 Cập nhật trạng thái (PATCH)
	async updateStatus(id: number, enabled: boolean) {
		const res = await api.patch(`/products/${id}?enabled=${enabled}`);
		return res.data;
	},

	// ❌ Xóa sản phẩm theo id
	async delete(id: number) {
		const res = await api.delete(`/products/${id}`);
		return res.data;
	},
};
