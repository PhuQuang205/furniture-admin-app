"use client";

import { useState, useEffect, useCallback } from "react";
import {
	categoryService,
	CategoryResponse,
	CategoryPageResponse,
	CategoryRequest,
} from "@/lib/services/categoryService";

export const useCategories = () => {
	const [categories, setCategories] = useState<CategoryResponse[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<CategoryResponse>();
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [size] = useState(5);
	const [totalPages, setTotalPages] = useState(0);
	const [totalElements, setTotalElements] = useState(0);
	const [categoriesList,setCategoriesList] = useState<CategoryResponse[]>([]);

	// 🟢 Lấy danh mục có phân trang
	const fetchCategories = useCallback(
		async (
			pageNum = page,
			keyword = "",
			sortField = "id",
			sortDir: "asc" | "desc" = "asc"
		) => {
			try {
				setLoading(true);
				const res: CategoryPageResponse = await categoryService.getAll(
					pageNum,
					size,
					keyword,
					sortField,
					sortDir
				);
				setCategories(res.data);
				setPage(res.page);
				setTotalPages(res.totalPages);
				setTotalElements(res.totalElements);
			} catch (error) {
				console.error("❌ Failed to fetch categories:", error);
				console.log("Không thể tải danh mục!");
			} finally {
				setLoading(false);
			}
		},
		[page, size]
	);

	const getAllCategories = useCallback(async () => {
		try {
			const res = await categoryService.getListCategories();
			setCategoriesList(res.data);

		} catch (error) {
			console.error("❌ Failed to fetch categories:", error);
			console.log("Không thể tải danh mục!");
		}
	}, []);

	const fetchListCategories = useCallback(async () => {
		try {
			setLoading(true);
			const res: CategoryPageResponse =
				await categoryService.getListCategories();
			setCategories(res.data);
			setPage(res.page);
			setTotalPages(res.totalPages);
			setTotalElements(res.totalElements);
		} catch (error) {
			console.error("❌ Failed to fetch categories:", error);
			console.log("Không thể tải danh mục!");
		} finally {
			setLoading(false);
		}
	}, []);

	// 🟢 Lấy chi tiết theo ID
	const fetchCategoryById = useCallback(async (id: number) => {
		try {
			setLoading(true);
			const category = await categoryService.getById(id);
			setSelectedCategory(category);
			return category;
		} catch (error) {
			console.error("❌ Failed to fetch category detail:", error);
			console.log("Không thể tải thông tin danh mục!");
			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	// 🟢 Tạo danh mục mới
	const createCategory = useCallback(
		async (categoryData: CategoryRequest, imageFile?: File | null) => {
			try {
				setLoading(true);

				// Gọi API (POST /categories)
				const newCategory: CategoryResponse =
					await categoryService.createCategory(categoryData, imageFile);

				// Cập nhật lại danh sách local
				setCategories((prev) => [newCategory, ...prev]);

				return newCategory;
			} catch (error) {
				console.error("❌ Failed to create category:", error);
				console.log("Thêm danh mục thất bại!");
				throw error;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	// 🟢 Cập nhật danh mục (kèm ảnh)
	const updateCategory = useCallback(
		async (categoryData: CategoryRequest, imageFile?: File | null) => {
			try {
				setLoading(true);
				const updated = await categoryService.updateCategory(
					categoryData,
					imageFile
				);
				setCategories((prev) =>
					prev.map((cat) =>
						cat.id === updated.id ? { ...cat, ...updated } : cat
					)
				);
				return updated;
			} catch (error) {
				console.error("❌ Failed to update category:", error);
				console.log("Cập nhật danh mục thất bại!");
				return null;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	// 🟢 Cập nhật trạng thái bật/tắt
	const updateStatus = useCallback(async (id: number, enabled: boolean) => {
		try {
			setLoading(true);
			await categoryService.updateStatus(id, enabled);
			setCategories((prev) =>
				prev.map((cat) => (cat.id === id ? { ...cat, enabled } : cat))
			);
		} catch (error) {
			console.error("❌ Failed to update category status:", error);
			console.log("Cập nhật trạng thái danh mục thất bại!");
		} finally {
			setLoading(false);
		}
	}, []);

	// 🔴 Xóa danh mục
	const deleteCategory = useCallback(async (id: number) => {
		try {
			setLoading(true);
			await categoryService.delete(id);
			setCategories((prev) => prev.filter((cat) => cat.id !== id));
			console.log("✅ Xóa danh mục thành công");
		} catch (error) {
			console.error("❌ Failed to delete category:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchCategories();
		getAllCategories();
	}, [fetchCategories, getAllCategories]);

	return {
		categories,
		setCategories,
		selectedCategory,
		loading,
		page,
		size,
		totalPages,
		totalElements,
		categoriesList,
		setPage,
		fetchCategories,
		fetchListCategories,
		fetchCategoryById,
		updateCategory,
		createCategory,
		updateStatus,
		deleteCategory,
	};
};
