"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { CustomerResponse } from "@/lib/services/customerService";
import { useCustomers } from "@/hook/useCustomers";

interface CustomerTableProps {
	customers: CustomerResponse[];
	loading: boolean;
}

export const CustomerTable = ({ customers, loading }: CustomerTableProps) => {
	const { updateCustomerStatus } = useCustomers();

	return (
		<div className="border rounded-lg overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow className="bg-yelly rounded-3xl">
						<TableHead className="w-[60px] text-center">ID</TableHead>
						<TableHead>Ảnh đại diện</TableHead>
						<TableHead>Họ và tên</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Số điện thoại</TableHead>
						<TableHead>Xác thực</TableHead>
						<TableHead>Trạng thái</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{/* 🌀 Loading */}
					{loading ? (
						<TableRow>
							<TableCell colSpan={7} className="text-center py-6">
								Đang tải danh sách khách hàng...
							</TableCell>
						</TableRow>
					) : customers.length === 0 ? (
						<TableRow>
							<TableCell colSpan={7} className="text-center py-6">
								Không có khách hàng nào.
							</TableCell>
						</TableRow>
					) : (
						customers.map((c) => (
							<TableRow key={c.id}>
								<TableCell className="text-center">{c.id}</TableCell>

								<TableCell>
									<Image
										src={
											c.avatarUrl ||
											"https://i.pinimg.com/1200x/c8/5d/ff/c85dff8cce46b91fc7886dc1d8b24224.jpg"
										}
										alt={c.firstName + " " + c.lastName}
										width={48}
										height={48}
										className="w-12 h-12 rounded-full object-cover"
									/>
								</TableCell>

								<TableCell className="font-medium">
									{c.firstName} {c.lastName}
								</TableCell>

								<TableCell>{c.email}</TableCell>

								<TableCell>{c.phoneNumber || "—"}</TableCell>

								<TableCell>
									{c.verified ? (
										<span className="text-green-600 font-medium">Đã xác thực</span>
									) : (
										<span className="text-gray-500 italic">Chưa xác thực</span>
									)}
								</TableCell>

								<TableCell>
									<Button
										variant="outline"
										onClick={() => updateCustomerStatus(c.id, !c.enabled)}
										className={`min-w-[90px] ${
											c.enabled
												? "bg-greenly text-white hover:bg-greenly/90"
												: "bg-gray-400 text-black hover:bg-gray-400/90"
										}`}
									>
										{c.enabled ? "Đang bật" : "Đang tắt"}
									</Button>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
};
