"use client";

import { useCustomers } from "@/hook/useCustomers";
import { SearchInput } from "@/components/SearchInput";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { PaginationFooter } from "@/components/PaginationFooter";
import { Loader2 } from "lucide-react";

export const CustomerManagement = () => {
	const {
		customers,
		loading,
		page,
		setPage,
		size,
		totalPages,
		totalElements,
		fetchCustomers,
	} = useCustomers();
    console.log(customers)
	const [keyword, setKeyword] = useState("");
	const [sortField, setSortField] = useState("id");
	const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

	// 🔍 Tìm kiếm
	const handleSearch = (kw: string) => {
		setKeyword(kw);
		setPage(0);
		fetchCustomers(0, kw, sortField, sortDir);
	};

	// ↕️ Thay đổi trường sắp xếp
	const handleSortChange = (field: string) => {
		setSortField(field);
		fetchCustomers(page, keyword, field, sortDir);
	};

	// 🔄 Đổi hướng sắp xếp
	const toggleSortDir = () => {
		const newDir = sortDir === "asc" ? "desc" : "asc";
		setSortDir(newDir);
		fetchCustomers(page, keyword, sortField, newDir);
	};

	return (
		<>
			{/* 🔍 Search + Sort */}
			<div className="flex justify-between items-center gap-4 mb-4">
				<div className="flex items-center gap-2 flex-1">
					<SearchInput
						placeholder="Tìm kiếm theo tên hoặc email..."
						onSearch={handleSearch}
						initialValue={keyword}
						className="flex-1"
					/>

					<Select value={sortField} onValueChange={handleSortChange}>
						<SelectTrigger className="w-[150px]">
							<SelectValue placeholder="Sắp xếp theo" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="id">ID khách hàng</SelectItem>
							<SelectItem value="lastName">Họ</SelectItem>
							<SelectItem value="email">Email</SelectItem>
						</SelectContent>
					</Select>

					<Button onClick={toggleSortDir} className="px-2 py-1">
						<Icon
							icon={sortDir === "asc" ? "lucide:arrow-up" : "lucide:arrow-down"}
							className="w-4 h-4"
						/>
					</Button>
				</div>
			</div>

			{/* 🧾 Bảng khách hàng */}
			{loading ? (
				<div className="flex items-center justify-center py-10 text-gray-500">
					<Loader2 className="animate-spin w-5 h-5 mr-2" />
					Đang tải dữ liệu khách hàng...
				</div>
			) : (
				<CustomerTable customers={customers} loading={loading} />
			)}

			{/* 📄 Phân trang */}
			<PaginationFooter
				page={page}
				size={size}
				totalPages={totalPages}
				totalElements={totalElements}
				label="khách hàng"
				onPageChange={(newPage) => {
					setPage(newPage);
					fetchCustomers(newPage, keyword, sortField, sortDir);
				}}
			/>
		</>
	);
};
