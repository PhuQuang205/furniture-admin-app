"use client";

import { useOrders } from "@/hook/useOrder";
import { OrderTable } from "./OrderTable";
import { Loader2 } from "lucide-react";
import { SearchInput } from "@/components/SearchInput";
import { Select, SelectTrigger, SelectGroup, SelectValue, SelectContent, SelectLabel, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

export const OrderManagement = () => {
	const { orders, loading, setPage, refesh, totalPages, totalElements, page, size } = useOrders();
	const [keyword] = useState();
	const [sortField, setSortField] = useState<string>("id")
	const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

	const handleSearch = (kw: string) => {
		setPage(0);
		refesh(0, kw);
	};

	const handleSortChange = (field: string) => {
		setPage(0);
		setSortField(field);
		refesh(0, keyword, field, sortDir);
	};

	const toggleSortDir = () => {
		const newDir = sortDir === "asc" ? "desc" : "asc";
		setSortDir(newDir);
		refesh(0, keyword, sortField, newDir);
	};

	
	return (
		<>
			{/* Search and sort */}
			<div className="flex justify-between items-center gap-4">
				<div className="flex items-center gap-2 flex-1">
					<SearchInput
						placeholder="Search by name or email..."
						onSearch={handleSearch}
						initialValue={keyword}
						className="flex-1"
					/>
					<Select value={sortField} onValueChange={handleSortChange}>
						<SelectTrigger className="w-[120px]">
							<SelectValue placeholder="Sort field" className="text-black"/>
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Fields</SelectLabel>
								<SelectItem value="id">Order ID</SelectItem>
								<SelectItem value="lastName">Last name</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<Button
						onClick={toggleSortDir}
						className="px-2 py-1"
					>
						{sortDir === "asc" ? (
							<Icon icon="lucide:arrow-up" className="w-4 h-4" />
						) : (
							<Icon icon="lucide:arrow-down" className="w-4 h-4" />
						)}
					</Button>
				</div>
			</div>

			{loading ? (
				<div className="flex items-center justify-center py-10">
					<Loader2 className="animate-spin w-6 h-6 text-gray-500" />
					<span className="ml-2 text-gray-500">Đang tải dữ liệu...</span>
				</div>
			) : (
				<OrderTable orders={orders} loading={loading}/>
			)}

			{totalPages > 1 && (
					<div className="flex items-center justify-between mt-6">
						<div className="text-sm text-gray-600">
							Hiển thị từ {page * size + 1} đến{" "}
							{Math.min((page + 1) * size, totalElements)} trong tổng số {totalElements}{" "}
							đơn hàng
						</div>
						<div className="flex items-center gap-1">
							{/* Về trang đầu */}
							<Button
								variant="ghost"
								size="icon"
								disabled={page === 0}
								onClick={() => setPage(0)}
								className="w-8 h-8"
							>
								<Icon icon="lucide:chevrons-left" className="w-4 h-4" />
							</Button>

							{/* Trang trước */}
							<Button
								variant="ghost"
								size="icon"
								disabled={page === 0}
								onClick={() => setPage(page - 1)}
								className="w-8 h-8"
							>
								<Icon icon="lucide:chevron-left" className="w-4 h-4" />
							</Button>

							{/* Các số trang */}
							{Array.from({ length: totalPages }, (_, i) => (
								<Button
									key={i}
									variant={i === page ? "default" : "ghost"}
									size="icon"
									onClick={() => setPage(i)}
									className={`w-8 h-8 ${
										i === page
											? "bg-blue-500 text-white"
											: "bg-blue-50 text-blue-600 hover:bg-blue-100"
									}`}
								>
									{i + 1}
								</Button>
							))}

							{/* Trang sau */}
							<Button
								variant="ghost"
								size="icon"
								disabled={page + 1 >= totalPages}
								onClick={() => setPage(page + 1)}
								className="w-8 h-8"
							>
								<Icon icon="lucide:chevron-right" className="w-4 h-4" />
							</Button>

							{/* Tới trang cuối */}
							<Button
								variant="ghost"
								size="icon"
								disabled={page + 1 >= totalPages}
								onClick={() => setPage(totalPages - 1)}
								className="w-8 h-8"
							>
								<Icon icon="lucide:chevrons-right" className="w-4 h-4" />
							</Button>
						</div>
					</div>
				)}
		</>
	);
};
