"use client";

import { FC } from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils"; // tiện cho merge class nếu bạn dùng shadcn setup

interface BreadcrumbProps {
    title: string;
    className?: string;
}

const Breadcrumb: FC<BreadcrumbProps> = ({ title, className }) => {
    return (
        <div
            className={cn(
                "flex flex-wrap items-center justify-between gap-3 mb-6",
                className
            )}
        >
            {/* Tiêu đề trái */}
            <h6 className="text-lg font-semibold text-foreground">{title}</h6>

            {/* Breadcrumb bên phải */}
            <ul className="flex items-center gap-2 text-sm text-muted-foreground">
                <li>
                    <Link
                        href="/"
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        <span>Dashboard</span>
                    </Link>
                </li>

                <li className="select-none text-muted-foreground">/</li>

                <li className="text-foreground font-medium">{title}</li>
            </ul>
        </div>
    );
};

export default Breadcrumb;
