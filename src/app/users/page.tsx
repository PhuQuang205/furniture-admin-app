
"use client";

import MasterLayout from "@/masterLayout/MasterLayout";
import { useAuthorization } from "@/hook/useAuthorization";
import Breadcrumb from "@/components/Breadcrumb";
import UserManagement from "@/components/users/UserManagement";

export default function UserPage() {
    // Kiểm tra quyền truy cập (ROLE_ADMIN hoặc ROLE_USER_MANAGER)
    const authorized = useAuthorization(["ROLE_ADMIN", "ROLE_USER_MANAGER"]);

    // Hook quản lý dữ liệu users (phân trang, xóa, reload...)
    // const {
    //     users,
    //     loading,
    //     totalElements,
    //     page,
    //     totalPages,
    //     size,
    //     setPage,
    //     deleteUser,
    // } = useUsers();

    // Đang kiểm tra quyền
    if (authorized === null) {
        return (
            <div className="flex items-center justify-center h-screen text-muted-foreground">
                Checking authorization...
            </div>
        );
    }

    // ✅ Layout chính
    return (
        <MasterLayout>
            <div className="p-6 space-y-6">
                <Breadcrumb title="User - List" />
                <UserManagement />
            </div>
        </MasterLayout>
    );
}
