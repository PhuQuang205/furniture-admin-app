"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Edit, Save } from "lucide-react";
import { ProductResponse } from "@/lib/services/productService";

interface ProductDetailProps {
	product: ProductResponse;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<ProductResponse>(product);

	// 🟢 Xử lý thay đổi input
	const handleChange = (field: keyof ProductResponse, value: string | number) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSave = () => {
		console.log("✅ Dữ liệu đã cập nhật:", formData);
		setIsEditing(false);
		// TODO: Gọi API update tại đây
	};

	return (
		<div className="space-y-8">
			{/* --- ẢNH SẢN PHẨM --- */}
			<div>
				<h2 className="text-xl font-semibold mb-3">Ảnh sản phẩm</h2>
				<div className="flex gap-3 overflow-x-auto">
					{formData.images?.map((img) => (
						<Image
							key={img.id}
							src={img.imageUrl ?? ""}
							alt={formData.name}
							width={120}
							height={120}
							className="rounded-md border object-cover"
						/>
					))}
				</div>
			</div>

			{/* --- FORM CHỈNH SỬA --- */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-3">
					<div>
						<Label>Tên sản phẩm</Label>
						<Input
							value={formData.name}
							disabled={!isEditing}
							onChange={(e) => handleChange("name", e.target.value)}
						/>
					</div>

					<div>
						<Label>Giá gốc (₫)</Label>
						<Input
							type="number"
							value={formData.price}
							disabled={!isEditing}
							onChange={(e) => handleChange("price", Number(e.target.value))}
						/>
					</div>

					<div>
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

					<div>
						<Label>Giá sau giảm (₫)</Label>
						<Input
							type="number"
							disabled
							value={formData.finalPrice ?? 0}
						/>
					</div>

					<div>
						<Label>Trọng lượng (gram)</Label>
						<Input
							type="number"
							value={formData.weight}
							disabled={!isEditing}
							onChange={(e) => handleChange("weight", Number(e.target.value))}
						/>
					</div>
				</div>

				{/* Cột phải */}
				<div className="space-y-3">
					<div>
						<Label>Danh mục</Label>
						<Input
							value={formData.category?.name || ""}
							disabled
						/>
					</div>

					<div>
						<Label>Chiều dài (mm)</Label>
						<Input
							type="number"
							value={formData.length}
							disabled={!isEditing}
							onChange={(e) => handleChange("length", Number(e.target.value))}
						/>
					</div>

					<div>
						<Label>Chiều rộng (mm)</Label>
						<Input
							type="number"
							value={formData.width}
							disabled={!isEditing}
							onChange={(e) => handleChange("width", Number(e.target.value))}
						/>
					</div>

					<div>
						<Label>Chiều cao (mm)</Label>
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
			<div>
				<Label>Mô tả ngắn</Label>
				<Textarea
					rows={3}
					value={formData.shortDescription}
					disabled={!isEditing}
					onChange={(e) => handleChange("shortDescription", e.target.value)}
				/>
			</div>

			<div>
				<Label>Mô tả chi tiết</Label>
				<Textarea
					rows={6}
					value={formData.fullDescription}
					disabled={!isEditing}
					onChange={(e) => handleChange("fullDescription", e.target.value)}
				/>
			</div>

			{/* --- THÔNG SỐ KỸ THUẬT --- */}
			<div>
				<h3 className="text-lg font-semibold mb-2">Thông số kỹ thuật</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
					{formData.details?.map((d, i) => (
						<div key={i} className="p-3 border rounded-md bg-gray-50 text-sm">
							<Label>{d.name}</Label>
							<Input
								value={d.value}
								disabled={!isEditing}
								onChange={(e) => {
									const updated = [...formData.details];
									updated[i].value = e.target.value;
									setFormData((prev) => ({ ...prev, details: updated }));
								}}
							/>
						</div>
					))}
				</div>
			</div>

			{/* --- NÚT CHỈNH SỬA / LƯU --- */}
			<div className="flex gap-3">
				{isEditing ? (
					<Button onClick={handleSave} className="flex items-center gap-2">
						<Save size={18} />
						Lưu thay đổi
					</Button>
				) : (
					<Button
						variant="secondary"
						onClick={() => setIsEditing(true)}
						className="flex items-center gap-2"
					>
						<Edit size={18} />
						Chỉnh sửa
					</Button>
				)}
			</div>
		</div>
	);
};
