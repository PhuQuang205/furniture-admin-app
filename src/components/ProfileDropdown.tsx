"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {useUser} from "@/context/UserContext";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";

const ProfileDropdown = () => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const {user} = useUser();

    // ✅ Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar button */}
            <button
                onClick={() => setOpen(!open)}
                className="flex justify-center items-center rounded-full w-10 h-10 hover:ring-2 hover:ring-primary transition-all"
            >
                <Image
                    src={user?.avatarUrl || "/assets/images/client-image/client1.jpg"}
                    width={40}
                    height={40}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                />
            </button>

            {/* Dropdown */}
            <div
                className={cn(
                    "absolute right-0 mt-3 w-64 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-border transition-all duration-200 origin-top-right z-50",
                    open
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between gap-2 px-4 py-3 bg-primary/10 rounded-t-lg">
                    <div>
                        <h6 className="text-base font-semibold text-primary">
                            {user?.firstName} {user?.lastName}
                        </h6>
                        <span className="text-sm text-muted-foreground">
                             {user?.roles?.[0]?.name.replace("ROLE_", "")} {/* chỉ lấy ROLE_ADMIN => ADMIN */}
                        </span>

                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-muted-foreground hover:text-red-500 transition"
                    >
                        <Icon icon="radix-icons:cross-1" className="w-4 h-4" />
                    </button>
                </div>

                {/* Menu */}
                <ul className="py-2 text-sm">
                    <li>
                        <Link
                            href="/view-profile"
                            className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted transition-colors"
                        >
                            <Icon icon="solar:user-linear" className="w-5 h-5 text-primary" />
                            My Profile
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/email"
                            className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted transition-colors"
                        >
                            <Icon icon="tabler:message-check" className="w-5 h-5 text-primary" />
                            Inbox
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/company"
                            className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted transition-colors"
                        >
                            <Icon icon="icon-park-outline:setting-two" className="w-5 h-5 text-primary" />
                            Setting
                        </Link>
                    </li>
                    <li>
                        <LogoutButton />
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ProfileDropdown;
