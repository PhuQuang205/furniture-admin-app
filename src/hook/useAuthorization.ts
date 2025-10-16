"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";

export const useAuthorization = (allowedRoles: string[]) => {
    const { user, loading } = useUser();
    const router = useRouter();
    const [authorized, setAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        if (loading) return;

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
