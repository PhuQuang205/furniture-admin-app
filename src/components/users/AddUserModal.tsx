// AddUserModal.tsx
"use client";

import React, { useState } from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { UserForm } from "./UserForm";
import { User, UserFormData } from "@/components/types";
import { useUsers } from "@/hook/useUsers";
import { Plus } from "lucide-react";

interface AddUserModalProps {
	onCreate: (newUser: User) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ onCreate }) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formKey, setFormKey] = useState(Date.now());
	const { createUser } = useUsers();

	const handleCreate = async (data: UserFormData) => {
		try {
			setLoading(true);
			const newUser = await createUser(data);
			onCreate?.(newUser);
			setOpen(false);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleOpen = () => {
		setFormKey(Date.now());
		setOpen(true);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button
					onClick={handleOpen}
					className="bg-transparent flex items-center gap-1.5 h-9 border border-gray-300 rounded-full px-2 py-1 text-gray-700 cursor-pointer"
				>
					<Plus className="size-4" />
					<p className="text-sm">Thêm tài khoản</p>
				</button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Thêm tài khoản</DialogTitle>
				</DialogHeader>
				<UserForm onSubmit={handleCreate} loading={loading} formKey={formKey} />
			</DialogContent>
		</Dialog>
	);
};
