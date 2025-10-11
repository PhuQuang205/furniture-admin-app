"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { FurnitureLogo } from "@/components/FurnitureLogo";
import { PhotoUpload } from "@/components/photo-upload";

const CompleteProfile = () => {	

	return (
		<div className="flex items-center justify-center p-8 bg-white">
			<div className="w-full max-w-md space-y-8">
				<div className="space-y-2">
					<FurnitureLogo active={false} />
				</div>

				<div className="space-y-3">
					<h1 className="text-4xl font-semibold text-gray-900">
						Thông tin cá nhân
					</h1>
					<p className="text-sm text-black">
						Đừng lo lắng, chỉ có bạn mới nhìn thấy được thông tin này.
					</p>
				</div>

				<form className="space-y-6">
					<div className="inline-flex flex-col gap-3 justify-start">
						<h3 className="text-md font-semibold text-black">
							Ảnh đại diện{" "}
							<span className="text-sm text-black/80">(Nếu có)</span>
						</h3>
						<PhotoUpload />
					</div>

					<div className="space-y-2">
						<Label htmlFor="phone" className="text-md font-semibold text-black">
							Số điện thoại
						</Label>
						<div className="relative">
							<Input
								id="phone"
								type="text"
								placeholder="Nhập số điện thoại"
								className="h-12 px-5 border-gray-300"
							/>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="phone" className="text-md font-semibold text-black">
							Giới tính
						</Label>
						<div className="relative">
							<Select>
								<SelectTrigger className="w-full h-12 rounded-full text-md px-5 border-gray-300">
									<SelectValue placeholder="Chọn giới tính" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem className="py-2" value="male">
										Nam
									</SelectItem>
									<SelectItem className="py-2" value="female">
										Nữ
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<Button className="bg-greenly w-full mb-6 h-12 text-md cursor-pointer hover:bg-greenly/90">
						Đăng ký
					</Button>
				</form>
			</div>
		</div>
	);
};

export default CompleteProfile;
