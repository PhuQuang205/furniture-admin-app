import api from "@/lib/axios";

// 🧱 Mô tả chi tiết sản phẩm
export interface ProductDetail {
	id?: number;
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
	images: ProductImage[];
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

export interface ProductRequest {
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
	length: number;
	width: number;
	height: number;
	weight: number;
	categoryId: number;

	// 🖼️ Thứ tự ảnh mới được upload
	newImageOrder: number[];

	// 🖼️ Các ảnh cũ được giữ lại (theo id và vị trí)
	retainedImages: {
		id: number;
		position: number;
	}[];

	// 🧾 Các mô tả kỹ thuật mới thêm
	newProductDetails: {
		name: string;
		value: string;
	}[];

	// 🧾 Các mô tả kỹ thuật cũ được giữ lại
	retainedProductDetailIds: number[];
}

export interface ProductRq {
	name: string;
	alias: string;
	shortDescription: string;
	fullDescription: string;
	categoryId: number; // 👈 vì trong useState bạn đang để là chuỗi
	price: number;
	enabled: boolean;
	inStock: boolean;
	cost: number;
	discountPercent: number;
	length: number;
	width: number;
	height: number;
	weight: number;
	details: ProductDetail[];
}

export const productService = {
	// 🟢 Lấy danh sách sản phẩm (có phân trang)
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
		if (keyword !== "") {
			params.append("keyword", keyword.trim());
		}
		const res = await api.get(`/products?${params.toString()}`);
		return res.data;
	},

	// 🟢 Lấy 1 sản phẩm theo id
	async getById(id: number) {
		const res = await api.get(`/products/${id}`);
		return res.data as ProductResponse;
	},

	// 🟢 Tạo mới sản phẩm (POST)
	// Gửi 2 key: "products" (JSON) + "images" (list File[])
	async createProduct(productData: ProductRq, imageFiles?: File[]) {
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
			"product",
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
		return res.data;
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
