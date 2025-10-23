"use client";

import { useAuthorization } from "@/hook/useAuthorization";
import MasterLayout from "@/masterLayout/MasterLayout";
import { InventoryManagement } from "@/components/inventory/InventoryManagement";
import { PageHeader } from "@/components/PageHeader";

const InventoryPage = () => {
	const authorized = useAuthorization(["ROLE_ADMIN", "ROLE_INVENTORY_MANAGER"]);
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
					title="Danh sách sản phẩm trong kho"
					breadcrumbs={[
						{
							label: "Dashboard",
							href: "/",
						},
						{
							label: "Quản lý kho",
						},
					]}
				/>
				<InventoryManagement />
			</div>
		</MasterLayout>
	);
};

export default InventoryPage;
