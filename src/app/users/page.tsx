
"use client";

import MasterLayout from "@/masterLayout/MasterLayout";
import { useAuthorization } from "@/hook/useAuthorization";
import Breadcrumb from "@/components/Breadcrumb";
import UserManagement from "@/components/users/UserManagement";

export default function UserPage() {
    const authorized = useAuthorization(["ROLE_ADMIN", "ROLE_USER_MANAGER"]);
    if (authorized === null) {
        return (
            <div className="flex items-center justify-center h-screen text-muted-foreground">
                Checking authorization...
            </div>
        );
    }

    return (
        <MasterLayout>
            <div className="p-6 space-y-6">
                <Breadcrumb title="User - List" />
                <UserManagement />
            </div>
        </MasterLayout>
    );
}
