"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
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
import { useCategories } from "@/hook/useCategories";
import { CategoryResponse } from "@/lib/services/categoryService";
import { CategoryTable } from "@/components/categories/CategoryTable";
import { AddCategory } from "@/components/categories/AddCategory";

export const CategoryManagement = () => {
	const [keyword, setKeyword] = useState("");
	const [sortField, setSortField] = useState<string>("name");
	const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

	const {
		categories,
		setCategories,
		loading,
		page,
		size,
		totalElements,
		totalPages,
		fetchCategories,
		updateStatus,
		deleteCategory,
	} = useCategories();

	// 🟢 Load danh mục khi mount
	useEffect(() => {
		fetchCategories(0);
	}, [fetchCategories]);

	// 🔍 Tìm kiếm client-side
	const handleSearch = (kw: string) => {
		setKeyword(kw);

		if (!kw) {
			fetchCategories(page);
		} else {
			const filtered = categories.filter((cat) =>
				cat.name.toLowerCase().includes(kw.toLowerCase())
			);
			setCategories(filtered);
		}
	};

	// 🔽 Thay đổi trường sắp xếp
	const handleSortChange = (field: string) => {
		setSortField(field);
		sortCategories(field, sortDir);
	};

	// 🔄 Đổi chiều sắp xếp
	const toggleSortDir = () => {
		const newDir = sortDir === "asc" ? "desc" : "asc";
		setSortDir(newDir);
		sortCategories(sortField, newDir);
	};

	// ⚙️ Hàm sắp xếp client-side
	const sortCategories = (field: string, dir: "asc" | "desc") => {
		const sorted = [...categories].sort((a, b) => {
			const valA = a[field as keyof CategoryResponse];
			const valB = b[field as keyof CategoryResponse];

			if (typeof valA === "string" && typeof valB === "string") {
				return dir === "asc"
					? valA.localeCompare(valB)
					: valB.localeCompare(valA);
			}
			return 0;
		});
		setCategories(sorted);
	};

	const handlePageChange = (newPage: number) => {
		fetchCategories(newPage);
	};

	const categoryPage = useMemo(
		() => ({
			data: categories,
			page,
			size,
			totalElements,
			totalPages,
		}),
		[categories, page, size, totalElements, totalPages]
	);

	const handleDelete = async (id: number) => {
		await deleteCategory(id);
	};

	return (
		<>
			<div className="flex justify-between items-center gap-4 mb-4">
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center gap-2">
						<SearchInput
							placeholder="Tìm kiếm danh mục..."
							onSearch={handleSearch}
							initialValue={keyword}
							className="flex-1"
						/>
						<Select value={sortField} onValueChange={handleSortChange}>
							<SelectTrigger className="w-[140px]">
								<SelectValue placeholder="Sắp xếp theo" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Cột</SelectLabel>
									<SelectItem value="name">Tên</SelectItem>
									<SelectItem value="alias">Alias</SelectItem>
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
					<AddCategory
						onCreate={(newCategory) =>
							setCategories((prev: CategoryResponse[]) => [
								newCategory,
								...prev,
							])
						}
					/>
				</div>
			</div>

			<h2 className="font-semibold mb-2">Danh sách danh mục</h2>

			<CategoryTable
				categoriesPage={categoryPage}
				loading={loading}
				updateStatus={updateStatus}
				onPageChange={handlePageChange}
				onDelete={handleDelete}
			/>
		</>
	);
};
