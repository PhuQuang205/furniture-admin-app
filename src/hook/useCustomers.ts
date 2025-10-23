import { useState, useEffect, useCallback } from "react";
import { customerService, CustomerResponse } from "@/lib/services/customerService";

export const useCustomers = () => {
	const [customers, setCustomers] = useState<CustomerResponse[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [size] = useState(5);
	const [totalPages, setTotalPages] = useState(0);
	const [totalElements, setTotalElements] = useState(0);

	// 🧩 Hàm gọi API lấy danh sách khách hàng
	const fetchCustomers = useCallback(
		async (
			page = 0,
			keyword = "",
			sortField = "id",
			sortDir: "asc" | "desc" = "asc"
		) => {
			try {
				setLoading(true);
				const res = await customerService.getAllCustomer(page, size, keyword, sortField, sortDir);
				setCustomers(res.data);
				setTotalPages(res.totalPages);
				setTotalElements(res.totalElements);
			} catch (error) {
				console.error("Error fetching customers:", error);
			} finally {
				setLoading(false);
			}
		},
		[size]
	);

	// 🧩 Gọi fetch khi page thay đổi
	useEffect(() => {
		fetchCustomers(page);
	}, [page, fetchCustomers]);

	// 🧩 Hàm cập nhật trạng thái "enabled"
	const updateCustomerStatus = async (id: number, enabled: boolean) => {
		try {
			await customerService.updateEnableCustomer(id, enabled);
			setCustomers((prev) =>
				prev.map((c) => (c.id === id ? { ...c, enabled } : c))
			);
		} catch (error) {
			console.error("Error updating customer status:", error);
		}
	};

	return {
		customers,
		loading,
		page,
		size,
		totalPages,
		totalElements,
		setPage,
		fetchCustomers,
		updateCustomerStatus,
		setCustomers,
	};
};
