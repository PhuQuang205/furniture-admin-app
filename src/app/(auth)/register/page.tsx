"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FurnitureLogo } from "@/components/FurnitureLogo";

export const RegisterPage = () => {
	return (
		<div className="flex items-center justify-center p-8 bg-white">
			<div className="w-full max-w-md space-y-8">
				<div className="space-y-2">
					<FurnitureLogo active={false} />
				</div>

				<div className="space-y-3">
					<h1 className="text-4xl font-semibold text-black">Đăng ký</h1>
					<p className="text-sm text-black">
						Điền thông tin của bạn phía bên dưới hoặc tài khoản google.
					</p>
				</div>

				<form className="space-y-6">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label
								htmlFor="firstName"
								className="text-md font-semibold text-black"
							>
								Họ
							</Label>
							<Input
								id="firstName"
								type="text"
								placeholder="Nhập họ"
								className="h-12 border-gray-300 px-5"
							/>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor="lastName"
								className="text-md font-semibold text-black"
							>
								Tên
							</Label>
							<Input
								id="lastName"
								type="text"
								placeholder="Nhập tên"
								className="h-12 px-5 border-gray-300"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email" className="text-md text-black font-semibold">
							Email
						</Label>
						<Input
							id="email"
							type="email"
							placeholder="Nhập địa chỉ email"
							className="h-12 border-gray-300 px-5"
						/>
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="password"
							className="text-md text-black font-semibold"
						>
							Mật khẩu
						</Label>
						<div className="relative">
							<Input
								id="password"
								type="password"
								placeholder="Nhập mật khẩu"
								className="h-12 pr-10 border-gray-300 px-5"
							/>
						</div>
					</div>

					<div className="flex items-start space-x-2">
						<Checkbox id="terms" className="size-5 border-gray-300" />
						<Label
							htmlFor="terms"
							className="text-sm text-black leading-relaxed"
						>
							Đồng ý với{" "}
							<Link href="/terms" className="underline underline-offset-4">
								Điều khoản
							</Link>{" "}
							và{" "}
							<Link href="/privacy" className="underline underline-offset-4">
								Chính sách bảo mật
							</Link>
						</Label>
					</div>
					<Button className="w-full bg-greenly mb-6 h-12 text-md cursor-pointer hover:bg-greenly/90">
						<Link href="/complete-profile" className="size-">
							Đăng ký
						</Link>
					</Button>
					{/* <div className="flex flex-col">
						<div className="flex items-center my-6">
							<div className="flex-grow border-t border-gray-300"></div>
							<span className="mx-4 text-gray-500 text-sm">
								hoặc đăng ký với
							</span>
							<div className="flex-grow border-t border-gray-300"></div>
						</div>

						<Button
							type="button"
							variant="outline"
							className="w-full h-12 border-gray-200 cursor-pointer hover:bg-greenly/10 bg-transparent"
						>
							<svg className="size-6" viewBox="0 0 24 24">
								<path
									fill="#4285F4"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="#34A853"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="#FBBC05"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="#EA4335"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
							Đăng ký bằng Google
						</Button>
					</div> */}

					<div className="text-center">
						<span className="text-sm text-gray-600">
							Đã có tài khoản?{" "}
							<Link
								href="/login"
								className="text-md text-greenly underline underline-offset-4"
							>
								Đăng nhập
							</Link>
						</span>
					</div>
				</form>
			</div>
		</div>
	);
};

export default RegisterPage;
