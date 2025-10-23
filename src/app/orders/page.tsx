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
import React from "react";
import { OrderManagement } from "@/components/orders/OrderManagement";

type BreadcrumbItemType = {
	label: string;
	href?: string;
};

const OrderPage = () => {
	const breadcrumbs: BreadcrumbItemType[] = [
		{
			label: "Dashboard",
			href: "/",
		},
		{
			label: "Quản lý đơn hàng",
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
					<OrderManagement />
				</div>
			</MasterLayout>
		</>
	);
};

export default OrderPage;
