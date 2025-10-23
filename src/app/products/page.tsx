import MasterLayout from "@/masterLayout/MasterLayout";
import React from "react";
import { ProductManagement } from "@/components/products/ProductManagement";
import { PageHeader } from "@/components/PageHeader";

const ProductPage = () => {
	return (
		<MasterLayout>
			<div className="space-y-8">
				<PageHeader
					title="Danh sách sản phẩm"
					breadcrumbs={[
						{ label: "Dashboard", href: "/" },
						{ label: "Quản lý sản phẩm" },
					]}
				/>
				<ProductManagement />
			</div>
		</MasterLayout>
	);
};

export default ProductPage;
