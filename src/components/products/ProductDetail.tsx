"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Edit, Save, Upload, X, Plus, Trash2 } from "lucide-react";
import { ProductResponse } from "@/lib/services/productService";
import { useProducts } from "@/hook/useProduct";
import { toast } from "sonner";

interface ProductDetailProps {
	product: ProductResponse;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
	const { updateProduct } = useProducts();
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<ProductResponse>(product);
	const [previewImages, setPreviewImages] = useState<string[]>(
		product.images?.map((img) => img.imageUrl ?? "") || []
	);
	const [newImages, setNewImages] = useState<File[]>([]);

	const [newDetail, setNewDetail] = useState({ name: "", value: "" });

	const handleChange = (
		field: keyof ProductResponse,
		value: string | number
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		setNewImages((prev) => [...prev, ...files]);

		const previews = files.map((file) => URL.createObjectURL(file));
		setPreviewImages((prev) => [...prev, ...previews]);
	};

	// 🟢 Xoá ảnh trong danh sách preview
	const handleRemoveImage = (index: number) => {
		setPreviewImages((prev) => prev.filter((_, i) => i !== index));
		setNewImages((prev) => prev.filter((_, i) => i !== index));
	};

	// 🟢 Thêm mô tả kỹ thuật
	const addDetail = () => {
		if (!newDetail.name.trim() || !newDetail.value.trim()) return;
		setFormData((prev) => ({
			...prev,
			details: [...(prev.details || []), newDetail],
		}));
		setNewDetail({ name: "", value: "" });
	};

	// 🟢 Xóa mô tả kỹ thuật
	const removeDetail = (index: number) => {
		setFormData((prev) => ({
			...prev,
			details: prev.details?.filter((_, i) => i !== index) || [],
		}));
	};

	const handleSave = async () => {
		// Loại bỏ các trường không cần gửi
		const { finalPrice, category, mainImage, images, ...rest } = formData;

		// Chuyển đổi đúng cấu trúc backend yêu cầu
		const payload = {
			...rest,
			categoryId: category?.id,
			newImageOrder: previewImages.map((_, i) => i + 1),
			retainedImages:
				formData.images?.map((img, i) => ({
					id: img.id!,
					position: i + 1,
				})) ?? [],
			newProductDetails: newDetail.name ? [newDetail] : [],
			retainedProductDetailIds: formData.details?.map((_, i) => i + 1) ?? [],
		};

		console.log("📦 Payload gửi API:", payload);

		// Gọi custom hook
		const updated = await updateProduct(payload, newImages);
		if (updated) {
			setIsEditing(false)
			toast.success("Cập nhật thành công!")
			console.log("✅ Cập nhật thành công:", updated);
		}
	};

