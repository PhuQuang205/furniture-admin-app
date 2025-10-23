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
import {ShippingFeeFormData} from "@/components/types";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import provinces from "@/data/provinces.json";

// Schema kiểm tra dữ liệu nhập
const shippingFeeFormSchema = z.object({
    provinceCode: z.number().gt(0, "Vui lòng chọn tỉnh hợp lệ"),
    fee: z.number().gt(0, "Phí phải lớn hơn 0"),
    day: z.number().gt(0, "Số ngày phải lớn hơn 0"),
});

interface ShippingFeeFormProps {
    initialData?: ShippingFeeFormData;
    onSubmit: (data: ShippingFeeFormData) => Promise<void>;
    submitLabel?: string;
    loading?: boolean;
    formKey?: string | number;
}

export const ShippingFeeForm: React.FC<ShippingFeeFormProps> = ({
                                                                    initialData,
                                                                    onSubmit,
                                                                    submitLabel = "Save",
                                                                    loading = false,
                                                                    formKey,
                                                                }) => {
    // type ShippingFeeFormData = z.infer<typeof shippingFeeFormSchema>;
    const form = useForm<ShippingFeeFormData>({
        resolver: zodResolver(shippingFeeFormSchema),
        defaultValues: initialData || {
            provinceCode: undefined,
            fee: undefined,
            day: undefined,
        },
    });

    const onFormSubmit = async (values: ShippingFeeFormData) => {
        await onSubmit(values);
        form.reset();
    };

    return (
        <Form {...form} key={formKey}>
            <form
                onSubmit={form.handleSubmit(onFormSubmit)}
                className="space-y-4"
                autoComplete="off"
            >
                {/* Province Code */}
                <FormField
                    control={form.control}
                    name="provinceCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mã tỉnh (provinceCode)</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(value) => form.setValue("provinceCode", Number(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn tỉnh thành" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {provinces.map((province) => (
                                            <SelectItem key={province.code} value={String(province.code)}>
                                                {province.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
                    {loading ? "Saving..." : submitLabel}
                </Button>
            </form>
        </Form>
    );
};
