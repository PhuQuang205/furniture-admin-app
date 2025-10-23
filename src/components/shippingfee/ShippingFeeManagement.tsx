"use client";

import {useState} from "react";
import {useInventories} from "@/hook/useInventories";
import {SearchInput} from "@/components/SearchInput";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Icon} from "@iconify/react";
import ProductInventoryTable from "@/components/inventory/ProductInventoryTable";
import ShippingFeeTable from "@/components/shippingfee/ShippingFeeTable";
import {ShippingFee, useShippingFees} from "@/hook/useShippingFee";
import {AddShippingFeeModal} from "@/components/shippingfee/AddShippingFeeModal";

export const ShippingFeeManagement = () => {
    const [keyword] = useState("");
    const [sortField, setSortField] = useState<string>("id");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const handleSearch = (kw: string)=> {
        setPage(0);
        refetch(0, kw);
    }

    const handleSortChange = (field: string) => {
        setPage(0);
        setSortField(field);
        refetch(0, keyword, field, sortDir);
    };

    const toggleSortDir = () => {
        const newDir = sortDir === "asc" ? "desc" : "asc";
        setSortDir(newDir);
        refetch(0, keyword, sortField, newDir);
    };

    const handleCreate = () => {
        refetch();
    };

    const {
        shippingFees,
        setShippingFees,
        loading,
        totalElements,
        page,
        totalPages,
        size,
        refetch,
        setPage,
    } = useShippingFees();

    return (
        <>
            <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-2 flex-1">
                    <SearchInput
                        placeholder="Search by name or email..."
                        onSearch={handleSearch}
                        initialValue={keyword}
                        className="flex-1"
                    />
                    <Select value={sortField} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Sort field" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Fields</SelectLabel>
                                <SelectItem value="id">Id</SelectItem>
                                <SelectItem value="fee">Fee</SelectItem>
                                <SelectItem value="day">Day</SelectItem>
                                {/*<SelectItem value="createdAt">Created At</SelectItem>*/}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={toggleSortDir}
                        className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
                    >
                        {sortDir === "asc" ? (
                            <Icon icon="lucide:arrow-up" className="w-4 h-4" />
                        ) : (
                            <Icon icon="lucide:arrow-down" className="w-4 h-4" />
                        )}
                    </Button>
                </div>
                <AddShippingFeeModal onCreate={handleCreate} />
            </div>
            <ShippingFeeTable
                shippingFees={shippingFees}
                loading={loading}
                size={size}
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                onPageChange={setPage}
                setShippingFees={setShippingFees}
                refresh={refetch}
            />
        </>
    )
}