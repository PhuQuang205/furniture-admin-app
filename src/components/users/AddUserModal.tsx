// AddUserModal.tsx
"use client";

import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserForm } from "./UserForm";
import {User, UserFormData} from "@/components/types";
import { useUsers } from "@/hook/useUsers";

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
