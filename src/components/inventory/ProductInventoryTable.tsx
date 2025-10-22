"use client";

import {ProductInventory} from "@/hook/useInventories";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Icon} from "@iconify/react";
import {Edit} from "lucide-react";
import {InventoryTableActions} from "@/components/inventory/InventoryTableActions";
import {format} from "date-fns";

interface ProductInventoryTableProps {
    inventories: ProductInventory[];
    loading: boolean;
    totalElements: number;
    page: number;
    totalPages: number;
    size: number;
    onPageChange: (page: number) => void;
    setInventories: React.Dispatch<React.SetStateAction<ProductInventory[]>>;
    refresh: ()=>void;
}

export default function ProductInventoryTable({
                                                  inventories,
                                                  loading,
                                                  totalElements,
                                                  page,
                                                  totalPages,
                                                  size,
                                                  onPageChange,
    refresh,
                                              }: ProductInventoryTableProps) {

    return (
        <>
                <div className="space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product ID</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Product Name</TableHead>
                                    {/*<TableHead>Category</TableHead>*/}
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Last Updated</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-6">
                                            Loading users...
                                        </TableCell>
                                    </TableRow>
                                ) : inventories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-6">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    inventories.map((productInventory) => (
                                        <TableRow key={productInventory.productId}>
                                            <TableCell>{productInventory.productId}</TableCell>
                                            <TableCell>
                                                <Image
                                                    src={
                                                        productInventory.imageUrl ||
                                                        "https://i.pinimg.com/736x/16/18/20/1618201e616f4a40928c403f222d7562.jpg"
                                                    }
                                                    alt={productInventory.productName}
                                                    width={500}
                                                    height={500}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                    loading="lazy"
                                                />
                                            </TableCell>
                                            {/*<TableCell>{productInventory.productName}</TableCell>*/}
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span>{productInventory.productName}</span>
                                                    {productInventory.quantity === 0 && (
                                                        <span
                                                            className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
        Hết hàng
      </span>
                                                    )}
                                                    {productInventory.quantity > 0 && productInventory.quantity < 5 && (
                                                        <span
                                                            className="px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded-full">
        Sắp hết
      </span>
                                                    )}
                                                </div>
                                            </TableCell>

                                            <TableCell>{productInventory.quantity}</TableCell>

                                            <TableCell>
                                                {productInventory.lastUpdated
                                                    ? format(new Date(productInventory.lastUpdated), "HH:mm:ss dd-MM-yyyy")
                                                    : "—"}
                                            </TableCell>


                                            <TableCell className="text-right flex justify-end gap-2">
                                                {/* View button */}
                                                <InventoryTableActions item={productInventory} onSuccess={refresh} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
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