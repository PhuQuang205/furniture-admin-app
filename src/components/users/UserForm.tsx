"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { UserFormData, Role } from "@/components/types";
import {userService} from "@/lib/services/userService";

const userFormSchema = z.object({
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    email: z.string().email("Invalid email"),
    password: z.string().optional(),
    avatarFile: z.instanceof(File).optional(),
    roleIds: z.array(z.number()).min(1, "Select at least one role"), // multi-role
    enabled: z.boolean(),
});

interface UserFormProps {
    initialData?: UserFormData;
    onSubmit: (data: UserFormData) => Promise<void>;
    submitLabel?: string;
    loading?: boolean;
    formKey?: string | number;
}

export const UserForm: React.FC<UserFormProps> = ({
                                                      initialData,
                                                      onSubmit,
                                                      submitLabel = "Save",
                                                      loading = false,
                                                      formKey,
                                                  }) => {
    const form = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        defaultValues: initialData || {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            avatarFile: undefined,
            avatarUrl: undefined,
            roleIds: [],
            enabled: undefined,
        },
    });

    const [avatarPreview, setAvatarPreview] = useState<string | undefined>(initialData?.avatarUrl);
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        userService.getRoles()
            .then(data => setRoles(data))
            .catch(err => console.error("Failed to fetch roles", err));
    }, []);

    const handleAvatarChange = (file?: File) => {
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
            form.setValue("avatarFile", file);
        }
    };

    const onFormSubmit = async (values: UserFormData) => {
        await onSubmit(values);
        form.reset();
        setAvatarPreview(undefined);
    };

    return (
        <Form {...form} key={formKey}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4" autoComplete="off">
                {/* First Name */}
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="First Name" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Last Name */}
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Last Name" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Email" type="email" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Password */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Password" type="password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Avatar */}
                <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <FormControl>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleAvatarChange(e.target.files?.[0])}
                            value={ ?? ""}
                        />
                    </FormControl>
                    {avatarPreview && (
                        <img
                            src={avatarPreview}
                            alt="Avatar preview"
                            className="w-20 h-20 rounded-full object-cover mt-2"
                        />
                    )}
                </FormItem>
                {/* Roles */}
                <FormField
                    control={form.control}
                    name="roleIds"
                    render={({ field }) => {
                        const selectedRoles = field.value || [];
                        return (
                            <FormItem>
                                <FormLabel>Select Roles</FormLabel>
                                <FormControl >
                                    <div className="space-y-1 my-4  h-[200px] overflow-hidden overflow-y-scroll">
                                        {roles.map(role => (
                                            <label key={role.id} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    value={role.id}
                                                    checked={selectedRoles.includes(role.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            field.onChange([...selectedRoles, role.id]);
                                                        } else {
                                                            field.onChange(selectedRoles.filter(id => id !== role.id));
                                                        }
                                                    }}
                                                />
                                                <span>
  {role.name
      .replace(/^ROLE_/, "")       // bỏ "ROLE_"
      .toLowerCase()               // chuyển tất cả thành chữ thường
      .replace(/\b\w/g, c => c.toUpperCase()) // viết hoa chữ cái đầu mỗi từ
  } - {role.description}
</span>

                                            </label>
                                        ))}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />

                <FormField
                    control={form.control}
                    name="enabled"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={field.value || false}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-sm font-medium">Enabled</span>
                                </label>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit */}
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : submitLabel}
                </Button>
            </form>
        </Form>
    );
};

//
// "use client";
// import * as React from "react";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { UserFormData } from "@/components/types";
// import {userService} from "@/lib/services/userService";
//
// const userFormSchema = z.object({
//     firstName: z.string().min(1, "Required"),
//     lastName: z.string().min(1, "Required"),
//     email: z.string().email("Invalid email"),
//     password: z.string().optional(),
//     avatarFile: z.instanceof(File).optional(),
//     roleId: z.number().min(1, "Select a role"), // thêm roleId validate
// });
//
// interface Role {
//     id: number;
//     name: string;
//     description: string;
// }
//
// interface UserFormProps {
//     initialData?: UserFormData;
//     onSubmit: (data: UserFormData) => Promise<void>;
//     submitLabel?: string;
//     loading?: boolean;
//     formKey?: string | number; // dùng để reset form
// }
//
// export const UserForm: React.FC<UserFormProps> = ({
//                                                       initialData,
//                                                       onSubmit,
//                                                       submitLabel = "Save",
//                                                       loading = false,
//                                                       formKey,
//                                                   }) => {
//     const form = useForm<UserFormData>({
//         resolver: zodResolver(userFormSchema),
//         defaultValues: initialData || {
//             firstName: "",
//             lastName: "",
//             email: "",
//             password: "",
//             avatarFile: undefined,
//             avatarUrl: undefined,
//             roleId: undefined,
//         },
//     });
//
//     const [avatarPreview, setAvatarPreview] = useState<string | undefined>(initialData?.avatarUrl);
//     const [roles, setRoles] = useState<Role[]>([]);
//     const [loadingRoles, setLoadingRoles] = useState(true);
//
//     useEffect(() => {
//         userService.getRoles()
//             .then(data => setRoles(data))
//             .catch(err => console.error("Failed to fetch roles", err))
//             .finally(() => setLoadingRoles(false));
//     }, []);
//
//     const handleAvatarChange = (file?: File) => {
//         if (file) {
//             setAvatarPreview(URL.createObjectURL(file));
//             form.setValue("avatarFile", file);
//         }
//     };
//
//     const onFormSubmit = async (values: UserFormData) => {
//         await onSubmit(values);
//         form.reset();
//         setAvatarPreview(undefined);
//     };
//
//     return (
//         <Form {...form} key={formKey}>
//             <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4" autoComplete="off">
//                 {/* FirstName, LastName, Email, Password, Avatar giữ nguyên */}
//
//                 <FormField
//                     control={form.control}
//                     name="roleId"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Select Role</FormLabel>
//                             <FormControl>
//                                 {loadingRoles ? (
//                                     <div>Loading roles...</div>
//                                 ) : (
//                                     <div className="space-y-1">
//                                         {roles.map(role => (
//                                             <label key={role.id} className="flex items-center gap-2">
//                                                 <input
//                                                     type="radio"
//                                                     value={role.id}
//                                                     checked={field.value === role.id}
//                                                     onChange={() => field.onChange(role.id)}
//                                                 />
//                                                 <span>{role.name} - {role.description}</span>
//                                             </label>
//                                         ))}
//                                     </div>
//                                 )}
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//
//                 <Button type="submit" disabled={loading}>
//                     {loading ? "Saving..." : submitLabel}
//                 </Button>
//             </form>
//         </Form>
//     );
// };
