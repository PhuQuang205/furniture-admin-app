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
import React, { useEffect, useState } from "react";
import { ProductDetail } from "@/components/products/ProductDetail";
import { useParams } from "next/navigation";
import { useProducts } from "@/hook/useProduct";
import { ProductResponse } from "@/lib/services/productService";

type BreadcrumbItemType = {
	label: string;
	href?: string;
};

const DetailProduct = () => {
	const { id } = useParams();
	const { fetchProductById } = useProducts();
	const [product, setProduct] = useState<ProductResponse | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!id) return;
		const getData = async () => {
			try {
				const data = await fetchProductById(Number(id));
				setProduct(data);
			} catch (error) {
				console.error("❌ Lỗi khi lấy sản phẩm:", error);
			} finally {
				setLoading(false);
			}
		};
		getData();
	}, [id, fetchProductById]);

	const breadcrumbs: BreadcrumbItemType[] = [
		{
			label: "Dashboard",
			href: "/",
		},
		{
			label: "Quản lý sản phẩm",
			href:"/products"
		},
		{
			label: `${product?.name}`,
		},
	];
	return (
		<>
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
					{product && <ProductDetail product={product} />}
				</div>
			</MasterLayout>
		</>
	);
};

export default DetailProduct;
