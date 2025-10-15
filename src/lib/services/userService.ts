import api from "@/lib/axios";
import { Role, UserFormData, UserRequest } from "@/components/types";

export interface User {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	enabled: boolean;
	roles: Role[]; // danh sách role chi tiết (nếu backend trả về)
}

export const userService = {
	async getAll(
		page = 0,
		size = 5,
		keyword = "",
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

		const res = await api.get(`/user?${params.toString()}`);
		return res.data;
	},

	async getRoles() {
		const res = await api.get(`/role`);
		return res.data;
	},

	async updateUserStatus(id: number, enabled: boolean) {
		const res = await api.patch(`/user/${id}?enabled=${enabled}`);
		return res.data;
	},

	async deleteUser(id: number) {
		const res = await api.delete(`/user/${id}`);
		return res.data;
	},

	async getUserById(id: number) {
		const res = await api.get(`/user/${id}`);
		return res.data;
	},

	async createUser(userData: UserFormData) {
		const formData = new FormData();

		formData.append(
			"user",
			new Blob([JSON.stringify(userData)], { type: "application/json" })
		);

		if (userData.avatarFile) {
			formData.append("image", userData.avatarFile);
		}

		const res = await api.post("/user", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});

		return res.data;
	},

	// userService.ts
	async updateUser(userData: UserRequest, imageFile?: File | null) {
		const formData = new FormData();

		// 🧩 Append user object dưới dạng JSON blob
		formData.append(
			"user",
			new Blob([JSON.stringify(userData)], { type: "application/json" })
		);

		// 🖼️ Append ảnh nếu có chọn
		if (imageFile) {
			formData.append("image", imageFile);
		}

		const res = await api.put("/user", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});

		return res.data;
	},
};
