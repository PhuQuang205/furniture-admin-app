"use client";

import { useState } from "react";
import { useInventories } from "@/hook/useInventories";
import { SearchInput } from "@/components/SearchInput";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";
import ProductInventoryTable from "@/components/inventory/ProductInventoryTable";
import { cn } from "@/lib/utils";

export const InventoryManagement = () => {
	const [keyword] = useState("");
	const [sortField, setSortField] = useState<string>("id");
	const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

	const handleSearch = (kw: string) => {
		setPage(0);
		refetch(0, kw);
	};

	const handleSortChange = (field: string) => {
		setPage(0);
		setSortField(field);
		refetch(0, keyword, field, sortDir);
	};

	const toggleSortDir = () => {
		const newDir = sortDir === "asc" ? "desc" : "asc";
		setSortDir(newDir);
		refetch(0, keyword, sortField, newDir);
	};

	const {
		inventories,
		setInventories,
		loading,
		totalElements,
		page,
		totalPages,
		size,
		refetch,
		setPage,
	} = useInventories();

	return (
		<>
			<div className="flex justify-between items-center gap-4">
				<div className="flex items-center gap-2 flex-1">
					<SearchInput
						placeholder="Search by name or email..."
						onSearch={handleSearch}
						initialValue={keyword}
						className="flex-1"
					/>
					<Select value={sortField} onValueChange={handleSortChange}>
						<SelectTrigger className="w-[140px] rounded-full border-gray-300 py-1">
							<SelectValue placeholder="Sort field" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Fields</SelectLabel>
								<SelectItem value="id">Id</SelectItem>
								<SelectItem value="fee">Fee</SelectItem>
								<SelectItem value="Day">Day</SelectItem>
							</SelectGroup>
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
			<ProductInventoryTable
				inventories={inventories}
				loading={loading}
				size={size}
				page={page}
				totalPages={totalPages}
				totalElements={totalElements}
				onPageChange={setPage}
				setInventories={setInventories}
				refresh={refetch}
			/>
		</>
	);
};
