"use client";

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
import { useOrders } from "@/hook/useOrder";
import {
	OrderStatus,
	OrderResponse,
	ORDER_STATUS_LABELS,
} from "@/lib/services/orderService";
import { useEffect, useState } from "react";

interface OrderTableProps {
	orders: OrderResponse[];
	loading: boolean;
}

const TABLE_HEADERS = [
	"KHÁCH HÀNG",
	"EMAIL",
	"SĐT",
	"ĐỊA CHỈ",
	"TỔNG TIỀN",
	"NGÀY ĐẶT",
	"THANH TOÁN",
	"TRẠNG THÁI",
];

export const OrderTable = ({ orders, loading }: OrderTableProps) => {
	const router = useRouter();
	const { approveReturn, rejectReturn, updateOrderStatus } = useOrders();
	const [localOrders, setLocalOrders] = useState<OrderResponse[]>([]);

	// Cập nhật localOrders mỗi khi props orders thay đổi
	useEffect(() => {
		setLocalOrders(orders);
	}, [orders]);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleString("vi-VN");
	};

	const formatCurrency = (value: number | string) =>
		Number(value).toLocaleString("vi-VN") + " ₫";

	// 🚚 Chuyển trạng thái đơn hàng sang bước tiếp theo
	const handleNextStep = async (id: number, currentStatus: OrderStatus) => {
		const transitions: Partial<Record<OrderStatus, OrderStatus>> = {
			NEW: "PROCESSING",
			PROCESSING: "PACKAGED",
			PACKAGED: "PICKED",
			PICKED: "SHIPPING",
			SHIPPING: "DELIVERED",
		};

		const nextStatus = transitions[currentStatus];
		if (!nextStatus) return;

		// ✅ Cập nhật tạm trên UI trước (optimistic update)
		setLocalOrders((prev) =>
			prev.map((order) =>
				order.id === id ? { ...order, status: nextStatus } : order
			)
		);

		try {
			await updateOrderStatus(id, {
				status: nextStatus,
				notes: `Chuyển trạng thái sang ${ORDER_STATUS_LABELS[nextStatus]}`,
			});
			console.log(`✅ Order ${id} cập nhật thành ${nextStatus}`);
		} catch (err) {
			console.error("❌ Update failed:", err);
			// 🔁 Rollback UI nếu API lỗi
			setLocalOrders((prev) =>
				prev.map((order) =>
					order.id === id ? { ...order, status: currentStatus } : order
				)
			);
		}
	};

	return (
		<div className="border rounded-lg overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow className="bg-yelly rounded-3xl">
						<TableHead className="w-[30px] text-greenly font-bold">ID</TableHead>
						{TABLE_HEADERS.map((item, i) => (
							<TableHead key={i} className="text-greenly font-bold">{item}</TableHead>
						))}
						<TableHead></TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{loading ? (
						<TableRow>
							<TableCell colSpan={10} className="text-center py-6">
								Đang tải đơn hàng...
							</TableCell>
						</TableRow>
					) : localOrders.length === 0 ? (
						<TableRow>
							<TableCell colSpan={10} className="text-center py-6">
								Không có đơn hàng nào.
							</TableCell>
						</TableRow>
					) : (
						localOrders.map((order) => (
							<TableRow
								key={order.id}
								className="hover:bg-gray-50 transition cursor-pointer"
								onClick={() => router.push(`/orders/${order.id}`)}
							>
								<TableCell>{order.id}</TableCell>
								<TableCell>{`${order.firstName} ${order.lastName}`}</TableCell>
								<TableCell>{order.email}</TableCell>
								<TableCell>{order.phoneNumber}</TableCell>
								<TableCell>
									{order.addressLine}, {order.wardName}, {order.provinceName}
								</TableCell>
								<TableCell>{formatCurrency(order.total)}</TableCell>
								<TableCell>{formatDate(order.orderTime)}</TableCell>
								<TableCell>{order.paymentMethod}</TableCell>
								<TableCell>
									<span
										className={`px-3 py-1 rounded-full text-sm font-medium ${
											order.status === "NEW"
												? "bg-green-100 text-green-700"
												: order.status === "PROCESSING"
												? "bg-blue-100 text-blue-700"
												: order.status === "PACKAGED"
												? "bg-indigo-100 text-indigo-700"
												: order.status === "PICKED"
												? "bg-cyan-100 text-cyan-700"
												: order.status === "SHIPPING"
												? "bg-purple-100 text-purple-700"
												: order.status === "DELIVERED"
												? "bg-emerald-100 text-emerald-700"
												: order.status === "RETURN_REQUESTED"
												? "bg-yellow-100 text-yellow-700"
												: order.status === "CANCELLED"
												? "bg-red-100 text-red-700"
												: "bg-gray-100 text-gray-700"
										}`}
									>
										{ORDER_STATUS_LABELS[order.status] || order.status}
									</span>
								</TableCell>

								<TableCell className="text-right flex justify-end gap-2">
									{/* 🟡 Hoàn trả */}
									{order.status === "RETURN_REQUESTED" && (
										<>
											<Button
												size="sm"
												onClick={(e) => {
													e.stopPropagation();
													approveReturn(order.id);
												}}
												className="bg-greenly hover:bg-greenly/90 text-white"
											>
												Chấp nhận
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={(e) => {
													e.stopPropagation();
													rejectReturn(order.id);
												}}
											>
												Từ chối
											</Button>
										</>
									)}

									{/* 🚚 Cập nhật luồng giao hàng */}
									{[
										"NEW",
										"PROCESSING",
										"PACKAGED",
										"PICKED",
										"SHIPPING",
									].includes(order.status) && (
										<Button
											variant="outline"
											size="sm"
											onClick={(e) => {
												e.stopPropagation();
												handleNextStep(order.id, order.status);
											}}
										>
											Chuyển bước
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
