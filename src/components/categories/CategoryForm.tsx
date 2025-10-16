"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormField,
	FormItem,
	FormControl,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CategoryRequest } from "@/lib/services/categoryService";

const categorySchema = z.object({
	name: z.string().min(1, "Tên danh mục không được để trống"),
	alias: z.string().min(1, "Alias không được để trống"),
	enabled: z.boolean(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
	onSubmit: (data: CategoryRequest, imageFile?: File | null) => Promise<void>;
	submitLabel?: string;
	loading?: boolean;
	formKey?: string | number;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
	onSubmit,
	submitLabel = "Tạo danh mục",
	loading = false,
	formKey,
}) => {
	const form = useForm<CategoryFormData>({
		resolver: zodResolver(categorySchema),
		defaultValues: {
			name: "",
			alias: "",
			enabled: true,
		},
	});

	const [imageFile, setImageFile] = React.useState<File | null>(null);
	const [preview, setPreview] = React.useState<string | undefined>();

	const handleImageChange = (file?: File) => {
		if (file) {
			setImageFile(file);
			setPreview(URL.createObjectURL(file));            
		}
	};

	const handleSubmitForm = async (values: CategoryFormData) => {
		await onSubmit(values, imageFile);
		form.reset();
		setPreview(undefined);
		setImageFile(null);
	};

	return (
		<Form {...form} key={formKey}>
			<form
				onSubmit={form.handleSubmit(handleSubmitForm)}
				className="space-y-4"
				autoComplete="off"
			>
				{/* Name */}
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tên danh mục</FormLabel>
							<FormControl>
								<Input {...field} placeholder="Nhập tên danh mục" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Alias */}
				<FormField
					control={form.control}
					name="alias"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Alias</FormLabel>
							<FormControl>
								<Input {...field} placeholder="Ví dụ: noi_that_go" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Image */}
				<FormItem>
					<FormLabel>Ảnh danh mục</FormLabel>
					<FormControl>
						<input
							type="file"
							accept="image/*"
							onChange={(e) => handleImageChange(e.target.files?.[0])}
						/>
					</FormControl>
					{preview && (
						<Image
							src={preview}
							alt="Preview"
							width={100}
							height={100}
							className="rounded-md object-cover mt-2"
						/>
					)}
				</FormItem>

				{/* Enabled */}
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
									<span className="text-sm font-medium">Kích hoạt</span>
								</label>
							</FormControl>
						</FormItem>
					)}
				/>

				<Button className="cursor-pointer" type="submit" disabled={loading}>
					{loading ? "Đang lưu..." : submitLabel}
				</Button>
			</form>
		</Form>
	);
};
