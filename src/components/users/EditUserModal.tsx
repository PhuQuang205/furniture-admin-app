// EditUserModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserForm } from "./UserForm";
import { userService } from "@/lib/services/userService";
import { User, UserFormData } from "@/components/types";

interface EditUserModalProps {
	user: User;
	onUpdate: (updatedUser: User) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
	user,
	onUpdate,
}) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);


	const handleUpdate = async (data: UserFormData) => {
		try {
			setLoading(true);
			const updatedUser = await userService.updateUser(data);

			onUpdate({ ...updatedUser, roles: updatedUser.roles || [] });
			setOpen(false);
		} catch (err) {
			console.error(err);
			alert("Failed to update user");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					Edit
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Edit User</DialogTitle>
				</DialogHeader>
				<UserForm
					initialData={{
						...user,
						roleIds: user.roles?.map((r) => r.id) || [],
					}}
					onSubmit={handleUpdate}
					submitLabel="Update"
					loading={loading}
					formKey={user.id}
				/>
			</DialogContent>
		</Dialog>
	);
};
