"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userService } from "@/lib/services/userService";
import { Role, User, UserRequest } from "@/components/types";
import MasterLayout from "@/masterLayout/MasterLayout";
import Breadcrumb from "@/components/Breadcrumb";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PhotoImage } from "@/components/PhotoImage";
import { Edit } from "lucide-react";

const UserEditPage = () => {
	const route = useRouter();
	const { id } = useParams();
	const [user, setUser] = useState<User | null>(null);
	const [originalUser, setOriginalUser] = useState<User | null>(null); // ✅ dữ liệu gốc
	const [roles, setRoles] = useState<Role[]>([]);
	const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
	const [password, setPassword] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await userService.getUserById(Number(id));
				setUser(res);
				setOriginalUser(res);
				setSelectedRoles(res.roles?.map((r: Role) => r.id) || []);
			} catch (error) {
				console.error("Failed to fetch user", error);
			}
		};
		fetchUser();
	}, [id]);

	useEffect(() => {
		userService
			.getRoles()
			.then((data) => setRoles(data))
			.catch((err) => console.error("Failed to fetch roles", err));
	}, []);

	const handleChange = (key: keyof User, value: string) => {
		setUser((prev) => (prev ? { ...prev, [key]: value } : prev));
	};

	const handleRoleChange = (roleId: number, checked: boolean) => {
		setSelectedRoles((prev) =>
			checked ? [...prev, roleId] : prev.filter((id) => id !== roleId)
		);
	};

	const handleSave = async () => {
		if (!user || !originalUser) {
			toast.warning("Không có thay đổi nào để cập nhật");

			return
		};

		// ✅ Kiểm tra có thay đổi gì không
		const hasChanges =
			password.trim() !== "" ||
			user.firstName !== originalUser.firstName ||
			user.lastName !== originalUser.lastName ||
			user.email !== originalUser.email ||
			user.enabled !== originalUser.enabled ||
			JSON.stringify(selectedRoles) !== JSON.stringify(originalUser.roles?.map((r) => r.id)) ||
			avatarFile !== null;

		if (!hasChanges) {
			toast.warning("Không có thay đổi nào để cập nhật");
			return;
		}

		setLoading(true);
		try {
			const payload: UserRequest = {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				roleIds: selectedRoles,
				enabled: user.enabled,
			};

			if (password.trim() !== "") {
				payload.password = password.trim();
			}

			console.log("🧩 Sending payload:", payload);
			console.log("🖼️ Image file:", avatarFile);

			await userService.updateUser(payload, avatarFile);

			toast.success("Cập nhật người dùng thành công!");
			route.push("/users");
		} catch (error) {
			console.error("Update failed:", error);
			toast.error("Cập nhật người dùng thất bại!");
		} finally {
			setLoading(false);
		}
	};

	return (
		<MasterLayout>
			<div className="p-6 space-y-6">
				<Breadcrumb title="User - Edit" />

				<div className="flex gap-8 border border-gray-300 rounded-lg p-6">
					<div className="flex-1 flex flex-col justify-center space-y-6">
						{/* Name */}
						<div className="flex gap-4">
							<div className="space-y-2 flex-1">
								<Label>First Name</Label>
								<Input
									value={user?.firstName || ""}
									onChange={(e) => handleChange("firstName", e.target.value)}
									placeholder="Enter first name"
								/>
							</div>
							<div className="space-y-2 flex-1">
								<Label>Last Name</Label>
								<Input
									value={user?.lastName || ""}
									onChange={(e) => handleChange("lastName", e.target.value)}
									placeholder="Enter last name"
								/>
							</div>
						</div>

						{/* Email */}
						<div className="space-y-2">
							<Label>Email</Label>
							<Input
								type="email"
								value={user?.email || ""}
								onChange={(e) => handleChange("email", e.target.value)}
								placeholder="Enter email"
							/>
						</div>

						{/* Password */}
						<div className="space-y-2">
							<Label>New Password (optional)</Label>
							<Input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Leave blank to keep current password"
							/>
						</div>

						{/* Roles */}
						<div className="space-y-2 my-4 h-[300px] overflow-y-auto border p-3 rounded-md">
							<Label>Roles</Label>
							{roles.map((role) => (
								<label key={role.id} className="flex items-center gap-2 py-1">
									<input
										type="checkbox"
										value={role.id}
										checked={selectedRoles.includes(role.id)}
										onChange={(e) =>
											handleRoleChange(role.id, e.target.checked)
										}
									/>
									<span>
										{role.name
											.replace(/^ROLE_/, "")
											.toLowerCase()
											.replace(/\b\w/g, (c) => c.toUpperCase())}
										{" - "}
										{role.description}
									</span>
								</label>
							))}
						</div>

						<Button onClick={handleSave} className="w-full cursor-pointer" disabled={loading}>							
							{loading ? "Loading..." : (
								<>
									<Edit className="size-5" />
									<span>Edit change</span>
								</>
							)}
						</Button>
					</div>

					<div className="flex-1 flex items-center justify-center text-gray-500">
						<PhotoImage
							initialUrl={user?.avatarUrl}
							onFileSelect={(file) => setAvatarFile(file)}
						/>
					</div>
				</div>
			</div>
		</MasterLayout>
	);
};

export default UserEditPage;
