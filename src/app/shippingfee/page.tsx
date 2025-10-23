"use client";

import { useAuthorization } from "@/hook/useAuthorization";
import MasterLayout from "@/masterLayout/MasterLayout";
import { ShippingFeeManagement } from "@/components/shippingfee/ShippingFeeManagement";
import { PageHeader } from "@/components/PageHeader";


const InventoryPage = () => {
	const authorized = useAuthorization(["ROLE_ADMIN"]);
	if (authorized === null) {
		return (
			<div className="flex items-center justify-center h-screen text-muted-foreground">
				Checking authorization...
			</div>
		);
	}

	return (
		<MasterLayout>
			<div className="space-y-8">
				<PageHeader
					title="Danh sách phí ship theo tỉnh"
					breadcrumbs={[
						{
							label: "Dashboard",
							href: "/",
						},
						{
							label: "Quản lý phí ship",
						},
					]}
				/>
				<ShippingFeeManagement />
			</div>
		</MasterLayout>
	);
};

export default InventoryPage;
