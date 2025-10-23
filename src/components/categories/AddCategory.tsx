"use client";

import React, { useState } from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	CategoryRequest,
	CategoryResponse,
} from "@/lib/services/categoryService";
import { useCategories } from "@/hook/useCategories";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { Plus } from "lucide-react";

interface AddCategoryProps {
	onCreate: (newCategory: CategoryResponse) => void;
}

export const AddCategory: React.FC<AddCategoryProps> = ({ onCreate }) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const { createCategory } = useCategories();
	console.log(loading);
	const handleCreate = async (
		data: CategoryRequest,
		imageFile?: File | null
	) => {
		try {
			console.log("+request: ", data);
			console.log("+image", imageFile);
			setLoading(true);
			const newCategory = await createCategory(data, imageFile);
			onCreate?.(newCategory);
			setOpen(false);
		} catch (err) {
			console.error("❌ Failed to create category:", err);
		} finally {
			setLoading(false);
		}
	};
	const handleOpen = () => {
		setOpen(true);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button
					onClick={handleOpen}
					className="bg-transparent flex items-center gap-1.5 h-9 border border-gray-300 rounded-full px-2 py-1 text-gray-700 cursor-pointer"
				>
					<Plus className="size-4" />
					<p className="text-sm">Thêm danh mục</p>
				</button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Thêm danh mục mới</DialogTitle>
				</DialogHeader>
				<CategoryForm onSubmit={handleCreate} />
			</DialogContent>
		</Dialog>
	);
};
