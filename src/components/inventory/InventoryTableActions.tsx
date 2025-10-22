"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Edit, PackagePlus, PackageMinus, History } from "lucide-react";
import { inventoryService } from "@/lib/services/inventoryService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ProductInventory } from "@/hook/useInventories";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface InventoryTransaction {
    id: number;
    inventoryId: number;
    quantityChanged: number;
    type: "IMPORT" | "SALE" | "ADJUST";
    transactionDate: string | null;
    note: string;
}

interface InventoryTableActionsProps {
    item: ProductInventory;
    onSuccess: () => void;
}

export function InventoryTableActions({ item, onSuccess }: InventoryTableActionsProps) {
    const [dialogType, setDialogType] = useState<
        "edit" | "import" | "export" | "history" | null
    >(null);
    const [quantity, setQuantity] = useState<number>(0);
    const [note, setNote] = useState<string>("");
    const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [errors, setErrors] = useState<{ quantity?: string; note?: string }>({});

    const handleSubmit = async () => {
        const newErrors: typeof errors = {};

        // Validate ghi chú
        if (!note.trim()) {
            newErrors.note = "Vui lòng nhập ghi chú.";
        }

        // Validate số lượng
        if (dialogType !== "edit" && quantity === 0) {
            newErrors.quantity = "Số lượng nhập/xuất phải khác 0.";
        }

        setErrors(newErrors);

        // Nếu có lỗi thì không gửi request
        if (Object.keys(newErrors).length > 0) return;

        try {
            if (dialogType === "edit") {
                await inventoryService.update(item.productId, { quantity, note });
            } else if (dialogType === "import") {
                await inventoryService.import(item.productId, { quantity, note });
            } else if (dialogType === "export") {
                await inventoryService.export(item.productId, { quantity, note });
            }

            toast.success("Cập nhật tồn kho thành công!");
            setDialogType(null);
            setQuantity(0);
            setNote("");
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi cập nhật tồn kho");
        }
    };

    const loadHistory = async () => {
        try {
            setLoadingHistory(true);
            const data = await inventoryService.getTransactions(item.productId);
            setTransactions(data);
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải lịch sử giao dịch");
        } finally {
            setLoadingHistory(false);
        }
    };

    useEffect(() => {
        if (dialogType === "history") {
            loadHistory();
        }
    }, [dialogType]);

    return (
        <>
            {/* Các nút thao tác */}
            <div className="flex justify-end gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDialogType("edit")}
                    className="flex items-center gap-1"
                >
                    <Edit className="size-4" /> Sửa
                </Button>

                <Button
                    size="sm"
                    onClick={() => setDialogType("import")}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                >
                    <PackagePlus className="size-4" /> Nhập
                </Button>

                <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDialogType("export")}
                    className="flex items-center gap-1"
                >
                    <PackageMinus className="size-4" /> Xuất
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDialogType("history")}
                    className="flex items-center gap-1"
                >
                    <History className="size-4" /> Lịch sử
                </Button>
            </div>

            {/* Dialog Form nhập / xuất / chỉnh sửa */}
            <Dialog open={!!dialogType && dialogType !== "history"} onOpenChange={() => setDialogType(null)}>
                <DialogContent >
                    <DialogHeader>
                        <DialogTitle>
                            {dialogType === "edit"
                                ? "Chỉnh sửa số lượng sản phẩm"
                                : dialogType === "import"
                                    ? "Nhập hàng vào kho"
                                    : "Xuất hàng khỏi kho"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div>
                            <Label>Số lượng</Label>
                            <Input
                                type="number"
                                value={quantity}
                                onChange={(e) => {
                                    let val = Number(e.target.value);
                                    if (dialogType === "import" && val < 0) val = 0;
                                    if (dialogType === "export" && val > 0) val = -val;
                                    setQuantity(val);
                                }}
                                placeholder="Nhập số lượng..."
                                className={errors.quantity ? "border-red-500" : ""}
                            />
                            {errors.quantity && (
                                <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                            )}
                        </div>
                        <div>
                            <Label>Ghi chú</Label>
                            <Input
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Ghi chú (ví dụ: Nhập kho tháng 10)"
                                className={errors.note ? "border-red-500" : ""}
                            />
                            {errors.note && (
                                <p className="text-red-500 text-sm mt-1">{errors.note}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogType(null)}>
                            Hủy
                        </Button>
                        <Button onClick={handleSubmit}>
                            {dialogType === "edit"
                                ? "Cập nhật"
                                : dialogType === "import"
                                    ? "Xác nhận nhập hàng"
                                    : "Xác nhận xuất hàng"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog Lịch sử giao dịch */}
            <Dialog open={dialogType === "history"} onOpenChange={() => setDialogType(null)}>
                <DialogContent className="!w-[95vw] !max-w-[1100px] !max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Lịch sử giao dịch kho</DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="max-h-[400px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Loại</TableHead>
                                    <TableHead>Thay đổi SL</TableHead>
                                    <TableHead>Ngày giao dịch</TableHead>
                                    <TableHead>Ghi chú</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loadingHistory ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">
                                            Đang tải...
                                        </TableCell>
                                    </TableRow>
                                ) : transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">
                                            Chưa có giao dịch nào
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.map((t) => (
                                        <TableRow key={t.id}>
                                            <TableCell>{t.id}</TableCell>
                                            <TableCell>
                                                {t.type === "IMPORT"
                                                    ? "Nhập"
                                                    : t.type === "SALE"
                                                        ? "Xuất"
                                                        : "Điều chỉnh"}
                                            </TableCell>
                                            <TableCell
                                                className={`${
                                                    t.quantityChanged > 0
                                                        ? "text-green-600"
                                                        : t.quantityChanged < 0
                                                            ? "text-red-600"
                                                            : ""
                                                }`}
                                            >
                                                {t.quantityChanged > 0
                                                    ? `+${t.quantityChanged}`
                                                    : t.quantityChanged}
                                            </TableCell>
                                            <TableCell>
                                                {t.transactionDate
                                                    ? new Date(t.transactionDate).toLocaleString()
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>{t.note || "-"}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogType(null)}>
                            Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
