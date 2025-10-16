"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRole } from "@/hook/useRole";
import Image from "next/image";

interface SidebarProps {
	isActive: boolean;
}

interface MenuItem {
	label: string;
	icon: string;
	href?: string;
	color?: string;
	children?: { label: string; href: string; color?: string }[];
}

interface MenuGroup {
	title: string;
	items: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isActive }) => {
	const [openMenu, setOpenMenu] = useState<string | null>(null);
	const { hasRole } = useRole();
	const menuGroups: MenuGroup[] = [
		{
			title: "TỔNG QUÁT",
			items: [
				{
					label: "Dashboard",
					icon: "lucide:layout-dashboard",
					href: "/",
				},
			],
		},
		{
			title: "QUẢN LÝ",
			items: [
				...(hasRole(["ROLE_ADMIN", "ROLE_USER_MANAGER"])
					? [
							{
								label: "Quản lý tài khoản",
								icon: "lucide:users",
								href: "/users",
							},
					  ]
					: []),
				{
					label: "Quản lý danh mục",
					icon: "lucide:container",
					href: "/categories",
				},
				{
					label: "Quản lý sản phẩm",
					icon: "lucide:package",
					href: "/products",
				},
				{
					label: "Quản lý đơn hàng",
					icon: "lucide:shopping-cart",
					href: "/orders",
				},
			],
		},
	];

	const handleToggle = (label: string) => {
		setOpenMenu((prev) => (prev === label ? null : label));
	};

	return (
		<aside
			className={cn(
				"h-screen border-r bg-background transition-all duration-300 flex flex-col",
				isActive ? "w-64" : "w-20"
			)}
		>
			<div className="flex items-center gap-2 px-4 py-4 border-b">
				<div className="size-10 rounded-full flex items-center justify-center">
					<Image src="/logo.png" alt="logo" width={500} height={500} />
				</div>
				{isActive && (
					<span className="font-semibold text-lg tracking-tight">Hoang Ha</span>
				)}
			</div>

			{/* Menu */}
			<nav className="flex-1 mt-4 space-y-6 overflow-y-auto">
				{menuGroups.map((group) => (
					<div key={group.title}>
						{/* Nhóm title */}
						{isActive && (
							<div className="px-4 text-xs font-semibold text-muted-foreground uppercase mb-2">
								{group.title}
							</div>
						)}

						{/* Các item */}
						<div className="space-y-1">
							{group.items.map((item) => (
								<div key={item.label}>
									{item.children ? (
										<>
											<button
												onClick={() => handleToggle(item.label)}
												className={cn(
													"flex items-center w-full gap-3 px-4 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
													!isActive && "justify-center"
												)}
											>
												<Icon icon={item.icon} className="w-5 h-5" />
												{isActive && (
													<>
														<span className="flex-1 text-left">
															{item.label}
														</span>
														<Icon
															icon={
																openMenu === item.label
																	? "lucide:chevron-up"
																	: "lucide:chevron-down"
															}
															className="w-4 h-4"
														/>
													</>
												)}
											</button>

											{/* Submenu animation */}
											<div
												className={cn(
													"overflow-hidden transition-all duration-300 ease-in-out",
													openMenu === item.label && isActive
														? "max-h-[500px] opacity-100 translate-y-0"
														: "max-h-0 opacity-0 -translate-y-1"
												)}
											>
												<ul className="pl-8 mt-1 space-y-1">
													{item.children.map((child) => (
														<li key={child.href}>
															<Link
																href={child.href}
																className={cn(
																	"flex items-center gap-2 text-sm py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
																)}
															>
																<span
																	className={cn(
																		"w-2 h-2 rounded-full",
																		child.color || "bg-primary"
																	)}
																/>
																<span>{child.label}</span>
															</Link>
														</li>
													))}
												</ul>
											</div>
										</>
									) : (
										<Link
											href={item.href || "#"}
											className={cn(
												"flex items-center gap-3 px-4 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
												!isActive && "justify-center"
											)}
										>
											<Icon icon={item.icon} className="w-5 h-5" />
											{isActive && <span>{item.label}</span>}
										</Link>
									)}
								</div>
							))}
						</div>
					</div>
				))}
			</nav>

			{/* Footer */}
			<div className="border-t px-4 py-3">
				<button
					className={cn(
						"flex items-center gap-3 text-muted-foreground hover:text-foreground text-sm w-full",
						!isActive && "justify-center"
					)}
				>
					<Icon icon="lucide:log-out" className="w-5 h-5" />
					{isActive && <span>Đăng xuất</span>}
				</button>
			</div>
		</aside>
	);
};

export default Sidebar;
