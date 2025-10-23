"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShippingFeeFormData } from "@/components/types";

// ✅ Schema chỉ còn fee và day
const editShippingFeeSchema = z.object({
    fee: z.number().gt(0, "Phí phải lớn hơn 0"),
    day: z.number().gt(0, "Số ngày phải lớn hơn 0"),
});

interface EditShippingFeeFormProps {
    initialData: Pick<ShippingFeeFormData, "fee" | "day">;
    onSubmit: (data: { fee: number; day: number }) => Promise<void>;
    loading?: boolean;
}

export const EditShippingFeeForm: React.FC<EditShippingFeeFormProps> = ({
                                                                            initialData,
                                                                            onSubmit,
                                                                            loading = false,
                                                                        }) => {
    const form = useForm<{ fee: number; day: number }>({
        resolver: zodResolver(editShippingFeeSchema),
        defaultValues: initialData || { fee: 0, day: 0 },
    });

    const onFormSubmit = async (values: { fee: number; day: number }) => {
        await onSubmit(values);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onFormSubmit)}
                className="space-y-4"
                autoComplete="off"
            >
                {/* Fee */}
                <FormField
                    control={form.control}
                    name="fee"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phí vận chuyển (VNĐ)</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Nhập phí vận chuyển"
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Day */}
                <FormField
                    control={form.control}
                    name="day"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Số ngày giao hàng (day)</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Nhập số ngày giao hàng"
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit button */}
                <Button type="submit" disabled={loading}>
                    {loading ? "Đang lưu..." : "Cập nhật"}
                </Button>
            </form>
        </Form>
    );
};
