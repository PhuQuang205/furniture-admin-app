import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

interface SearchInputProps {
    placeholder?: string;
    onSearch: (keyword: string) => void;
    initialValue?: string;
    className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
                                                            placeholder = "Search...",
                                                            onSearch,
                                                            initialValue = "",
                                                            className = "",
                                                        }) => {
    const [keyword, setKeyword] = useState(initialValue);

    const handleSearch = () => {
        onSearch(keyword.trim());
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <div className={`flex items-center gap-2 w-full max-w-xs ${className}`}>
            <div className="relative w-full">
                <Icon
                    icon="lucide:search"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
                />
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-9 pr-3 py-2 border rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <Button
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
                Search
            </Button>
        </div>
    );
};
