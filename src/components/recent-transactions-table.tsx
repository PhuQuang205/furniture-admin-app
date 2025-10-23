"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { BestSellingProduct } from "@/lib/services/dashboardService";

interface RecentTransactionsTableProps {
	bestSellingProducts?: BestSellingProduct[];
}

export function RecentTransactionsTable({
	bestSellingProducts = [],
}: RecentTransactionsTableProps) {
	return (
		<Card className="border-0 shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between pb-4">
				<CardTitle>Best Selling Products</CardTitle>
				<a href="#" className="text-sm text-primary hover:underline">
					View All
				</a>
			</CardHeader>

			<CardContent>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b">
								<th className="text-left py-3 px-2 font-medium text-muted-foreground">Image</th>
								<th className="text-left py-3 px-2 font-medium text-muted-foreground">Product Name</th>
								<th className="text-left py-3 px-2 font-medium text-muted-foreground">Product ID</th>
								<th className="text-left py-3 px-2 font-medium text-muted-foreground">Sold</th>
							</tr>
						</thead>
						<tbody>
							{bestSellingProducts.length > 0 ? (
								bestSellingProducts.map((product) => (
									<tr key={product.productId} className="border-b hover:bg-muted/50">
										<td className="py-3 px-2">
											<Image
												src={product.mainImageUrl}
												alt={product.productName}
												width={48}
												height={48}
												className="rounded-md object-cover"
											/>
										</td>
										<td className="py-3 px-2 font-medium">{product.productName}</td>
										<td className="py-3 px-2 text-muted-foreground font-mono text-xs">
											#{product.productId}
										</td>
										<td className="py-3 px-2 font-semibold text-blue-600">
											{product.totalQuantity}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={4} className="py-6 text-center text-muted-foreground">
										No best-selling products yet
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
