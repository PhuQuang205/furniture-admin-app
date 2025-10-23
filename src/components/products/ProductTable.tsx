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
const TABLE_HEADERS = [
	"HÌNH ẢNH",
	"TÊN SẢN PHẨM",
	"DANH MỤC",
	"GIÁ",
	"TRẠNG THÁI",
];

export const ProductTable = ({
	products,
	loading,
	updateStatus,
	onDelete,
}: ProductTableProps) => {
	const router = useRouter();

	console.log("List danh sách sản phẩm: ", products);
	console.log(updateStatus);
	return (
		<div className="border rounded-lg overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow className="rounded-3xl bg-yelly">
						<TableHead className="w-[30px] text-greenly font-bold">
							ID
						</TableHead>
						{TABLE_HEADERS.map((item, i) => (
							<TableHead key={i} className="text-greenly font-bold">
								{item}
							</TableHead>
						))}
						<TableHead></TableHead>
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
								<TableCell>{prod.price?.toLocaleString("vi-VN")} ₫</TableCell>

								<TableCell>
									{updateStatus && (
										<button
											onClick={() => updateStatus(prod.id, !prod.enabled)}
											className={`w-20 rounded-full py-1 cursor-pointer ${
												prod.enabled
													? "text-green-700 bg-green-200 border border-green-500"
													: "bg-gray-200 text-gray-500 border border-gray-500"
											}`}
										>
											{prod.enabled ? "Enabled" : "Disabled"}
										</button>
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
