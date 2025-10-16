"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { CategoryResponse } from "@/lib/services/categoryService";
import { useRouter } from "next/navigation";

interface CategoryPage {
	data: CategoryResponse[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
}

interface CategoryTableProps {
	categoriesPage: CategoryPage;
	loading: boolean;
	updateStatus: (id: number, enabled: boolean) => Promise<void>;
	onEdit?: (category: CategoryResponse) => void;
	onDelete?: (id: number) => void;
	onPageChange?: (page: number) => void;
}

export const CategoryTable = ({
	categoriesPage,
	loading,
	updateStatus,
	onEdit,
	onDelete,
	onPageChange,
}: CategoryTableProps) => {
	const router = useRouter();
	const { data = [], page, totalPages } = categoriesPage || {};

	return (
		<div className="border rounded-lg overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow className="rounded-3xl bg-yelly">
						<TableHead className="w-[60px]">ID</TableHead>
						<TableHead>Hình ảnh</TableHead>
						<TableHead>Tên danh mục</TableHead>
						<TableHead>Alias</TableHead>
						<TableHead>Trạng thái</TableHead>
						<TableHead className="text-right">Hành động</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{loading ? (
						<TableRow>
							<TableCell colSpan={6} className="text-center py-6">
								Đang tải danh mục...
							</TableCell>
						</TableRow>
					) : data.length === 0 ? (
						<TableRow>
							<TableCell colSpan={6} className="text-center py-6">
								Không có danh mục nào.
							</TableCell>
						</TableRow>
					) : (
						data.map((cat) => (
							<TableRow key={cat.id}>
								<TableCell>{cat.id}</TableCell>

								<TableCell>
									<Image
										src={
											cat.image ||
											"https://i.pinimg.com/1200x/c8/5d/ff/c85dff8cce46b91fc7886dc1d8b24224.jpg"
										}
										alt={cat.name}
										width={60}
										height={60}
										className="w-12 h-12 rounded-full object-cover"
										loading="lazy"
									/>
								</TableCell>

								<TableCell className="font-medium">{cat.name}</TableCell>
								<TableCell>{cat.alias}</TableCell>

								<TableCell>
									<Button
										variant="outline"
										onClick={() => updateStatus(cat.id, !cat.enabled)}
										className={`min-w-[90px] cursor-pointer ${
											cat.enabled
												? "bg-greenly text-white hover:bg-greenly/90 hover:text-white"
												: "bg-gray-400 text-black hover:bg-gray-400/90"
										}`}
									>
										{cat.enabled ? "Enabled" : "Disabled"}
									</Button>
								</TableCell>

								<TableCell className="text-right flex justify-end gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => {router.push(`/categories/${cat.id}`)}}
										className="p-2"
									>
										Xem chi tiết
									</Button>

									<Button
										variant="destructive"
										size="sm"
										onClick={() => onDelete?.(cat.id)}
										className="p-2"
									>
										<Icon
											icon="lucide:trash-2"
											className="size-4 text-red-500"
										/>
									</Button>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

			{/* Pagination */}
			{!loading && totalPages > 1 && (
				<div className="flex justify-between items-center p-4 border-t bg-gray-50">
					<Button
						variant="outline"
						disabled={page === 0}
						onClick={() => onPageChange?.(page - 1)}
					>
						← Trước
					</Button>

					<p>
						Trang <b>{page + 1}</b> / {totalPages}
					</p>

					<Button
						variant="outline"
						disabled={page + 1 >= totalPages}
						onClick={() => onPageChange?.(page + 1)}
					>
						Tiếp →
					</Button>
				</div>
			)}
		</div>
	);
};
