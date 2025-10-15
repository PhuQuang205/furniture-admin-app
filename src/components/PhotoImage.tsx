"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface PhotoImageProps {
	initialUrl?: string; // 🖼️ Ảnh hiện tại của user (nếu có)
	onFileSelect: (file: File | null) => void; // callback gửi file lên cha
}

export const PhotoImage: React.FC<PhotoImageProps> = ({ initialUrl, onFileSelect }) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl || null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		setPreviewUrl(initialUrl || null);
	}, [initialUrl]);

	// 🟢 Khi chọn file
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		if (file) {
			const preview = URL.createObjectURL(file);
			setPreviewUrl(preview);
			onFileSelect(file);
		} else {
			setPreviewUrl(initialUrl || null);
			onFileSelect(null);
		}
	};

	// 🟢 Khi click vào ảnh hoặc nút để mở dialog
	const handleClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className="flex flex-col items-center justify-center gap-3">
			{/* Ảnh hiển thị */}
			<div
				className="relative w-40 h-40 rounded-full overflow-hidden border border-gray-300 cursor-pointer hover:opacity-80 transition"
				onClick={handleClick}
			>
				{previewUrl ? (
					<Image
						src={previewUrl}
						alt="User Avatar"
						fill
						className="object-cover"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
						No Image
					</div>
				)}
			</div>

			{/* Nút chọn ảnh */}
			<Button variant="outline" onClick={handleClick}>
				{previewUrl ? "Change Photo" : "Upload Photo"}
			</Button>

			{/* Input ẩn */}
			<input
				type="file"
				accept="image/*"
				ref={fileInputRef}
				onChange={handleFileChange}
				className="hidden"
			/>
		</div>
	);
};
