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
		setProducts,
		fetchProducts,
		loading,
		page,
		totalPages,
	} = useProducts();

	const [sortField, setSortField] = useState<string>("name");
	const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
	const [keyword, setKeyword] = useState("");

	// 🔍 Xử lý tìm kiếm sản phẩm
	const handleSearch = (value: string) => {
		setKeyword(value);
	};

	// 🔄 Đổi cột sắp xếp
	const handleSortChange = (value: string) => {
		setSortField(value);
	};

	// ↕️ Đổi hướng sắp xếp
	const toggleSortDir = () => {
		setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
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
			<ProductTable products={products} loading={loading} />
		</>
	);
};
