"use client";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";
import {useAuthorization} from "@/hook/useAuthorization";

export default function Page() {
    const authorized = useAuthorization(["ROLE_ADMIN", "ROLE_USER_MANAGER"]);

    if (authorized === null) {
        return <div className="flex items-center justify-center h-screen">Checking...</div>;
    }
    return (
    <>
        {/* MasterLayout */}
        <MasterLayout>
            {/* Breadcrumb */}
            <Breadcrumb title='User - List' />

            {/* InvoiceListLayer */}

            <p> Danh sách user</p>
        </MasterLayout>
    </>
    );
}
