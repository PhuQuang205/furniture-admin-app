"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-3xl font-semibold mb-2">403 – Access Denied</h1>
            <p className="text-muted-foreground mb-6">
                Bạn không có quyền truy cập vào trang này.
            </p>
            <Link href="/">
                <Button variant="default">Quay lại trang chủ</Button>
            </Link>
        </div>
    );
}
