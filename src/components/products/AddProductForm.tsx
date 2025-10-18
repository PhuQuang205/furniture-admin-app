"use client";

import React, { useState } from "react";
import { Upload, X, Plus, Trash2, ArrowRight, ArrowLeft, LibraryBig, ImageIcon, Milestone, CloudCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useCategories } from "@/hook/useCategories";
import { useProducts } from "@/hook/useProduct";
import { toast } from "sonner";

interface ProductImage {
	id: string;
	url: string;
	file?: File;
}

interface ProductDetail {
	name: string;
	value: string;
}

const steps = [
	{ id: "general", label: "Thông tin chung", icon: LibraryBig },
	{ id: "images", label: "Hình ảnh sản phẩm", icon: ImageIcon },
	{ id: "meta", label: "Chi tiết kỹ thuật", icon: Milestone },
	{ id: "finish", label: "Hoàn tất", icon: CloudCheck },
];

const AddProductForm = () => {
	const { categories } = useCategories();
	const { createProduct } = useProducts();
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState({
		name: "",
		alias: "",
		shortDescription: "",
		fullDescription: "",
		categoryId: "",
		price: 0,
		enabled: true,
		inStock: true,
		cost: 0,
		discountPercent: 0,
		length: 0,
		width: 0,
		height: 0,
		weight: 0,
		details: [] as ProductDetail[],
	});
	console.log("+ Form Data: ", formData);
	const [images, setImages] = useState<ProductImage[]>([]);
	const [newDetail, setNewDetail] = useState({ name: "", value: "" });
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, valueAsNumber } = e.target;

		setFormData((prev) => {
			const newValue = isNaN(valueAsNumber) ? 0 : valueAsNumber;
			const updated = { ...prev, [name]: newValue };
			if (name === "price" || name === "discountPercent") {
				const price = Number(updated.price) || 0;
				const discount = Number(updated.discountPercent) || 0;
				updated.cost = Math.round(price - (price * discount) / 100);
			}

			return updated;
		});
	};

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;
		setFormData((prev) => ({ ...prev, [name]: checked }));
	};

	const handleSelectChange = (name: string, value: string | number) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.currentTarget.files;
		if (files) {
			Array.from(files).forEach((file) => {
				const reader = new FileReader();
				reader.onload = (event) => {
					const newImage: ProductImage = {
						id: Date.now().toString() + Math.random(),
						url: event.target?.result as string,
						file,
					};
					setImages((prev) => [...prev, newImage]);
				};
				reader.readAsDataURL(file);
			});
		}
	};

	const removeImage = (id: string) => {
		setImages((prev) => prev.filter((img) => img.id !== id));
	};

	const addDetail = () => {
		if (newDetail.name.trim() && newDetail.value.trim()) {
			setFormData((prev) => ({
				...prev,
				details: [
					...prev.details,
					{
						name: newDetail.name,
						value: newDetail.value,
					},
				],
			}));
			setNewDetail({ name: "", value: "" });
		}
	};

	const removeDetail = (index: number) => {
		setFormData((prev) => ({
			...prev,
			details: prev.details.filter((_, i) => i !== index),
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const payload = {
			...formData,
			price: Number(formData.price),
			cost: Number(formData.cost),
			discountPercent: Number(formData.discountPercent),
			length: Number(formData.length),
			width: Number(formData.width),
			height: Number(formData.height),
			weight: Number(formData.weight),
			enabled: Boolean(formData.enabled),
			inStock: Boolean(formData.inStock),
			categoryId: Number(formData.categoryId),
		};

		try {
			const imageFiles = images.map((img) => img.file!).filter(Boolean);
			const newProduct = await createProduct(payload, imageFiles);
			console.log("✅ Product created successfully:", newProduct);
			toast.success("🎉 Thêm sản phẩm thành công!");

			// Reset form
			setFormData({
				name: "",
				alias: "",
				shortDescription: "",
				fullDescription: "",
				categoryId: "",
				price: 0,
				enabled: true,
				inStock: true,
				cost: 0,
				discountPercent: 0,
				length: 0,
				width: 0,
				height: 0,
				weight: 0,
				details: [],
			});
			setImages([]);
			setCurrentStep(0);
		} catch (error) {
			console.error("❌ Lỗi khi thêm sản phẩm:", error);
			toast.error("Thêm sản phẩm thất bại! Vui lòng thử lại.");
		}
	};

	return (
		<div className="p-8 bg-background min-h-screen">
			{/* Header */}
			<div className="mb-8 flex items-center justify-between">
				<h1 className="text-3xl font-bold text-foreground">Thêm sản phẩm</h1>
			</div>

			{/* Tabs Navigation */}
			<div className="mb-8">
				<div className="flex gap-8 border-b border-border">
					{steps.map((step, index) => {
						const Icon  = step.icon;
						return(
						<button
							key={step.id}
							onClick={() => setCurrentStep(index)}
							className={`pb-4 px-2 font-medium text-sm transition-colors relative ${
								currentStep === index
									? "text-primary"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							<div className="flex items-center gap-2">
								<Icon className="size-5"/>
								<span>{step.label}</span>
							</div>
							{currentStep === index && (
								<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
							)}
						</button>
					)
					})}
				</div>
			</div>

			<form onSubmit={handleSubmit}>
				{/* Bước đầu tiên */}
				{currentStep === 0 && (
					<div className="space-y-6">
						<div className="flex gap-8 items-center">
							{/* Phần nhập tên sản phẩm */}
							<div className="flex flex-col gap-2 flex-1">
								<Label htmlFor="name" className="text-sm font-semibold">
									Tên sản phẩm
								</Label>
								<Input
									id="name"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									placeholder="Nhập tên sản phẩm"
									className="h-12"
								/>
							</div>
							<div className="flex flex-col gap-2 flex-1">
								<Label htmlFor="alias" className="text-sm font-semibold">
									Alias
								</Label>
								<Input
									id="alias"
									name="alias"
									value={formData.alias}
									onChange={handleInputChange}
									placeholder="Enter alias name"
									className="h-12"
								/>
							</div>
						</div>

						<div className="space-y-4">
							<div className="flex flex-col gap-2">
								<Label htmlFor="description" className="text-sm font-semibold">
									Mô tả ngắn
								</Label>
								<Textarea
									id="description"
									name="shortDescription"
									value={formData.shortDescription}
									onChange={handleInputChange}
									placeholder="Nhập mô tả sản phẩm..."
									className="min-h-38"
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Label
									htmlFor="descriptiondetail"
									className="text-sm font-semibold"
								>
									Mô tả chi tiết
								</Label>
								<Textarea
									id="descriptiondetail"
									name="fullDescription"
									value={formData.fullDescription}
									onChange={handleInputChange}
									placeholder="Nhập mô tả chi tiết sản phẩm..."
									className="min-h-48"
								/>
							</div>
						</div>

						<div className="flex flex-col gap-4">
							<Label
								htmlFor="categoryId"
								className="text-sm font-medium mb-2 block"
							>
								Danh mục sản phẩm
							</Label>
							<Select
								value={String(formData.categoryId)} // nhớ ép sang string vì value trong Select là string
								onValueChange={(value) =>
									handleSelectChange("categoryId", Number(value))
								}
							>
								<SelectTrigger className="data-[size=default]:h-12 w-full rounded-full">
									<SelectValue placeholder="Chọn danh mục sản phẩm" />
								</SelectTrigger>

								<SelectContent>
									{categories.map((item) => (
										<SelectItem key={item.id} value={String(item.id)}>
											{item.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<div className="mt-4 grid grid-cols-1 gap-4">
								{/* Nhập về giá cả */}
								<div className="flex gap-8 items-center">
									<div className="flex flex-col gap-2 flex-1">
										<Label className="text-sm font-semibold">
											Giá & Chi phí
										</Label>
										<Input
											id="price"
											name="price"
											type="number"
											value={formData.price || ""}
											onChange={handleNumberChange}
											placeholder="Nhập giá gốc"
											className="h-12"
										/>
									</div>
									<div className="flex flex-col gap-2 flex-1">
										<Label className="text-sm font-semibold">
											Nhập phần trăm giảm giá
										</Label>
										<Input
											id="discountPercent"
											name="discountPercent"
											type="number"
											value={formData.discountPercent || ""}
											onChange={handleNumberChange}
											placeholder="Nhập giảm giá (%)"
											className="h-12"
										/>
									</div>
								</div>
								{/* Nhập về Giá sau giảm và cân nặng */}
								<div className="flex gap-8 items-center">
									<div className="flex flex-col gap-2 flex-1">
										<Label className="text-sm font-semibold">
											Giá sau khi giảm
										</Label>
										<Input
											id="cost"
											name="cost"
											type="number"
											value={formData.cost || ""}
											onChange={handleNumberChange}
											placeholder="Giá"
											className="h-12"
										/>
									</div>
									<div className="flex flex-col gap-2 flex-1">
										<Label className="text-sm font-semibold">
											Nhập cân nặng (kg)
										</Label>
										<Input
											id="weight"
											name="weight"
											type="number"
											value={formData.weight || ""}
											onChange={handleNumberChange}
											placeholder="Nhập cân nặng"
											className="h-12"
										/>
									</div>
								</div>
								{/* Nhập về cân nặng */}
								<div className="flex flex-col gap-2">
									<Label className="text-sm font-semibold">
										Kích thước (cm)
									</Label>
									<div className="flex gap-8 items-center">
										<Input
											id="length"
											name="length"
											type="number"
											value={formData.length || ""}
											onChange={handleNumberChange}
											placeholder="Dài"
											className="h-12 flex-1"
										/>
										<Input
											id="width"
											name="width"
											type="number"
											value={formData.width || ""}
											onChange={handleNumberChange}
											placeholder="Rộng"
											className="h-12 flex-1"
										/>
										<Input
											id="height"
											name="height"
											type="number"
											value={formData.height || ""}
											onChange={handleNumberChange}
											placeholder="Cao"
											className="h-12 flex-1"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* enabled / inStock toggles */}
						<div className="flex items-center gap-6 mt-2">
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									name="enabled"
									checked={Boolean(formData.enabled)}
									onChange={handleCheckboxChange}
									className="form-checkbox h-4 w-4"
								/>
								<span className="ml-1">Enabled</span>
							</label>
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									name="inStock"
									checked={Boolean(formData.inStock)}
									onChange={handleCheckboxChange}
									className="form-checkbox h-4 w-4"
								/>
								<span className="ml-1">In Stock</span>
							</label>
						</div>
					</div>
				)}

				{/* Product Images Tab */}
				{currentStep === 1 && (
					<div className="space-y-6">
						<div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
							<input
								type="file"
								multiple
								accept="image/*"
								onChange={handleImageUpload}
								className="hidden"
								id="image-upload"
							/>
							<label htmlFor="image-upload" className="cursor-pointer block">
								<Upload
									className="mx-auto mb-2 text-muted-foreground"
									size={32}
								/>
								<p className="font-medium">Kéo và thả hoặc nhấp để tải lên</p>
								<p className="text-sm text-muted-foreground">
									Hỗ trợ JPG, PNG (max 5MB)
								</p>
							</label>
						</div>

						{images.length > 0 && (
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{images.map((image) => (
									<div key={image.id} className="relative group">
										<Image
											src={image.url || "/placeholder.svg"}
											alt="Product"
											width={500}
											height={500}
											loading="lazy"
											className="w-full h-32 object-cover rounded-lg border border-border"
										/>
										<button
											type="button"
											onClick={() => removeImage(image.id)}
											className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
										>
											<X size={16} />
										</button>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{/* Meta Data Tab */}
				{currentStep === 2 && (
					<div className="space-y-6">
						<Card className="p-6">
							<h2 className="text-lg font-semibold">
								Thông tin mô tả kĩ thuật
							</h2>
							<p className="text-sm text-muted-foreground mb-4">
								Thêm thông số kỹ thuật chi tiết như vật liệu, tính năng, hướng
								dẫn bảo quản, v.v.
							</p>

							<div className="space-y-3 mb-4">
								<div>
									<Label
										htmlFor="detail-name"
										className="text-sm font-medium mb-2 block"
									>
										Thuộc tính
									</Label>
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
										className="h-12"
									/>
								</div>

								<div>
									<Label
										htmlFor="detail-value"
										className="text-sm font-medium mb-2 block"
									>
										Mô tả thuộc tính
									</Label>
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
									className="w-full gap-2 bg-transparent"
									onClick={addDetail}
								>
									<Plus size={18} />
									Thêm mô tả thuộc tính
								</Button>
							</div>

							{formData.details.length > 0 && (
								<div className="space-y-2 pt-4 border-t">
									{formData.details.map((detail, index) => (
										<div
											key={detail.name}
											className="flex items-start justify-between p-3 bg-muted rounded-lg"
										>
											<div className="flex-1">
												<p className="font-medium text-sm">{detail.name}</p>
												<p className="text-sm text-muted-foreground">
													{detail.value}
												</p>
											</div>
											<button
												type="button"
												className="ml-2 text-red-500 hover:text-red-700"
												onClick={() => removeDetail(index)}
											>
												<Trash2 size={18} />
											</button>
										</div>
									))}
								</div>
							)}
						</Card>
					</div>
				)}

				{/* Finish Tab */}
				{currentStep === 3 && (
					<div className="space-y-6">
						<Card className="p-8 text-center">
							<div className="mb-4 text-4xl">✓</div>
							<h2 className="text-2xl font-bold mb-2">Ready to Publish</h2>
							<p className="text-muted-foreground mb-6">
								Review your product information and click publish to add it to
								your store.
							</p>

							<div className="bg-muted p-4 rounded-lg text-left space-y-2 mb-6">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Product Name:</span>
									<span className="font-medium">
										{formData.name || "Not set"}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Category:</span>
									<span className="font-medium">
										{formData.categoryId || "Not set"}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Price:</span>
									<span className="font-medium">
										{formData.price || "Not set"}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Images:</span>
									<span className="font-medium">{images.length} uploaded</span>
								</div>
							</div>
						</Card>
					</div>
				)}

				{/* Navigation Buttons */}
				<div className="flex gap-4 justify-between pt-8 border-t mt-8">
					<Button
						type="button"
						variant="outline"
						onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
						disabled={currentStep === 0}
						className="gap-2"
					>
						<ArrowLeft className="size-5" />
						Trở lại
					</Button>

					{currentStep < steps.length - 1 ? (
						<Button
							type="button"
							onClick={() =>
								setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
							}
							className="gap-2"
						>
							Tiếp theo
							<ArrowRight className="size-5" />
						</Button>
					) : (
						<Button type="submit" className="gap-2">
							<Plus className="size-5" />
							Thêm sản phẩm
						</Button>
					)}
				</div>
			</form>
		</div>
	);
};

export default AddProductForm;
