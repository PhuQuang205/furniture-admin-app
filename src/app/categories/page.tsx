import { CategoryManagement } from "@/components/categories/CategoryManagement";
import MasterLayout from "@/masterLayout/MasterLayout";
import { PageHeader } from "@/components/PageHeader";

const CategoriesPage = () => {
	return (
		<MasterLayout>
			<div className="space-y-8">
				<PageHeader
					title="Danh sách danh mục sản phẩm"
					breadcrumbs={[
						{
							label: "Dashboard",
							href: "/",
						},
						{
							label: "Quản lý danh mục sản phẩm",
						},
					]}
				/>
				<CategoryManagement />
			</div>
		</MasterLayout>
	);
};

export default CategoriesPage;
