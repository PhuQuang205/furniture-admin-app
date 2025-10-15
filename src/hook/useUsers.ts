"use client";

import { useState, useEffect, useCallback } from "react";
import { userService } from "@/lib/services/userService";
import { User, UserFormData } from "@/components/types";

export interface Role {
	id: number;
	name: string;
	description: string;
}

export interface PagedResponse<T> {
	data: T[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
}

export const useUsers = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [selectedUser, setSelectedUser] = useState<User>();
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [size] = useState(5);
	const [totalPages, setTotalPages] = useState(0);
	const [totalElements, setTotalElements] = useState(0);
	const [keyword, setKeyword] = useState("");

	// Fetch users
	const fetchUsers = async (
		pageNum = page,
		search?: string,
		sortField: string = "id",
		sortDir: "asc" | "desc" = "asc"
	) => {
		try {
			setLoading(true);
			const res: PagedResponse<User> = await userService.getAll(
				pageNum,
				size,
				search ?? "",
				sortField,
				sortDir
			);
			setUsers(res.data);
			setPage(res.page);
			setTotalPages(res.totalPages);
			setTotalElements(res.totalElements);
		} catch (error) {
			console.error("❌ Failed to fetch users:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchUserById = useCallback(async (id: number) => {
		try {
			setLoading(true);
			const user = await userService.getUserById(id);
			setSelectedUser(user);
			return user;
		} catch (error) {
			console.error("❌ Failed to fetch user detail:", error);
			alert("Không thể tải thông tin user!");
			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	const updateUserStatus = useCallback(async (id: number, enabled: boolean) => {
		try {
			setLoading(true);
			await userService.updateUserStatus(id, enabled); // gọi service

			// Cập nhật state local ngay lập tức
			setUsers((prev) =>
				prev.map((user) => (user.id === id ? { ...user, enabled } : user))
			);
		} catch (error) {
			console.error("❌ Failed to update user status:", error);
			alert("Cập nhật trạng thái thất bại!");
		} finally {
			setLoading(false);
		}
	}, []);

	const createUser = async (userData: UserFormData) => {
		setLoading(true);
		try {
			const newUser = await userService.createUser(userData);
			setUsers((prev) => [...prev, newUser]); // thêm vào state
			return newUser;
		} finally {
			setLoading(false);
		}
	};

	// Delete user
	const deleteUser = useCallback(async (id: number) => {
		try {
			setLoading(true);
			await userService.deleteUser(id);
			setUsers((prev) => prev.filter((user) => user.id !== id));
		} catch (err: unknown) {
			console.error("❌ Xóa user thất bại:", err);
			alert("Xóa user thất bại!");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchUsers(page);
	}, [page]);

	return {
		users,
		setUsers,
		loading,
		selectedUser,
		totalElements,
		page,
		totalPages,
		size,
		keyword,
		createUser,
		updateUserStatus,
		deleteUser,
		setPage,
		refetch: fetchUsers,
		fetchUserById,
	};
};
