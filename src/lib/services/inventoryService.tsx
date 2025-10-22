import api from "@/lib/axios";

export const inventoryService = {
    async getAll(
        page = 0,
        size = 10,
        keyword = "",
        sortField = "productId",
        sortDir = "asc"
    ) {
        const params = new URLSearchParams({
            page: String(page),
            size: String(size),
            sortField,
            sortDir,
        });

        if (keyword.trim() !== "") {
            params.append("keyword", keyword.trim());
        }

        const res = await api.get(`/inventory?${params.toString()}`);
        return res.data;
    },
    async update(id: number, body: { quantity: number; note: string }) {
        return api.put(`/inventory/${id}`, body);
    },

    async import(id: number, body: { quantity: number; note: string }) {
        return api.post(`/inventory/${id}/import`, body);
    },

    async export(id: number, body: { quantity: number; note: string }) {
        return api.post(`/inventory/${id}/export`, body);
    },
    async getTransactions(inventoryId: number) {
        const res = await api.get(`/inventory/transaction/${inventoryId}`);
        return res.data;
    },
};
