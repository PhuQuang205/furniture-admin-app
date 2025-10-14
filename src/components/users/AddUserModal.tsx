// AddUserModal.tsx
"use client";

import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserForm } from "./UserForm";
import { userService } from "@/lib/services/userService";
import {User, UserFormData} from "@/components/types";
import { useUsers } from "@/hook/useUsers";

interface AddUserModalProps {
    onCreate: (newUser: User) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ onCreate }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formKey, setFormKey] = useState(Date.now());
    const { createUser } = useUsers(); // lấy function từ hook


    const handleCreate = async (data: UserFormData) => {
        try {
            setLoading(true);
            const newUser = await createUser(data); // gọi hook để tạo user và update state
            onCreate?.(newUser); // gọi callback nếu parent cần
            setOpen(false);
        } catch (err) {
            console.error(err);
            alert("Failed to create user");
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = () => {
        setFormKey(Date.now()); // reset form mỗi lần mở
        setOpen(true);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={handleOpen}>
                    <span className="mr-2">+</span> Add User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add User</DialogTitle>
                </DialogHeader>
                <UserForm onSubmit={handleCreate} loading={loading} formKey={formKey} />
            </DialogContent>
        </Dialog>
    );
};
