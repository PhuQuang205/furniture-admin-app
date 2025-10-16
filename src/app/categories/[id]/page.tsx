"use client";
import React, { useEffect } from "react";
import { DisplayCategory } from "@/components/categories/DisplayCategory";
import MasterLayout from "@/masterLayout/MasterLayout";
import { useParams } from "next/navigation";
import { BreadcrumbItemType } from "@/context";
import { useCategories } from "@/hook/useCategories";
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

const CategoryDetail = () => {
	const { id } = useParams();
	const { fetchCategoryById, selectedCategory } = useCategories();
	
	useEffect(() => {
		if (id) {
			fetchCategoryById(Number(id));
		}
	}, [id, fetchCategoryById]);
	const breadcrumbs: BreadcrumbItemType[] = [
		{
			label: "Dashboard",
			href: "/",
		},
		{
			label: "Quản lý danh mục sản phẩm",
			href: "/categories",
		},
		{
			label: `${selectedCategory?.name}`,
		},
	];
	return (
		<MasterLayout>
			<div className="p-6 space-y-6">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-semibold">Chi tiết sản phẩm</h1>
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
				<div className="py-8 border border-greenly rounded-md"><DisplayCategory /></div>
			</div>
		</MasterLayout>
	);
};

export default CategoryDetail;
