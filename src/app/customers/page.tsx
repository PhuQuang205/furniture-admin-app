import MasterLayout from "@/masterLayout/MasterLayout";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import React from "react";
import Link from "next/link";
import { CustomerManagement } from "@/components/customers/CustomerManagement";


type BreadcrumbItemType = {
    label: string;
    href?: string;
};

const CustomersPage = () => {
  const breadcrumbs: BreadcrumbItemType[] = [
		{
			label: "Dashboard",
			href: "/",
		},
		{
			label: "Quản lý khách hàng",
		},
	];
	return (
		<MasterLayout>
			<div className="p-6 space-y-6">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-semibold">Danh sách khách hàng</h1>
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
				<CustomerManagement/>
			</div>
		</MasterLayout>
	);
}

export default CustomersPage