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

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

const TABLE_HEADER = ["HÌNH ẢNH", "TÊN", "ALIAS", "TRẠNG THÁI"];

export const CategoryTable = ({
	categoriesPage,
	loading,
	updateStatus,
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
						<TableHead className="w-[30px] text-greenly font-bold">ID</TableHead>
						{TABLE_HEADER.map((item, i) => (
							<TableHead key={i} className="text-greenly font-bold">{item}</TableHead>
						))}
						<TableHead></TableHead>
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
									<button
										onClick={() => updateStatus(cat.id, !cat.enabled)}
										className={`w-20 rounded-full py-1 cursor-pointer ${
											cat.enabled
												? "text-green-700 bg-green-200 border border-green-500"
												: "bg-gray-200 text-gray-500 border border-gray-500"
										}`}
									>
										{cat.enabled ? "Enabled" : "Disabled"}
									</button>
								</TableCell>

								<TableCell className="text-right flex justify-end gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											router.push(`/categories/${cat.id}`);
										}}
										className="p-2"
									>
										Xem chi tiết
									</Button>

									<AlertDialog>
										<AlertDialogTrigger asChild>
											<button className="p-2 hover:scale-130 transition-all duration-200 cursor-pointer">
												<Icon
													icon="lucide:trash-2"
													className="size-4 text-red-500"
												/>
											</button>
										</AlertDialogTrigger>

										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													Xác nhận xóa danh mục
												</AlertDialogTitle>
												<AlertDialogDescription>
													Bạn có chắc chắn muốn xóa danh mục <b>{cat.name}</b>{" "}
													không? <br />
													Hành động này không thể hoàn tác và tất cả dữ liệu
													liên quan đến danh mục này sẽ bị xóa vĩnh viễn.
												</AlertDialogDescription>
											</AlertDialogHeader>

											<AlertDialogFooter>
												<AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
												<AlertDialogAction
													onClick={() => onDelete?.(cat.id)}
													className="bg-red-600 hover:bg-red-700 text-white"
												>
													Xóa
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
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
