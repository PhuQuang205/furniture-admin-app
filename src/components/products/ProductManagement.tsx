"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useProducts } from "@/hook/useProduct";
import { useRouter } from "next/navigation";
import { ProductTable } from "@/components/products/ProductTable";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export const ProductManagement = () => {
	const router = useRouter();
	const {
		products,
		deleteProduct,
		loading,
		setPage,
		page,
		totalElements,
		totalPages,
		size,
		refesh,
		updateStatus,
	} = useProducts();
	
	const [sortField, setSortField] = useState<string>("name");
	const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
	const [keyword, setKeyword] = useState("");

	const handleSearch = (value: string) => {
		setKeyword(value);
		refesh(0, value);
	};

	const handleSortChange = (value: string) => {
		setPage(0);
		setSortField(value);
		refesh(0, keyword, value, sortDir);
	};

	const toggleSortDir = () => {
		const newDir = sortDir === "asc" ? "desc" : "asc";
		setSortDir(newDir);
		refesh(0, keyword, sortField, newDir);
	};

	const handleDelete = async (id: number) => {
		await deleteProduct(id);
	};

	return (
		<>
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center gap-2">
					<SearchInput
						placeholder="Tìm kiếm sản phẩm..."
						onSearch={handleSearch}
						initialValue={keyword}
						className="flex-1"
					/>

					<Select value={sortField} onValueChange={handleSortChange}>
						<SelectTrigger className="w-[140px] rounded-full border-gray-300 py-1">
							<SelectValue placeholder="Sắp xếp theo" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Thuộc tính</SelectLabel>
								<SelectItem value="name">Tên</SelectItem>
								<SelectItem value="price">Giá</SelectItem>
								<SelectItem value="alias">Alias</SelectItem>
								<SelectItem value="enabled">Trạng thái</SelectItem>
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
						<Icon
							icon="lucide:arrow-up"
							className="size-5 text-gray-700"
						/>
					</button>
				</div>

				<button
					onClick={() => router.push("/products/add")}
					className="bg-transparent flex items-center gap-1.5 h-9 border border-gray-300 rounded-full px-2 py-1 text-gray-700 cursor-pointer"
				>
					<Plus className="size-4" />
					<p className="text-sm">Thêm sản phẩm</p>
				</button>
			</div>

			<ProductTable
				products={products}
				loading={loading}
				onDelete={handleDelete}
				updateStatus={updateStatus}
			/>

			{totalPages > 1 && (
				<div className="flex items-center justify-between mt-6">
					<div className="text-sm text-gray-600">
						Hiển thị từ {page * size + 1} đến{" "}
						{Math.min((page + 1) * size, totalElements)} trong tổng số{" "}
						{totalElements} mục
					</div>
					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							size="icon"
							disabled={page === 0}
							onClick={() => setPage(0)}
							className="w-8 h-8"
						>
							<Icon icon="lucide:chevrons-left" className="w-4 h-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							disabled={page === 0}
							onClick={() => setPage(page - 1)}
							className="w-8 h-8"
						>
							<Icon icon="lucide:chevron-left" className="w-4 h-4" />
						</Button>

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

						<Button
							variant="ghost"
							size="icon"
							disabled={page + 1 >= totalPages}
							onClick={() => setPage(page + 1)}
							className="w-8 h-8"
						>
							<Icon icon="lucide:chevron-right" className="w-4 h-4" />
						</Button>

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
