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
		updateStatus
	} = useProducts();
	console.log(products)
	console.log("totalPages", totalPages)
	const [sortField, setSortField] = useState<string>("name");
	const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
	const [keyword, setKeyword] = useState("");

	// 🔍 Xử lý tìm kiếm sản phẩm
	const handleSearch = (value: string) => {
		setKeyword(value);
		refesh(0, value);
	};

	// 🔄 Đổi cột sắp xếp
	const handleSortChange = (value: string) => {
		setPage(0);
		setSortField(value);
		refesh(0, keyword, value, sortDir);
	};

	// ↕️ Đổi hướng sắp xếp
	const toggleSortDir = () => {
		// setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
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
						<SelectTrigger className="w-[160px]">
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

					<Button
						onClick={toggleSortDir}
						className="group size-10 bg-greenly hover:bg-yelly cursor-pointer rounded-full flex items-center justify-center transition-all duration-300"
					>
						{sortDir === "asc" ? (
							<Icon
								icon="lucide:arrow-up"
								className="size-5 text-white group-hover:text-black"
							/>
						) : (
							<Icon
								icon="lucide:arrow-down"
								className="size-5 text-white group-hover:text-black"
							/>
						)}
					</Button>
				</div>

				<Button
					onClick={() => router.push("/products/add")}
					className="bg-greenly hover:bg-yelly text-white flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-300"
				>
					<Icon icon="lucide:plus" className="size-5" />
					Thêm sản phẩm
				</Button>
			</div>

			<h2>Danh sách sản phẩm</h2>
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
						{Math.min((page + 1) * size, totalElements)} trong tổng số {totalElements}{" "}
						mục
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
