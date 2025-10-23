import api from "@/lib/axios";

export const shippingFeeService = {
    async getAll(
        page = 0,
        size = 10,
        keyword= "",
        sortField = "id",
        sortDir = "asc"
    ){
        const params = new URLSearchParams({
            page: String(page),
            size: String(size),
            sortField,
            sortDir,
        });

        if(keyword.trim() !== ""){
            params.append("keyword", keyword.trim());
        }

        const res = await api.get(`/shipping-fees?${params.toString()}`);
        return res.data;
    },

    async create(body: {provinceCode: number; fee: number; day: number}){
        return (await api.post("/shipping-fees", body)).data;
    },
    async update(id: string, body: {fee: number; day: number}){
        return api.put(`/shipping-fees/${id}`, body);
    },
    async delete(id: string){
        return api.delete(`/shipping-fees/${id}`);
    }

}