"use client"
import Navbar from "@/components/layout/Navbar";
// import Sidebar from "@/components/layout/Sidebar"; // nếu có
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";

const MasterLayout = ({ children }: { children: React.ReactNode }) => {
    const [sidebarActive, setSidebarActive] = useState(true);

    return (
        <section className="flex h-screen">
            {/* Sidebar */}
            <Sidebar isActive={sidebarActive} />

            {/* Main */}
            <main className="flex-1 flex flex-col">
                <Navbar
                    onToggleSidebar={() => setSidebarActive(!sidebarActive)}
                    isSidebarActive={sidebarActive}
                />

                <div className="flex-1 overflow-y-auto p-6">{children}</div>
            </main>
        </section>
    );
};

export default MasterLayout;
