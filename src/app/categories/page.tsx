import { CategoryManagement } from "@/components/categories/CategoryManagement";
import MasterLayout from "@/masterLayout/MasterLayout";
import React from "react";
import Link from "next/link";
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";

type BreadcrumbItemType = {
	label: string;
	href?: string;
};

const CategoriesPage = () => {
	const breadcrumbs: BreadcrumbItemType[] = [
		{
			label: "Dashboard",
			href: "/",
		},
		{
			label: "Quản lý danh mục sản phẩm",
		},
	];
	return (
		<MasterLayout>
			<div className="p-6 space-y-6">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-semibold">Danh sách danh mục sản phẩm</h1>
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
				<CategoryManagement />
			</div>
		</MasterLayout>
	);
};

export default CategoriesPage;
