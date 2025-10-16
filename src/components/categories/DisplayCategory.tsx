"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, Upload } from "lucide-react";
import api from "@/lib/axios";
import { CategoryResponse } from "@/lib/services/categoryService";
import { toast } from "sonner";
import { useCategories } from "@/hook/useCategories";
import { Textarea } from "@/components/ui/textarea";

export const DisplayCategory = () => {
	const { id } = useParams();
	const { updateCategory } = useCategories();
	const [category, setCategory] = useState<CategoryResponse>();
	const [originalData, setOriginalData] = useState<CategoryResponse>();
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);

	const [formData, setFormData] = useState({
		id: `${id}`,
		name: "",
		alias: "",
		enabled: false,
	});
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	console.log("+ File: ", previewUrl);
	console.log("+ Form data: ", formData);

	const fetchCategory = useCallback(async () => {
		try {
			setLoading(true);
			const res = await api.get(`/categories/${id}`);
			setCategory(res.data);
			setFormData({
				id: res.data.id,
				name: res.data.name,
				alias: res.data.alias,
				enabled: res.data.enabled,
			});
			setOriginalData({
				id: res.data.id,
				name: res.data.name,
				alias: res.data.alias,
				image: res.data.image,
				enabled: res.data.enabled,
			});
			setPreviewUrl(res.data.image);
		} catch (error) {
			console.error("Lỗi khi tải danh mục:", error);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		if (id) fetchCategory();
	}, [id, fetchCategory]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Xử lý chọn ảnh
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setSelectedFile(file);
		setPreviewUrl(URL.createObjectURL(file));
	};

	// ✅ Hàm lưu (PUT /admin/api/categories)
	const handleSave = async () => {
		const isSame =
			formData.name === originalData?.name &&
			formData.alias === originalData?.alias &&
			formData.enabled === originalData?.enabled &&
			!selectedFile;

		if (isSame) {
			toast.warning("Không có thay đổi nào để cập nhật!");
			return;
		}

		try {
			setSaving(true);

			// ✅ Tạo object category theo kiểu CategoryRequest
			const categoryObj = {
				id: Number(id),
				name: formData.name,
				alias: formData.alias,
				enabled: formData.enabled,
			};

			// ✅ Gọi service updateCategory() mà bạn đã viết sẵn
			const updated = await updateCategory(categoryObj, selectedFile);

			if (updated) {
				toast.success("✅ Cập nhật danh mục thành công!");
				setSelectedFile(null);
				fetchCategory();
			} else {
				toast.error("❌ Cập nhật thất bại!");
			}
		} catch (error) {
			console.error("❌ Lỗi khi cập nhật:", error);
			toast.error("❌ Cập nhật thất bại!");
		} finally {
			setSaving(false);
		}
	};

	if (loading)
		return (
			<div className="flex justify-center items-center py-20">
				<Loader2 className="animate-spin mr-2" /> Đang tải dữ liệu...
			</div>
		);

	if (!category)
		return <p className="text-center py-10">Không tìm thấy danh mục.</p>;

	return (
		<div className="w-full rounded-xl">
			<div className="flex gap-8 mt-6">
				{/* Ảnh danh mục */}
				<div className="flex flex-col items-center gap-4 px-8">
					<div className="relative group flex flex-col items-center justify-center rounded-full size-[300px] border overflow-hidden cursor-pointer">
						{previewUrl ? (
							<Image
								src={previewUrl}
								alt="Category"
								fill
								sizes="300px"
								className="object-cover transition-transform duration-300 group-hover:scale-105"
								loading="lazy"
								onClick={() => fileInputRef.current?.click()}
							/>
						) : (
							<div
								className="flex flex-col items-center text-gray-400"
								onClick={() => fileInputRef.current?.click()}
							>
								<Upload className="size-10 mb-2" />
								<p>Chưa có ảnh</p>
							</div>
						)}

						{/* 🟢 Overlay hiện khi hover */}
						<div
							onClick={() => fileInputRef.current?.click()}
							className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 gap-2 text-white"
						>
							<Upload className="text-white size-8" />
							<span className="text-2xl font-bold">Upload ảnh</span>
						</div>

						<input
							type="file"
							accept="image/*"
							ref={fileInputRef}
							onChange={handleFileChange}
							className="hidden"
						/>
					</div>					
				</div>

				{/* Thông tin chi tiết */}
				<div className="flex flex-col justify-center space-y-4 flex-1">
					<div className="w-fit flex gap-2 items-center py-1 px-2 border border-green-500 rounded-full bg-green-200 text-greenly">
						<p className="text-sm">Mã danh mục sản phẩm:</p>
						<p className="text-sm">#{category.id}</p>
					</div>

					<div className="flex flex-col gap-2 max-w-[300px]">
						<label className="font-medium text-base text-black">
							Tên danh mục
						</label>
						<Input
							name="name"
							value={formData.name}
							onChange={handleChange}
							className="rounded-md border-greenly"
						/>
					</div>

					<div className="flex flex-col gap-2 max-w-[500px]">
						<label className="font-medium text-base text-black">Alias</label>
						<Textarea
							name="alias"
							value={formData.alias}
							onChange={handleChange}
							className="h-[300px] rounded-md border-greenly"
							rows={3}
							placeholder="Nhập alias cho danh mục..."
						/>
					</div>

					{/* <div className="flex flex-col gap-2">
						<div className="flex items-center space-x-2">
							<label className="font-medium text-base text-black">
								Trạng thái
							</label>
							<div className="w-25">
								{formData.enabled ? (
									<Badge className="bg-green-500 text-white">Đang bật</Badge>
								) : (
									<Badge variant="secondary" className="bg-gray-400">
										Đang tắt
									</Badge>
								)}
							</div>

							<Button
								size="sm"
								className="text-sm"
								onClick={() =>
									setFormData((prev) => ({
										...prev,
										enabled: !prev.enabled,
									}))
								}
							>
								{formData.enabled ? "Tắt" : "Bật"}
							</Button>
						</div>
					</div> */}

					<div className="flex justify-between items-center">
						<Button
							variant="default"
							onClick={handleSave}
							disabled={saving}
							className="flex items-center rounded-md h-12 cursor-pointer gap-2"
						>
							{saving ? (
								<>
									<Loader2 className="size-4 animate-spin" /> Đang lưu...
								</>
							) : (
								<>
									<Edit className="size-4" /> Lưu thay đổi
								</>
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
