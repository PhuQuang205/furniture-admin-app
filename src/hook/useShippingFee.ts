"use client";

import { useState, useEffect, useCallback } from "react";
import {shippingFeeService} from "@/lib/services/shippingFeeService";
import {ShippingFeeFormData} from "@/components/types";


export interface ShippingFee {
    id: number;
    provinceCode: number;
    provinceName: string;
    fee: number;
    day: number;
}

export interface PagedResponse<T> {
    data: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}


export const useShippingFees = () => {
    const [shippingFees, setShippingFees] = useState<ShippingFee[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Fetch danh sách inventory
    const fetchShippingFees = useCallback(
        async (
            pageNum = page,
            search?: string,
            sortField: string = "id",
            sortDir: "asc" | "desc" = "asc"
        ) => {
            try {
                setLoading(true);
                const res: PagedResponse<ShippingFee> =
                    await shippingFeeService.getAll(pageNum, size, search ?? "", sortField, sortDir);

                setShippingFees(res.data);
                setPage(res.page);
                setTotalPages(res.totalPages);
                setTotalElements(res.totalElements);
            } catch (error) {
                console.error("❌ Failed to fetch inventories:", error);
            } finally {
                setLoading(false);
            }
        },
        [page, size]
    );

    // const createShippingFee = async (shippingFeeData: ShippingFeeFormData) => {
    //     setLoading(true);
    //     try {
    //         const newShippingFee = await shippingFeeService.create({
    //             provinceCode: shippingFeeData.provinceCode,
    //             fee: shippingFeeData.fee,
    //             day: shippingFeeData.day,
    //         });
    //         setShippingFees((prev) => [...prev, newShippingFee]);
    //         return newShippingFee;
    //     } finally {
    //         setLoading(false);
    //     }
    // }
    const createShippingFee = async (shippingFeeData: ShippingFeeFormData) => {
        setLoading(true);
        try {
            const newShippingFee = await shippingFeeService.create({
                provinceCode: shippingFeeData.provinceCode,
                fee: shippingFeeData.fee,
                day: shippingFeeData.day,
            });
            setShippingFees((prev) => [...prev, newShippingFee]);
            return newShippingFee;
        } finally {
            setLoading(false);
        }
    }

    // Khi page thay đổi thì tự fetch lại
    useEffect(() => {
        fetchShippingFees(page);
    }, [page, fetchShippingFees]);

    return {
        shippingFees,
        setShippingFees,
        loading,
        page,
        size,
        totalPages,
        totalElements,
        setPage,
        createShippingFee,
        refetch: fetchShippingFees,
    };
};
