"use client";

import { useState, useEffect, useMemo } from "react";
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
import { PaginationFooter } from "@/components/PaginationFooter";
import { cn } from "@/lib/utils";

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
		setPage,
		totalElements,
		totalPages,
		fetchCategories,
		updateStatus,
		deleteCategory,
	} = useCategories();

	useEffect(() => {
		fetchCategories(0);
	}, [fetchCategories]);

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

	const handleSortChange = (field: string) => {
		setSortField(field);
		sortCategories(field, sortDir);
	};

	const toggleSortDir = () => {
		const newDir = sortDir === "asc" ? "desc" : "asc";
		setSortDir(newDir);
		sortCategories(sortField, newDir);
	};

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
			<div className="flex justify-between items-center gap-4">
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center gap-2">
						<SearchInput
							placeholder="Tìm kiếm danh mục..."
							onSearch={handleSearch}
							initialValue={keyword}
						/>
						<Select value={sortField} onValueChange={handleSortChange}>
							<SelectTrigger className="w-[140px] rounded-full border-gray-300 py-1">
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
			<CategoryTable
				categoriesPage={categoryPage}
				loading={loading}
				updateStatus={updateStatus}
				onPageChange={handlePageChange}
				onDelete={handleDelete}
			/>
			<PaginationFooter
				onPageChange={(newPage) => {
					setPage(newPage);
					fetchCategories(newPage, keyword, sortField, sortDir);
				}}
				label="danh mục"
				page={page}
				size={size}
				totalElements={totalElements}
				totalPages={totalPages}
			/>
		</>
	);
};
