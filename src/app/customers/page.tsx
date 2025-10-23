import MasterLayout from "@/masterLayout/MasterLayout";
import { CustomerManagement } from "@/components/customers/CustomerManagement";
import { PageHeader } from "@/components/PageHeader";

const CustomersPage = () => {
	return (
		<MasterLayout>
			<div className="space-y-8">
				<PageHeader
					title="Danh sách khách hàng"
					breadcrumbs={[
						{
							label: "Dashboard",
							href: "/",
						},
						{
							label: "Quản lý khách hàng",
						},
					]}
				/>
				<CustomerManagement />
			</div>
		</MasterLayout>
	);
};

export default CustomersPage;
