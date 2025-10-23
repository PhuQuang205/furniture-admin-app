"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

interface PaginationFooterProps {
	page: number;
	size: number;
	totalPages: number;
	totalElements: number;
	label?: string; // ví dụ: "đơn hàng", "khách hàng"
	onPageChange: (newPage: number) => void;
}

export const PaginationFooter = ({
	page,
	size,
	totalPages,
	totalElements,
	label = "mục",
	onPageChange,
}: PaginationFooterProps) => {
	if (totalPages <= 1) return null;

	return (
		<div className="flex items-center justify-between mt-6">
			{/* Thông tin tổng */}
			<div className="text-sm text-gray-600">
				Hiển thị từ <b>{page * size + 1}</b> đến{" "}
				<b>{Math.min((page + 1) * size, totalElements)}</b> trong tổng số{" "}
				<b>{totalElements}</b> {label}
			</div>

			{/* Các nút điều hướng */}
			<div className="flex items-center gap-1">
				<Button
					variant="ghost"
					size="icon"
					disabled={page === 0}
					onClick={() => onPageChange(0)}
					className="w-8 h-8"
				>
					<Icon icon="lucide:chevrons-left" className="w-4 h-4" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					disabled={page === 0}
					onClick={() => onPageChange(page - 1)}
					className="w-8 h-8"
				>
					<Icon icon="lucide:chevron-left" className="w-4 h-4" />
				</Button>

				{Array.from({ length: totalPages }, (_, i) => (
					<Button
						key={i}
						variant={i === page ? "default" : "ghost"}
						size="icon"
						onClick={() => onPageChange(i)}
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
					onClick={() => onPageChange(page + 1)}
					className="w-8 h-8"
				>
					<Icon icon="lucide:chevron-right" className="w-4 h-4" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					disabled={page + 1 >= totalPages}
					onClick={() => onPageChange(totalPages - 1)}
					className="w-8 h-8"
				>
					<Icon icon="lucide:chevrons-right" className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
};
