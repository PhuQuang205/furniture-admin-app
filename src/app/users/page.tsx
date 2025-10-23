"use client";

import MasterLayout from "@/masterLayout/MasterLayout";
import { useAuthorization } from "@/hook/useAuthorization";
import { UserManagement } from "@/components/users/UserManagement";
import { PageHeader } from "@/components/PageHeader";

export default function UserPage() {
	const authorized = useAuthorization(["ROLE_ADMIN", "ROLE_USER_MANAGER"]);
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
					title="Danh sách tài khoản"
					breadcrumbs={[
						{
							label: "Dashboard",
							href: "/",
						},
						{
							label: "Quản lý tài khoản",
						},
					]}
				/>
				<UserManagement />
			</div>
		</MasterLayout>
	);
}
