// // hooks/useAuthorization.ts
// "use client";
//
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { useUser } from "@/context/UserContext";
//
// export const useAuthorization = (allowedRoles: string[]) => {
//     const { user } = useUser();
//     const router = useRouter();
//
//     useEffect(() => {
//         // Nếu chưa đăng nhập thì đẩy về login
//         if (!user) {
//             router.push("/login");
//             return;
//         }
//
//         // Lấy danh sách role name từ user
//         const userRoles = user.roles?.map((r) => r.name) || [];
//
//         // Nếu không có role nào trong danh sách được phép → chặn
//         const hasPermission = userRoles.some((role) =>
//             allowedRoles.includes(role)
//         );
//
//         if (!hasPermission) {
//             router.push("/forbidden"); // Trang 403 Forbidden
//         }
//     }, [user, router, allowedRoles]);
// };
//

// hooks/useAuthorization.ts
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";

export const useAuthorization = (allowedRoles: string[]) => {
    const { user, loading } = useUser();
    const router = useRouter();
    const [authorized, setAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        if (loading) return; // chờ load user xong

        if (!user) {
            router.replace("/login");
            return;
        }

        const userRoles = user.roles?.map(r => r.name) || [];
        const hasPermission = userRoles.some(role => allowedRoles.includes(role));

        if (!hasPermission) {
            router.replace("/forbidden");
            return;
        }

        setAuthorized(true);
    }, [user, loading, router, allowedRoles]);

    return authorized;
};
