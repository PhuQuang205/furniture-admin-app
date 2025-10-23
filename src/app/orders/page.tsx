import MasterLayout from "@/masterLayout/MasterLayout";
import { OrderManagement } from "@/components/orders/OrderManagement";
import { PageHeader } from "@/components/PageHeader";

const OrderPage = () => {
	return (
		<>
			<MasterLayout>
				<div className="space-y-8">
					<PageHeader
						title="Danh sách đơn hàng"
						breadcrumbs={[
							{
								label: "Dashboard",
								href: "/",
							},
							{
								label: "Quản lý đơn hàng",
							},
						]}
					/>
					<OrderManagement />
				</div>
			</MasterLayout>
		</>
	);
};

export default OrderPage;
