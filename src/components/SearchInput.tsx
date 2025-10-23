import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
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
		<div className={`flex items-center gap-2 rounded-full overflow-hidden w-full max-w-xs border border-gray-300 ${className}`}>
			<div className="w-[500px]">				
				<Input
					type="text"
					placeholder={placeholder}
					value={keyword}
					onChange={(e) => setKeyword(e.target.value)}
					onKeyDown={handleKeyDown}
					className="border-none"
				/>
			</div>

			<div className="border-l">
				<button
					onClick={handleSearch}
					className="text-gray-700 cursor-pointer px-4 py-2 rounded-lg transition-all duration-300"
				>
					<Icon
						icon="lucide:search"
						className="size-5"
					/>
				</button>
			</div>
		</div>
	);
};
