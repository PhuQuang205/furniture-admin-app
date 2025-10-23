"use client";

import { ShippingFee, useShippingFees } from "@/hook/useShippingFee";
import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ShippingFeeForm } from "@/components/shippingfee/ShippingFeeForm";
import { ShippingFeeFormData } from "@/components/types";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface AddShippingFeeModalProps {
	onCreate: (newShippingFee: ShippingFee) => void;
}

export const AddShippingFeeModal: React.FC<AddShippingFeeModalProps> = ({
	onCreate,
}) => {
	const [open, setOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [formKey, setFormKey] = useState(Date.now());
	const { createShippingFee } = useShippingFees();

	const handleCreate = async (data: ShippingFeeFormData) => {
		try {
			setLoading(true);
			const newShippingFee = await createShippingFee(data);
			onCreate?.(newShippingFee);
			setOpen(false);
			toast.success("Thêm phí vận chuyển thành công!");
		} catch (err) {
			console.error(err);
			toast.error("Thêm chi phí vận chuyên thất bại. Vui lòng thử lại!");
		} finally {
			setLoading(false);
		}
	};

	const handleOpen = () => {
		setFormKey(Date.now());
		setOpen(true);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button
					onClick={handleOpen}
					className="bg-transparent flex items-center gap-1.5 h-9 border border-gray-300 rounded-full px-2 py-1 text-gray-700 cursor-pointer"
				>
					<Plus className="size-4" />
					<p className="text-sm">Thêm phí ship</p>
				</button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Thêm phí ship</DialogTitle>
				</DialogHeader>
				<ShippingFeeForm
					onSubmit={handleCreate}
					loading={loading}
					formKey={formKey}
				/>
			</DialogContent>
		</Dialog>
	);
};
