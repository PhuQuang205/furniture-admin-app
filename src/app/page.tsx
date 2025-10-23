import MasterLayout from "@/masterLayout/MasterLayout";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Dashboard } from "@/components/DashBoard";

export const metadata = {
	title: "WowDash NEXT JS - Admin Dashboard Multipurpose Bootstrap 5 Template",
	description:
		"Wowdash NEXT JS is a developer-friendly, ready-to-use admin template designed for building attractive, scalable, and high-performing web applications.",
};

const Page = () => {
	return (
		<>
			<MasterLayout>
				<div className="space-y-8">
					<Breadcrumb>
						<BreadcrumbItem>
							<BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
						</BreadcrumbItem>
					</Breadcrumb>
					<Dashboard />
				</div>
			</MasterLayout>
		</>
	);
};

export default Page;
