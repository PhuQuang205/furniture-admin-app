"use client";

import {useAuthorization} from "@/hook/useAuthorization";
import MasterLayout from "@/masterLayout/MasterLayout";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import React from "react";
import Link from "next/link";
import {ProductManagement} from "@/components/products/ProductManagement";
import {InventoryManagement} from "@/components/inventory/InventoryManagement";


type BreadcrumbItemType = {
    label: string;
    href?: string;
};

const InventoryPage =() =>{
    const authorized = useAuthorization(["ROLE_ADMIN", "ROLE_INVENTORY_MANAGER"]);
    if (authorized === null) {
        return (
            <div className="flex items-center justify-center h-screen text-muted-foreground">
                Checking authorization...
            </div>
        );
    }

    const breadcrumbs: BreadcrumbItemType[] = [
        {
            label: "Dashboard",
            href: "/",
        },
        {
            label: "Quản lý kho",
        },
    ];
    return (
        <MasterLayout>
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Danh sách sản phẩm trong kho</h1>
                    <Breadcrumb>
                        <BreadcrumbList>
                            {breadcrumbs.map((item, index) => {
                                const isLast = index === breadcrumbs.length - 1;
                                return (
                                    <React.Fragment key={index}>
                                        <BreadcrumbItem>
                                            {item.href && !isLast ? (
                                                <BreadcrumbLink asChild>
                                                    <Link href={item.href}>{item.label}</Link>
                                                </BreadcrumbLink>
                                            ) : (
                                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                            )}
                                        </BreadcrumbItem>

                                        {!isLast && <BreadcrumbSeparator />}
                                    </React.Fragment>
                                );
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <InventoryManagement/>
            </div>
        </MasterLayout>
    )


}

export default InventoryPage;