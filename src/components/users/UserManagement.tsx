import { Icon } from "@iconify/react";
import UserTable from "@/components/users/UserTable";
import { SearchInput } from "@/components/SearchInput";
import { useState } from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AddUserModal } from "@/components/users/AddUserModal";
import { useUsers } from "@/hook/useUsers";
import { User } from "@/components/types";
import { cn } from "@/lib/utils";

export const UserManagement = () => {
	const [keyword] = useState("");
	const [sortField, setSortField] = useState<string>("id");
	const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

	const handleSearch = (kw: string) => {
		setPage(0);
		refetch(0, kw);
	};

	const handleSortChange = (field: string) => {
		setPage(0);
		setSortField(field);
		refetch(0, keyword, field, sortDir);
	};
	const toggleSortDir = () => {
		const newDir = sortDir === "asc" ? "desc" : "asc";
		setSortDir(newDir);
		refetch(0, keyword, sortField, newDir);
	};
	const {
		users,
		setUsers,
		loading,
		totalElements,
		page,
		totalPages,
		size,
		refetch,
		setPage,
		updateUserStatus,
		deleteUser,
	} = useUsers();

	return (
		<>
			<div className="flex justify-between items-center gap-4">
				<div className="flex items-center gap-2 flex-1">
					<SearchInput
						placeholder="Tìm kiếm theo tên hoặc email..."
						onSearch={handleSearch}
						initialValue={keyword}
					/>
					<Select value={sortField} onValueChange={handleSortChange}>
						<SelectTrigger className="w-[140px] rounded-full border-gray-300 py-1">
							<SelectValue placeholder="Sort field" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Fields</SelectLabel>
								<SelectItem value="id">id</SelectItem>
								<SelectItem value="firstName">Họ</SelectItem>
								<SelectItem value="lastName">Tên</SelectItem>
								<SelectItem value="email">Email</SelectItem>
								<SelectItem value="createdAt">Ngày tạo</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<button
						onClick={toggleSortDir}
						className={cn(
							"size-7 cursor-pointer bg-transparent border border-gray-300 rounded-full flex items-center justify-center transition-all duration-300",
							sortDir === "asc" ? "rotate-180" : ""
						)}
					>
						<Icon icon="lucide:arrow-up" className="size-5 text-gray-700" />
					</button>
				</div>
				<AddUserModal
					onCreate={(newUser) => {
						setUsers((prev: User[]) => [newUser, ...prev]);
					}}
				/>
			</div>
			<UserTable
				users={users}
				loading={loading}
				size={size}
				page={page}
				totalPages={totalPages}
				totalElements={totalElements}
				updateUserStatus={updateUserStatus}
				deleteUser={deleteUser}
				onPageChange={setPage}
				setUsers={setUsers}
			/>
		</>
	);
};
