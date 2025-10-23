"use client";

import { useState, useEffect, useCallback } from "react";
import { inventoryService } from "@/lib/services/inventoryService";

export interface ProductInventory {
	productId: number;
	productName: string;
	imageUrl: string;
	quantity: number;
	lastUpdated: string | null;
}

export interface PagedResponse<T> {
	data: T[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
}

export const useInventories = () => {
	const [inventories, setInventories] = useState<ProductInventory[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [size] = useState(5);
	const [totalPages, setTotalPages] = useState(0);
	const [totalElements, setTotalElements] = useState(0);

	// Fetch danh sách inventory
	const fetchInventories = useCallback(
		async (
			pageNum = page,
			search?: string,
			sortField: string = "id",
			sortDir: "asc" | "desc" = "asc"
		) => {
			try {
				setLoading(true);
				const res: PagedResponse<ProductInventory> =
					await inventoryService.getAll(
						pageNum,
						size,
						search ?? "",
						sortField,
						sortDir
					);

				setInventories(res.data);
				setPage(res.page);
				setTotalPages(res.totalPages);
				setTotalElements(res.totalElements);
			} catch (error) {
				console.error("❌ Failed to fetch inventories:", error);
			} finally {
				setLoading(false);
			}
		},
		[page, size]
	);

	useEffect(() => {
		fetchInventories(page);
	}, [page, fetchInventories]);

	return {
		inventories,
		setInventories,
		loading,
		page,
		size,
		totalPages,
		totalElements,
		setPage,
		refetch: fetchInventories,
	};
};
