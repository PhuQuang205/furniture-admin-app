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
import { Icon } from "@iconify/react";
import { useState } from "react";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { PaginationFooter } from "@/components/PaginationFooter";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
	const [keyword, setKeyword] = useState("");
	const [sortField, setSortField] = useState("id");
	const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

	const handleSearch = (kw: string) => {
		setKeyword(kw);
		setPage(0);
		fetchCustomers(0, kw, sortField, sortDir);
	};

	const handleSortChange = (field: string) => {
		setSortField(field);
		fetchCustomers(page, keyword, field, sortDir);
	};

	const toggleSortDir = () => {
		const newDir = sortDir === "asc" ? "desc" : "asc";
		setSortDir(newDir);
		fetchCustomers(page, keyword, sortField, newDir);
	};

	return (
		<>
			<div className="flex justify-between items-center gap-4 mb-4">
				<div className="flex items-center gap-2 flex-1">
					<SearchInput
						placeholder="Tìm kiếm theo tên hoặc email..."
						onSearch={handleSearch}
						initialValue={keyword}
					/>

					<Select value={sortField} onValueChange={handleSortChange}>
						<SelectTrigger className="w-[140px] rounded-full border-gray-300 py-1">
							<SelectValue placeholder="Sắp xếp theo" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="id">ID khách hàng</SelectItem>
							<SelectItem value="lastName">Họ</SelectItem>
							<SelectItem value="email">Email</SelectItem>
						</SelectContent>
					</Select>

					<button
						onClick={toggleSortDir}
						className={cn(
							"size-7 cursor-pointer bg-transparent border border-gray-300 rounded-full flex items-center justify-center transition-all duration-300",
							sortDir === "asc" ? "rotate-180" : ""
						)}
					>
						<Icon icon="lucide:arrow-up" className="size-5 text-gray-700" />
					</button>
				</div>
			</div>

			{loading ? (
				<div className="flex items-center justify-center py-10 text-gray-500">
					<Loader2 className="animate-spin w-5 h-5 mr-2" />
					Đang tải dữ liệu khách hàng...
				</div>
			) : (
				<CustomerTable customers={customers} loading={loading} />
			)}

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
