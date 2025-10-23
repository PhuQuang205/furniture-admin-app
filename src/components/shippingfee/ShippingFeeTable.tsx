"use client";

import {ProductInventory} from "@/hook/useInventories";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Icon} from "@iconify/react";
import {Edit} from "lucide-react";
import {InventoryTableActions} from "@/components/inventory/InventoryTableActions";
import {format} from "date-fns";
import {ShippingFee} from "@/hook/useShippingFee";
import {EditShippingFeeModal} from "@/components/shippingfee/EditShippingFeeModal";
import {useState} from "react";
import {shippingFeeService} from "@/lib/services/shippingFeeService";
import {toast} from "sonner";

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ShippingFeeTableProps {
    shippingFees: ShippingFee[];
    loading: boolean;
    totalElements: number;
    page: number;
    totalPages: number;
    size: number;
    onPageChange: (page: number) => void;
    setShippingFees: React.Dispatch<React.SetStateAction<ShippingFee[]>>;
    refresh: ()=>void;
}

export default function ShippingFeeTable({
                                                  shippingFees,
                                                  loading,
                                                  totalElements,
                                                  page,
                                                  totalPages,
                                                  size,
                                                  onPageChange,
                                                  refresh,
                                              }: ShippingFeeTableProps) {
    const [selectedFee, setSelectedFee] = useState<ShippingFee | null>(null);

    const handleDelete = async (id: number) => {
        try {
            await shippingFeeService.delete(id.toString());
            toast.success(`Đã xóa phí vận chuyển #${id}`);
            refresh(); // reload lại table
        } catch (error) {
            console.error("Error deleting shipping fee:", error);
            toast.error("Xóa thất bại, vui lòng thử lại!");
        }
    };


    return (
        <>
            <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Id</TableHead>
                                <TableHead>Province Code</TableHead>
                                <TableHead>Province Name</TableHead>
                                <TableHead>Fee</TableHead>
                                <TableHead>Day</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6">
                                        Loading shipping fees...
                                    </TableCell>
                                </TableRow>
                            ) : shippingFees.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6">
                                        No shipping fees found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                shippingFees.map((shippingFee) => (
                                    <TableRow key={shippingFee.id}>
                                        <TableCell>{shippingFee.id}</TableCell>
                                        <TableCell>{shippingFee.provinceCode}</TableCell>
                                        <TableCell>{shippingFee.provinceName}</TableCell>
                                        <TableCell>{shippingFee.fee}</TableCell>
                                        <TableCell>{shippingFee.day}</TableCell>
                                        <TableCell className="text-right flex justify-end gap-2">
                                            <Button className="cursor-pointer"
                                                    onClick={() => setSelectedFee(shippingFee)}
                                            >
                                                <Edit className="size-5"/>
                                                {/*Edit*/}
                                            </Button>

                                            {/* Nút Xóa có AlertDialog */}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="p-2"
                                                    >
                                                        <Icon
                                                            icon="lucide:trash-2"
                                                            className="size-4"
                                                            style={{ color: "oklch(63.7% 0.237 25.331)" }}
                                                        />
                                                    </Button>
                                                </AlertDialogTrigger>

                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Xác nhận xoá phí vận chuyển
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Bạn có chắc chắn muốn xoá phí vận chuyển có ID:{" "}
                                                            <b>{shippingFee.id}</b> không? Hành động này không thể hoàn tác.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>

                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(shippingFee.id)}
                                                        >
                                                            Xóa
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>

                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    {/* Modal chỉnh sửa */}
                    {selectedFee && (
                        <EditShippingFeeModal
                            shippingFee={selectedFee}
                            onUpdate={() => {
                                refresh();
                                setSelectedFee(null); // đóng modal sau refresh
                            }}
                        />
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-gray-600">
                            Showing {page * size + 1} to{" "}
                            {Math.min((page + 1) * size, totalElements)} of {totalElements}{" "}
                            entries
                        </div>
                        <div className="flex items-center gap-1">
                            {/* Về trang đầu */}
                            <Button
                                variant="ghost"
                                size="icon"
                                disabled={page === 0}
                                onClick={() => onPageChange(0)}
                                className="w-8 h-8"
                            >
                                <Icon icon="lucide:chevrons-left" className="w-4 h-4" />
                            </Button>

                            {/* Trang trước */}
                            <Button
                                variant="ghost"
                                size="icon"
                                disabled={page === 0}
                                onClick={() => onPageChange(page - 1)}
                                className="w-8 h-8"
                            >
                                <Icon icon="lucide:chevron-left" className="w-4 h-4" />
                            </Button>

                            {/* Các số trang */}
                            {Array.from({ length: totalPages }, (_, i) => (
                                <Button
                                    key={i}
                                    variant={i === page ? "default" : "ghost"}
                                    size="icon"
                                    onClick={() => onPageChange(i)}
                                    className={`w-8 h-8 ${
                                        i === page
                                            ? "bg-blue-500 text-white"
                                            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                    }`}
                                >
                                    {i + 1}
                                </Button>
                            ))}

                            {/* Trang sau */}
                            <Button
                                variant="ghost"
                                size="icon"
                                disabled={page + 1 >= totalPages}
                                onClick={() => onPageChange(page + 1)}
                                className="w-8 h-8"
                            >
                                <Icon icon="lucide:chevron-right" className="w-4 h-4" />
                            </Button>

                            {/* Tới trang cuối */}
                            <Button
                                variant="ghost"
                                size="icon"
                                disabled={page + 1 >= totalPages}
                                onClick={() => onPageChange(totalPages - 1)}
                                className="w-8 h-8"
                            >
                                <Icon icon="lucide:chevrons-right" className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

        </>
    )

}
