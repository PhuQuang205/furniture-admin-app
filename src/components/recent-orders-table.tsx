import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Order } from "@/lib/services/dashboardService";
import { PaginationFooter } from "@/components/PaginationFooter";

interface PropsRecentOrders {
	recentOrders: Order[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
	setPage?: (page: number) => void;
	refesh: (page?: number) => void;
}

export function RecentOrdersTable({
	recentOrders,
	page,
	size,
	totalElements,
	totalPages,
	setPage,
  refesh
}: PropsRecentOrders) {
	return (
		<Card className="border-2 shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between pb-4">
				<CardTitle>Đơn hàng gần đây</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b">
								<th className="text-left py-3 px-2 font-medium text-muted-foreground">
									ID
								</th>
								<th className="text-left py-3 px-2 font-medium text-muted-foreground">
									Order Time
								</th>
								<th className="text-left py-3 px-2 font-medium text-muted-foreground">
									Customer
								</th>
								<th className="text-left py-3 px-2 font-medium text-muted-foreground">
									Email
								</th>
								<th className="text-left py-3 px-2 font-medium text-muted-foreground">
									Phone
								</th>
								<th className="text-left py-3 px-2 font-medium text-muted-foreground">
									Address
								</th>
								<th className="text-left py-3 px-2 font-medium text-muted-foreground">
									Total
								</th>
								<th className="text-left py-3 px-2 font-medium text-muted-foreground">
									Payment
								</th>
								<th className="text-left py-3 px-2 font-medium text-muted-foreground">
									Status
								</th>
							</tr>
						</thead>
						<tbody>
							{recentOrders.map((order) => (
								<tr key={order.id} className="border-b hover:bg-muted/50">
									<td className="py-3 px-2 font-mono text-xs">{order.id}</td>
									<td className="py-3 px-2 text-muted-foreground text-xs">
										{new Date(order.orderTime).toLocaleString("vi-VN")}
									</td>
									<td className="py-3 px-2">
										{order.firstName} {order.lastName}
									</td>
									<td className="py-3 px-2 text-muted-foreground text-xs">
										{order.email}
									</td>
									<td className="py-3 px-2 text-muted-foreground text-xs">
										{order.phoneNumber}
									</td>
									<td className="py-3 px-2 text-muted-foreground text-xs">
										{order.addressLine}, {order.wardName}, {order.provinceName}
									</td>
									<td className="py-3 px-2 font-semibold">
										{Number(order.total).toLocaleString("vi-VN")}₫
									</td>
									<td className="py-3 px-2 text-xs">{order.paymentMethod}</td>
									<td className="py-3 px-2">
										<div className="flex items-center gap-2">
											<CheckCircle2
												className={`w-4 h-4 ${
													order.paymentStatus === "PAID"
														? "text-green-600"
														: "text-blue-600"
												}`}
											/>
											<span
												className={
													order.status === "COMPLETED"
														? "text-green-600"
														: order.status === "PROCESSING"
														? "text-blue-600"
														: order.status === "CANCELLED"
														? "text-red-600"
														: "text-gray-600"
												}
											>
												{order.status}
											</span>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<PaginationFooter
					label="Đơn hàng gần đây"
					size={size}
					page={page}
					totalElements={totalElements}
					totalPages={totalPages}
					onPageChange={(newPage) => {
						setPage?.(newPage);
            refesh(newPage)
					}}
				/>
			</CardContent>
		</Card>
	);
}