	return (
		<div className="space-y-8">
			{/* --- ẢNH SẢN PHẨM --- */}
			<div>
				<h2 className="text-xl font-semibold mb-3">Ảnh sản phẩm</h2>
				<div className="flex flex-wrap gap-3">
					{previewImages.map((img, index) => (
						<div key={index} className="relative group">
							<Image
								src={img}
								alt={formData.name}
								width={120}
								height={120}
								className="rounded-md border object-cover"
							/>
							{isEditing && (
								<Button
									size="icon"
									variant="destructive"
									className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition"
									onClick={() => handleRemoveImage(index)}
								>
									<X size={16} />
								</Button>
							)}
						</div>
					))}

					{/* Upload ảnh mới */}
					{isEditing && (
						<label className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer">
							<Upload className="mb-1" size={20} />
							<span className="text-xs">Thêm ảnh</span>
							<input
								type="file"
								accept="image/*"
								multiple
								className="hidden"
								onChange={handleImageChange}
							/>
						</label>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-3">
					<div className="flex flex-col gap-4">
						<Label>Tên sản phẩm</Label>
						<Input
							value={formData.name}
							disabled={!isEditing}
							onChange={(e) => handleChange("name", e.target.value)}
						/>
					</div>

					<div className="flex flex-col gap-4">
						<Label>Giá gốc (₫)</Label>
						<Input
							type="number"
							value={formData.price}
							disabled={!isEditing}
							onChange={(e) => handleChange("price", Number(e.target.value))}
						/>
					</div>

					<div className="flex flex-col gap-4">
						<Label>Giảm giá (%)</Label>
						<Input
							type="number"
							value={formData.discountPercent}
							disabled={!isEditing}
							onChange={(e) =>
								handleChange("discountPercent", Number(e.target.value))
							}
						/>
					</div>

					<div className="flex flex-col gap-4">
						<Label>Giá sau giảm (₫)</Label>
						<Input type="number" disabled value={formData.finalPrice ?? 0} />
					</div>

					<div className="flex flex-col gap-4">
						<Label>Trọng lượng (kg)</Label>
						<Input
							type="number"
							value={formData.weight}
							disabled={!isEditing}
							onChange={(e) => handleChange("weight", Number(e.target.value))}
						/>
					</div>
				</div>

				<div className="space-y-3">
					<div className="flex flex-col gap-4">
						<Label>Danh mục</Label>
						<Input value={formData.category?.name || ""} disabled />
					</div>

					<div className="flex flex-col gap-4">
						<Label>Chiều dài (cm)</Label>
						<Input
							type="number"
							value={formData.length}
							disabled={!isEditing}
							onChange={(e) => handleChange("length", Number(e.target.value))}
						/>
					</div>

					<div className="flex flex-col gap-4">
						<Label>Chiều rộng (cm)</Label>
						<Input
							type="number"
							value={formData.width}
							disabled={!isEditing}
							onChange={(e) => handleChange("width", Number(e.target.value))}
						/>
					</div>

					<div className="flex flex-col gap-4">
						<Label>Chiều cao (cm)</Label>
						<Input
							type="number"
							value={formData.height}
							disabled={!isEditing}
							onChange={(e) => handleChange("height", Number(e.target.value))}
						/>
					</div>
				</div>
			</div>

			{/* --- MÔ TẢ --- */}
			<div className="flex flex-col gap-4">
				<Label>Mô tả ngắn</Label>
				<Textarea
					rows={3}
					value={formData.shortDescription}
					disabled={!isEditing}
					onChange={(e) => handleChange("shortDescription", e.target.value)}
				/>
			</div>

			<div className="flex flex-col gap-4">
				<Label>Mô tả chi tiết</Label>
				<Textarea
					rows={6}
					value={formData.fullDescription}
					disabled={!isEditing}
					onChange={(e) => handleChange("fullDescription", e.target.value)}
				/>
			</div>

			<div className="space-y-4">
				<Label className="text-xl font-semibold">
					Thông tin mô tả kỹ thuật
				</Label>
				<div>
					{isEditing && (
						<div className="space-y-4 py-4">
							<div className="flex flex-col gap-4">
								<Label htmlFor="detail-name">Thuộc tính</Label>
								<Input
									id="detail-name"
									value={newDetail.name}
									onChange={(e) =>
										setNewDetail((prev) => ({
											...prev,
											name: e.target.value,
										}))
									}
									placeholder="Nhập thuộc tính ..."
									className="rounded-md"
								/>
							</div>

							<div className="flex flex-col gap-4">
								<Label htmlFor="detail-value">Mô tả thuộc tính</Label>
								<Textarea
									id="detail-value"
									value={newDetail.value}
									onChange={(e) =>
										setNewDetail((prev) => ({
											...prev,
											value: e.target.value,
										}))
									}
									placeholder="Nhập mô tả thuộc tính"
									rows={2}
									className="resize-none"
								/>
							</div>

							<Button
								type="button"
								variant="outline"
								className="w-fit h-12 gap-2 bg-transparent"
								onClick={addDetail}
							>
								<Plus size={18} />
								Thêm mô tả thuộc tính
							</Button>
						</div>
					)}

					{formData.details?.length > 0 && (
						<div className="space-y-4">
							{formData.details.map((detail, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-3 bg-greenly border-2 border-yelly rounded-lg"
								>
									<div className="flex-1">
										<p className="font-medium text-white text-sm">
											+ {detail.name}
										</p>
										<p className="text-sm text-white/50">{detail.value}</p>
									</div>

									{isEditing && (
										<button
											type="button"
											className="text-white hover:text-yelly cursor-pointer"
											onClick={() => removeDetail(index)}
										>
											<Trash2 size={18} />
										</button>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* --- NÚT CHỈNH SỬA / LƯU --- */}
			<div className="flex gap-3">
				{isEditing ? (
					<Button
						onClick={handleSave}
						className="flex items-center gap-2 cursor-pointer"
					>
						<Save className="size-5" />
						Lưu thay đổi
					</Button>
				) : (
					<Button
						variant="secondary"
						onClick={() => setIsEditing(true)}
						className="flex items-center gap-2 cursor-pointer"
					>
						<Edit className="size-5" />
						Chỉnh sửa
					</Button>
				)}
			</div>
		</div>
	);
};
