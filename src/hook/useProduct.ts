"use client";

import { useState, useEffect, useCallback } from "react";
import {
	productService,
	ProductResponse,
	ProductPageResponse,
	ProductRequest,
} from "@/lib/services/productService";
import { toast } from "sonner";

export const useProducts = () => {
	const [products, setProducts] = useState<ProductResponse[]>([]);
	const [selectedProduct, setSelectedProduct] = useState<ProductResponse>();
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [size] = useState(10);
	const [totalPages, setTotalPages] = useState(0);
	const [totalElements, setTotalElements] = useState(0);

	// 🟢 Lấy danh sách sản phẩm có phân trang
	const fetchProducts = useCallback(
		async (pageNum = page) => {
			try {
				setLoading(true);
				const res: ProductPageResponse = await productService.getAll(pageNum, size);
				setProducts(res.data);
				setPage(res.page);
				setTotalPages(res.totalPages);
				setTotalElements(res.totalElements);
			} catch (error) {
				console.error("❌ Failed to fetch products:", error);
				console.log("Không thể tải danh sách sản phẩm!");
			} finally {
				setLoading(false);
			}
		},
		[page, size]
	);

	// 🟢 Lấy chi tiết sản phẩm theo ID
	const fetchProductById = useCallback(async (id: number) => {
		try {
			setLoading(true);
			const product = await productService.getById(id);
			setSelectedProduct(product);
			return product;
		} catch (error) {
			console.error("❌ Failed to fetch product detail:", error);
			console.log("Không thể tải thông tin sản phẩm!");
			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	// 🟢 Tạo sản phẩm mới
	const createProduct = useCallback(
		async (productData: ProductRequest, imageFiles: File[]) => {
			try {
				setLoading(true);
				const newProduct: ProductResponse = await productService.createProduct(
					productData,
					imageFiles
				);
				setProducts((prev) => [newProduct, ...prev]);
				return newProduct;
			} catch (error) {
				console.error("❌ Failed to create product:", error);
				console.log("Thêm sản phẩm thất bại!");
				throw error;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	// 🟢 Cập nhật sản phẩm
	const updateProduct = useCallback(
		async (productData: ProductRequest, imageFiles: File[]) => {
			try {
				setLoading(true);
				const updated = await productService.updateProduct(productData, imageFiles);
				setProducts((prev) =>
					prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
				);
				return updated;
			} catch (error) {
				console.error("❌ Failed to update product:", error);
				console.log("Cập nhật sản phẩm thất bại!");
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
			await productService.updateStatus(id, enabled);
			setProducts((prev) =>
				prev.map((p) => (p.id === id ? { ...p, enabled } : p))
			);
		} catch (error) {
			console.error("❌ Failed to update product status:", error);
			console.log("Cập nhật trạng thái sản phẩm thất bại!");
		} finally {
			setLoading(false);
		}
	}, []);

	// 🔴 Xóa sản phẩm
	const deleteProduct = useCallback(async (id: number) => {
		try {
			setLoading(true);
			await productService.delete(id);
			setProducts((prev) => prev.filter((p) => p.id !== id));
			toast.success("Xóa sản phẩm thành công!");
		} catch (error) {
			console.error("❌ Failed to delete product:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	return {
		products,
		setProducts,
		selectedProduct,
		loading,
		page,
		size,
		totalPages,
		totalElements,
		setPage,
		fetchProducts,
		fetchProductById,
		createProduct,
		updateProduct,
		updateStatus,
		deleteProduct,
	};
};
