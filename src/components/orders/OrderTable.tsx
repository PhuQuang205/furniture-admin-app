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

interface OrderTableProps {
	orders: OrderResponse[];
	loading: boolean;
}

export const OrderTable = ({ orders, loading }: OrderTableProps) => {
	const router = useRouter();
	const { approveReturn, rejectReturn, updateOrderStatus } = useOrders();

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleString("vi-VN");
	};

	const formatCurrency = (value: number | string) =>
		Number(value).toLocaleString("vi-VN") + " ₫";

	// 🚚 Cập nhật trạng thái theo thứ tự luồng giao hàng
	const handleNextStep = (id: number, currentStatus: OrderStatus) => {
		const transitions: Partial<Record<OrderStatus, OrderStatus>> = {
			NEW: "PROCESSING",
			PROCESSING: "PACKAGED",
			PACKAGED: "PICKED",
			PICKED: "SHIPPING",
			SHIPPING: "DELIVERED",
		};

		const nextStatus = transitions[currentStatus];
		if (nextStatus)
			updateOrderStatus(id, {
				status: nextStatus,
				notes: `Chuyển trạng thái sang ${ORDER_STATUS_LABELS[nextStatus]}`,
			});
	};

	return (
		<div className="border rounded-lg overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow className="bg-yelly rounded-3xl">
						<TableHead className="w-[60px]">ID</TableHead>
						<TableHead>Khách hàng</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>SĐT</TableHead>
						<TableHead>Địa chỉ</TableHead>
						<TableHead>Tổng tiền</TableHead>
						<TableHead>Ngày đặt</TableHead>
						<TableHead>Thanh toán</TableHead>
						<TableHead>Trạng thái</TableHead>
						<TableHead className="text-right">Hành động</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{loading ? (
						<TableRow>
							<TableCell colSpan={10} className="text-center py-6">
								Đang tải đơn hàng...
							</TableCell>
						</TableRow>
					) : orders.length === 0 ? (
						<TableRow>
							<TableCell colSpan={10} className="text-center py-6">
								Không có đơn hàng nào.
							</TableCell>
						</TableRow>
					) : (
						orders.map((order) => (
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
