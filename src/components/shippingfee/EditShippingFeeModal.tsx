"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditShippingFeeForm } from "@/components/shippingfee/EditShippingFeeForm";
import { ShippingFee } from "@/hook/useShippingFee";
import { shippingFeeService } from "@/lib/services/shippingFeeService";
import {toast} from "sonner";

interface EditShippingFeeModalProps {
    shippingFee: ShippingFee | null;
    onUpdate: () => void;
}

export const EditShippingFeeModal: React.FC<EditShippingFeeModalProps> = ({ shippingFee, onUpdate }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setOpen(!!shippingFee);
    }, [shippingFee]);

    if (!shippingFee) return null;

    const handleUpdate = async (data: { fee: number; day: number }) => {
        try {
            setLoading(true);
            await shippingFeeService.update(shippingFee.id.toString(), data);
            onUpdate(); // refresh table
            toast.success("Cập nhật phí vận chuyển thành công!");
            setOpen(false);
        } catch{
            toast.error("Cập nhật thất bại. Vui lòng thử lại!");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sửa phí vận chuyển</DialogTitle>
                </DialogHeader>

                <EditShippingFeeForm
                    initialData={{
                        fee: shippingFee.fee,
                        day: shippingFee.day,
                    }}
                    onSubmit={handleUpdate}
                    loading={loading}
                />
            </DialogContent>
        </Dialog>
    );
};
