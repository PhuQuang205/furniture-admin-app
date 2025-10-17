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
import { useRouter } from "next/navigation";
import { ProductResponse } from "@/lib/services/productService";

interface ProductTableProps {
	products: ProductResponse[]; 
	loading: boolean;
	updateStatus?: (id: number, enabled: boolean) => Promise<void>;
	onDelete?: (id: number) => void;
}

export const ProductTable = ({
	products,
	loading,
	updateStatus,
	onDelete,
}: ProductTableProps) => {
	const router = useRouter();

	return (
		<div className="border rounded-lg overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow className="rounded-3xl bg-yelly">
						<TableHead className="w-[60px]">ID</TableHead>
						<TableHead>Hình ảnh</TableHead>
						<TableHead>Tên sản phẩm</TableHead>
						<TableHead>Danh mục</TableHead>
						<TableHead>Giá</TableHead>
						<TableHead>Trạng thái</TableHead>
						<TableHead className="text-right">Hành động</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{loading ? (
						<TableRow>
							<TableCell colSpan={7} className="text-center py-6">
								Đang tải sản phẩm...
							</TableCell>
						</TableRow>
					) : products.length === 0 ? (
						<TableRow>
							<TableCell colSpan={7} className="text-center py-6">
								Không có sản phẩm nào.
							</TableCell>
						</TableRow>
					) : (
						products.map((prod) => (
							<TableRow key={prod.id}>
								<TableCell>{prod.id}</TableCell>

								<TableCell>
									<Image
										src={
											prod.mainImage?.imageUrl ||
											"https://i.pinimg.com/1200x/c8/5d/ff/c85dff8cce46b91fc7886dc1d8b24224.jpg"
										}
										alt={prod.name}
										width={60}
										height={60}
										className="w-12 h-12 rounded-md object-cover"
										loading="lazy"
									/>
								</TableCell>

								<TableCell className="font-medium">{prod.name}</TableCell>
								<TableCell>{prod.category.name}</TableCell>
								<TableCell>
									{prod.price?.toLocaleString("vi-VN")} ₫
								</TableCell>

								<TableCell>
									{updateStatus && (
										<Button
											variant="outline"
											onClick={() => updateStatus(prod.id, !prod.enabled)}
											className={`min-w-[90px] cursor-pointer ${
												prod.enabled
													? "bg-greenly text-white hover:bg-greenly/90"
													: "bg-gray-400 text-black hover:bg-gray-400/90"
											}`}
										>
											{prod.enabled ? "Enabled" : "Disabled"}
										</Button>
									)}
								</TableCell>

								<TableCell className="text-right flex justify-end gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => router.push(`/products/${prod.id}`)}
										className="p-2"
									>
										Xem chi tiết
									</Button>

									{onDelete && (
										<Button
											variant="destructive"
											size="sm"
											onClick={() => onDelete(prod.id)}
											className="p-2"
										>
											<Icon
												icon="lucide:trash-2"
												className="size-4 text-red-500"
											/>
										</Button>
									)}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
};
