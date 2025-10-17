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
import MasterLayout from "@/masterLayout/MasterLayout";
import AddProductForm from "@/components/products/AddProductForm";



type BreadcrumbItemType = {
	label: string;
	href?: string;
};

const breadcrumbs: BreadcrumbItemType[] = [
	{
		label: "Dashboard",
		href: "/",
	},
	{
		label: "Quản lý sản phẩm",
    href: "/products"
	},
  {
    label: "Thêm sản phẩm"
  }
];

const AddNewProduct = () => {
	return (
		<MasterLayout>
			<div className="p-6 space-y-6">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-semibold">Danh sách sản phẩm</h1>
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
				<AddProductForm/>
			</div>
		</MasterLayout>
	);
};

export default AddNewProduct;
