"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Icon } from "@iconify/react";

export default function LogoutButton() {
    const router = useRouter();
    const { setUser } = useUser();

    const handleLogout = () => {
        // 1️⃣ Xóa token (nếu có)
        localStorage.removeItem("accessToken");

        // 2️⃣ Xóa user context
        setUser(null);

        // 3️⃣ Điều hướng về trang login
        router.push("/login");
    };

    return (
        <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
        >
            <Icon icon="lucide:power" className="w-5 h-5" />
            Log Out
        </button>
    );
}
