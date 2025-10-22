"use client";

import { Card } from "@/components/ui/card";
import { ShoppingCart, Truck, MapPin } from "lucide-react";

import { OrderResponse } from "@/lib/services/orderService";

interface PropsOrderDetail {
	selectedOrder: OrderResponse;
}

export const OrderDetail = ({ selectedOrder }: PropsOrderDetail) => {
	if (!selectedOrder) {
		return (
			<main className="min-h-screen flex items-center justify-center">
				<p className="text-muted-foreground text-sm">
					Đang tải thông tin đơn hàng...
				</p>
			</main>
		);
	}

	const { details, orderTracks } = selectedOrder;

	// 🟢 Tạo các bước trạng thái từ orderTracks
	const steps = orderTracks.map((track, index) => ({
		number: index + 1,
		label: track.status.replace(/_/g, " "),
		completed:
			index < orderTracks.length - 1 || selectedOrder.status === track.status,
		date: new Date(track.updatedTime).toLocaleString("vi-VN"),
		notes: track.notes,
	}));

	return (
		<main className="min-h-screen bg-background p-8">
			<div className="max-w-7xl mx-auto">
				{/* 🟢 Thanh tiến trình đơn hàng */}
				<div className="mb-12">
					<div className="flex items-center justify-center gap-8">
						{steps.map((step, index) => (
							<div key={step.number} className="flex items-center gap-8">
								<div className="flex flex-col items-center gap-2">
									<div
										className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
											step.completed ? "bg-blue-500" : "bg-gray-300"
										}`}
									>
										{step.number}
									</div>
									<span className="text-xs font-semibold text-gray-600 whitespace-nowrap">
										{step.label}
									</span>
									<span className="text-[10px] text-muted-foreground">
										{step.date}
									</span>
								</div>
								{index < steps.length - 1 && (
									<div
										className={`w-24 h-1 ${
											step.completed ? "bg-blue-500" : "bg-gray-300"
										}`}
									/>
								)}
							</div>
						))}
					</div>
				</div>

				{/* 🟢 Bảng sản phẩm & Tổng tiền */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
					{/* Sản phẩm */}
					<div className="lg:col-span-2">
						<Card className="p-6">
							<h2 className="text-lg font-semibold mb-6 text-foreground">
								Sản phẩm trong đơn #{selectedOrder.id}
							</h2>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-b border-border">
											<th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
												Hình ảnh
											</th>
											<th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
												Tên sản phẩm
											</th>
											<th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
												Số lượng
											</th>
											<th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
												Giá
											</th>
											<th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
												Tổng
											</th>
										</tr>
									</thead>
									<tbody>
										{details.map((product, index) => (
											<tr
												key={index}
												className="border-b border-border hover:bg-muted/50"
											>
												<td className="py-3 px-4">
													<img
														src={product.imageUrl}
														alt={product.productName}
														className="w-16 h-16 object-cover rounded-md"
													/>
												</td>
												<td className="py-4 px-4 text-sm text-foreground">
													{product.productName}
												</td>
												<td className="py-4 px-4 text-sm text-foreground">
													{product.quantity}
												</td>
												<td className="py-4 px-4 text-sm text-foreground">
													{product.price.toLocaleString("vi-VN")}₫
												</td>
												<td className="py-4 px-4 text-sm font-medium text-foreground">
													{(product.price * product.quantity).toLocaleString(
														"vi-VN"
													)}
													₫
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</Card>
					</div>

					{/* Tổng tiền */}
					<div>
						<Card className="p-6">
							<h2 className="text-lg font-semibold mb-6 text-foreground">
								Tổng đơn hàng
							</h2>
							<div className="space-y-4">
								<div className="flex justify-between">
									<span className="text-sm text-muted-foreground">
										Tạm tính:
									</span>
									<span className="text-sm text-foreground">
										{selectedOrder.productCost.toLocaleString("vi-VN")}₫
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm text-muted-foreground">
										Phí giao hàng:
									</span>
									<span className="text-sm text-foreground">
										{selectedOrder.shippingCost.toLocaleString("vi-VN")}₫
									</span>
								</div>
								<div className="flex justify-between font-semibold">
									<span className="text-sm">Tổng cộng:</span>
									<span className="text-sm text-foreground">
										{selectedOrder.total.toLocaleString("vi-VN")}₫
									</span>
								</div>
							</div>
						</Card>
					</div>
				</div>

				{/* 🟢 Thông tin giao hàng, thanh toán, giao nhận */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Địa chỉ giao hàng */}
					<Card className="p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-base font-semibold text-foreground flex items-center gap-2">
								<MapPin className="w-5 h-5" />
								Thông tin giao hàng
							</h3>
						</div>
						<div className="space-y-2 text-sm text-muted-foreground">
							<p className="font-medium text-foreground">
								{selectedOrder.firstName} {selectedOrder.lastName}
							</p>
							<p>{selectedOrder.addressLine}</p>
							<p>
								{selectedOrder.wardName}, {selectedOrder.provinceName}
							</p>
							<p>SĐT: {selectedOrder.phoneNumber}</p>
							<p>Email: {selectedOrder.email}</p>
						</div>
					</Card>

					{/* Thanh toán */}
					<Card className="p-6">
						<h3 className="text-base font-semibold text-foreground mb-4">
							Thông tin thanh toán
						</h3>
						<div className="space-y-3 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Phương thức:</span>
								<span className="text-foreground font-medium">
									{selectedOrder.paymentMethod}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Trạng thái:</span>
								<span className="text-foreground font-medium">
									{selectedOrder.paymentStatus}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Ngày đặt:</span>
								<span className="text-foreground font-medium">
									{new Date(selectedOrder.orderTime).toLocaleString("vi-VN")}
								</span>
							</div>
						</div>
					</Card>

					{/* Thông tin vận chuyển */}
					<Card className="p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-base font-semibold text-foreground flex items-center gap-2">
								<Truck className="w-5 h-5" />
								Thông tin vận chuyển
							</h3>
						</div>
						<div className="flex flex-col items-center justify-center py-6">
							<ShoppingCart className="w-12 h-12 text-muted-foreground mb-4" />
							<p className="text-sm font-medium text-foreground mb-4">
								Trạng thái: {selectedOrder.status}
							</p>
							<div className="text-sm text-muted-foreground text-center">
								<p>
									Giao hàng trong:{" "}
									{selectedOrder.deliverDays
										? `${selectedOrder.deliverDays} ngày`
										: "Đang xử lý"}
								</p>
								{selectedOrder.deliverDate && (
									<p>
										Ngày giao dự kiến:{" "}
										{new Date(selectedOrder.deliverDate).toLocaleDateString(
											"vi-VN"
										)}
									</p>
								)}
							</div>
						</div>
					</Card>
				</div>
			</div>
		</main>
	);
};
