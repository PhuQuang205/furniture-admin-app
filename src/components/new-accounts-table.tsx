import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewCustomer } from "@/lib/services/dashboardService";

interface PropsNewCustomers {
	newCustomers: NewCustomer[];
}

export function NewAccountsTable({ newCustomers }: PropsNewCustomers) {
	return (
		<Card className="border-2 shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between pb-4">
				<CardTitle>Khách hàng mới</CardTitle>				
			</CardHeader>
			<CardContent>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b">
								<th className="text-left py-3 px-2 font-medium text-muted-foreground">ID</th>
								<th className="text-left py-3 px-2 font-medium text-muted-foreground">Ngày đăng ký</th>
								<th className="text-left py-3 px-2 font-medium text-muted-foreground">Tên khách hàng</th>
								<th className="text-left py-3 px-2 font-medium text-muted-foreground">Email</th>
								<th className="text-left py-3 px-2 font-medium text-muted-foreground">Trạng thái</th>
							</tr>
						</thead>
						<tbody>
							{newCustomers.length > 0 ? (
								newCustomers.map((customer) => (
									<tr key={customer.id} className="border-b hover:bg-muted/50">
										<td className="py-3 px-2 font-mono text-xs">{customer.id}</td>
										<td className="py-3 px-2 text-muted-foreground">
											{new Date(customer.registrationDate).toLocaleDateString("vi-VN")}
										</td>
										<td className="py-3 px-2 flex items-center gap-2">
											{customer.avatarUrl ? (
												// eslint-disable-next-line @next/next/no-img-element
												<img
													src={customer.avatarUrl}
													alt={customer.fullName}
													className="w-8 h-8 rounded-full object-cover"
												/>
											) : (
												<div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
													{customer.fullName.charAt(0).toUpperCase()}
												</div>
											)}
											<span>{customer.fullName}</span>
										</td>
										<td className="py-3 px-2 text-muted-foreground">{customer.email}</td>
										<td className="py-3 px-2">
											<span
												className={`px-2 py-1 rounded text-xs font-medium ${
													customer.verified
														? "bg-green-100 text-green-700"
														: "bg-yellow-100 text-yellow-700"
												}`}
											>
												{customer.verified ? "Đã xác minh" : "Chưa xác minh"}
											</span>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={5} className="py-4 text-center text-muted-foreground">
										Không có khách hàng mới.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	);
}
