"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { User } from "@/components/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";

interface UserTableProps {
	users: User[];
	loading: boolean;
	totalElements: number;
	page: number;
	totalPages: number;
	size: number;
	onPageChange: (page: number) => void;
	updateUserStatus(id: number, enabled: boolean): void;
	deleteUser(id: number): void;
	setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export default function UserTable({
	users,
	loading,
	totalElements,
	page,
	totalPages,
	updateUserStatus,
	deleteUser,
	size,
	onPageChange,
}: UserTableProps) {
	const route = useRouter();

	const handleUpdate = (id: number) => {
		route.push(`/users/${id}`)
	}
	return (
		<div className="space-y-4">
			<div className="border rounded-lg overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>Avatar</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>First name</TableHead>
							<TableHead>Last name</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Roles</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={7} className="text-center py-6">
									Loading users...
								</TableCell>
							</TableRow>
						) : users.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className="text-center py-6">
									No users found.
								</TableCell>
							</TableRow>
						) : (
							users.map((user) => (
								<TableRow key={user.id}>
									<TableCell>{user.id}</TableCell>
									<TableCell>
										<Image
											src={
												user.avatarUrl ||
												"https://i.pinimg.com/736x/16/18/20/1618201e616f4a40928c403f222d7562.jpg"
											}
											alt={user.firstName}
											width={500}
											height={500}
											className="w-10 h-10 rounded-full object-cover"
											loading="lazy"
										/>
									</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{user.firstName}</TableCell>
									<TableCell>{user.lastName}</TableCell>
									<TableCell>
										<Button
											variant="outline"
											onClick={() => updateUserStatus(user.id, !user.enabled)}
											className={`${
												user.enabled
													? "bg-blue-500 hover:bg-blue-600" // Disable: xám
													: "bg-gray-400 hover:bg-gray-500" // Enable: xanh dương
											}`}
										>
											{user.enabled ? "Enabled" : "Disable"}
										</Button>
									</TableCell>

									<TableCell>
										{user.roles
											.map((r) =>
												r.name
													.replace(/^ROLE_/, "")
													.toLowerCase()
													.replace(/^\w/, (c) => c.toUpperCase())
											)
											.join(", ")}
									</TableCell>
									<TableCell className="text-right flex justify-end gap-2">
										{/* View button */}
										<Button
											variant="outline"
											size="sm"
											// onClick={() => onView(user.id)}
											className="p-2"
										>
											<Icon
												icon="lucide:eye"
												className="size-4"
												style={{ color: "oklch(54.6% 0.245 262.881)" }}
											/>
										</Button>
										<Button className="cursor-pointer" onClick={() => handleUpdate(user.id)}>
											<Edit className="size-5"/>
											Edit
										</Button>

										<Button
											variant="destructive"
											size="sm"
											onClick={() => deleteUser(user.id)}
											className="p-2"
										>
											<Icon
												icon="lucide:trash-2"
												className="size-4"
												style={{ color: "oklch(63.7% 0.237 25.331)" }}
											/>
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{totalPages > 1 && (
				<div className="flex items-center justify-between mt-6">
					<div className="text-sm text-gray-600">
						Showing {page * size + 1} to{" "}
						{Math.min((page + 1) * size, totalElements)} of {totalElements}{" "}
						entries
					</div>
					<div className="flex items-center gap-1">
						{/* Về trang đầu */}
						<Button
							variant="ghost"
							size="icon"
							disabled={page === 0}
							onClick={() => onPageChange(0)}
							className="w-8 h-8"
						>
							<Icon icon="lucide:chevrons-left" className="w-4 h-4" />
						</Button>

						{/* Trang trước */}
						<Button
							variant="ghost"
							size="icon"
							disabled={page === 0}
							onClick={() => onPageChange(page - 1)}
							className="w-8 h-8"
						>
							<Icon icon="lucide:chevron-left" className="w-4 h-4" />
						</Button>

						{/* Các số trang */}
						{Array.from({ length: totalPages }, (_, i) => (
							<Button
								key={i}
								variant={i === page ? "default" : "ghost"}
								size="icon"
								onClick={() => onPageChange(i)}
								className={`w-8 h-8 ${
									i === page
										? "bg-blue-500 text-white"
										: "bg-blue-50 text-blue-600 hover:bg-blue-100"
								}`}
							>
								{i + 1}
							</Button>
						))}

						{/* Trang sau */}
						<Button
							variant="ghost"
							size="icon"
							disabled={page + 1 >= totalPages}
							onClick={() => onPageChange(page + 1)}
							className="w-8 h-8"
						>
							<Icon icon="lucide:chevron-right" className="w-4 h-4" />
						</Button>

						{/* Tới trang cuối */}
						<Button
							variant="ghost"
							size="icon"
							disabled={page + 1 >= totalPages}
							onClick={() => onPageChange(totalPages - 1)}
							className="w-8 h-8"
						>
							<Icon icon="lucide:chevrons-right" className="w-4 h-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
