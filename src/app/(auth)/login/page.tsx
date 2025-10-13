"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FurnitureLogo } from "@/components/FurnitureLogo";
import { toast } from "sonner";
import { login } from "@/lib/services/authService";
import { useRouter } from "next/navigation";

const LoginPage = () => {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	
	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			await login(email, password);
			router.push("/");
		} catch (err) {
			toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center p-8 bg-white">
			<div className="w-full max-w-md space-y-8">
				<div className="space-y-2">
					<FurnitureLogo active={false} />
				</div>

				<div className="space-y-3">
					<h1 className="text-4xl font-semibold text-gray-900">Đăng nhập</h1>
					<p className="text-sm text-black">
						Vui lòng điền thông tin chi tiết của bạn để truy cập tài khoản.
					</p>
				</div>

				<form className="space-y-6" onSubmit={handleLogin}>
					<div className="space-y-2">
						<Label htmlFor="email" className="text-md font-semibold text-black">
							Email
						</Label>
						<Input
							id="email"
							type="email"
							placeholder="Nhập địa chỉ email"
							className="h-12 border-gray-300 px-5"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="password"
							className="text-md font-semibold text-black"
						>
							Mật khẩu
						</Label>
						<Input
							id="password"
							type="password"
							placeholder="Nhập mật khẩu"
							className="h-12 px-5 border-gray-300"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					{error && <p className="text-red-500 text-sm">{error}</p>}

					{/*<div className="flex items-center justify-between">*/}
					{/*	<Link*/}
					{/*		href="/forgot-password"*/}
					{/*		className="text-sm font-medium text-greenly underline underline-offset-4"*/}
					{/*	>*/}
					{/*		Quên mật khẩu?*/}
					{/*	</Link>*/}
					{/*</div>*/}

					<div className="flex flex-col">
						<Button
							type="submit"
							disabled={loading}
							className="bg-greenly mb-6 h-12 text-md cursor-pointer hover:bg-greenly/90"
						>
							{loading ? "Đang đăng nhập..." : "Đăng nhập"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
