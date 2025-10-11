"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProfileDropdown from "@/components/ProfileDropdown";

interface NavbarProps {
    onToggleSidebar: () => void;
    isSidebarActive: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarActive }) => {
    const [search, setSearch] = useState("");

    return (
        <header className="w-full border-b bg-background">
            <div className="flex items-center justify-between px-6 py-3">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleSidebar}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        {isSidebarActive ? (
                            <Icon icon="iconoir:arrow-right" className="w-6 h-6" />
                        ) : (
                            <Icon icon="heroicons:bars-3-solid" className="w-6 h-6" />
                        )}
                    </Button>

                    {/* Search */}
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 w-64"
                        />
                        <Icon
                            icon="ion:search-outline"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon">
                        <Icon icon="heroicons:bell" className="w-5 h-5" />
                    </Button>

                    {/*<Button variant="ghost" size="icon">*/}
                    {/*    <Icon icon="heroicons:user-circle" className="w-6 h-6" />*/}
                    {/*</Button>*/}
                    <ProfileDropdown/>
                </div>

            </div>
        </header>
    );
};

export default Navbar;
