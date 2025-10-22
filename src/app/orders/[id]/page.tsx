"use client";
import Link from "next/link";
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";
import { useParams } from "next/navigation";
import { useOrders } from "@/hook/useOrder";
import React, { useEffect } from "react";
import { OrderDetail } from "@/components/orders/OrderDetail";

type BreadcrumbItemType = {
	label: string;
	href?: string;
};

const OrderDetailPage = () => {
	const { id } = useParams();
	const { selectedOrder, fetchOrderById } = useOrders();

	useEffect(() => {
		if (id) {
			fetchOrderById(Number(id));
		}
	}, [id, fetchOrderById]);

	const breadcrumbs: BreadcrumbItemType[] = [
		{
			label: "Dashboard",
			href: "/",
		},
		{
			label: "Quản lý đơn hàng",
			href: "/orders",
		},
		{
			label: `#${selectedOrder?.id}`,
		},
	];
	return (
		<>
			<MasterLayout>
				<div className="p-6 space-y-6">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-semibold">Danh sách đơn hàng</h1>
						<Breadcrumb>
							<BreadcrumbList>
								{breadcrumbs.map((item, index) => {
									const isLast = index === breadcrumbs.length - 1;
									return (
										<React.Fragment key={index}>
											<BreadcrumbItem>
												{item.href && !isLast ? (
													<BreadcrumbLink asChild>
														<Link href={item.href}>{item.label}</Link>
													</BreadcrumbLink>
												) : (
													<BreadcrumbPage>{item.label}</BreadcrumbPage>
												)}
											</BreadcrumbItem>

											{!isLast && <BreadcrumbSeparator />}
										</React.Fragment>
									);
								})}
							</BreadcrumbList>
						</Breadcrumb>
					</div>
					{selectedOrder && <OrderDetail selectedOrder={selectedOrder} />}
				</div>
			</MasterLayout>
		</>
	);
};

export default OrderDetailPage;
