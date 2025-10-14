import api from "@/lib/axios";
import {UserFormData, UserRequest} from "@/components/types";

export const userService = {
    async getAll(
        page = 0,
        size = 5,
        keyword = "",
        sortField = "id",
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

        const res = await api.get(`/user?${params.toString()}`);
        return res.data;
    },

    async getRoles(){
        const res = await api.get(`/role`);
        return res.data;
    },

    updateUserStatus: async (id: number, enabled: boolean) => {
        const res = await api.patch(`/user/${id}?enabled=${enabled}`);
        return res.data;
    },

    async deleteUser(id: number) {
        const res = await api.delete(`/user/${id}`);
        return res.data;
    },

    async createUser(userData: UserFormData) {
        const formData = new FormData();

        // 🧩 Đóng gói JSON dưới dạng Blob
        formData.append(
            "user",
            new Blob([JSON.stringify(userData)], { type: "application/json" })
        );

        // 🖼️ Nếu có avatar, thêm vào
        if (userData.avatarFile) {
            formData.append("image", userData.avatarFile);
        }

        // 🚀 Gọi API
        const res = await api.post("/user", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return res.data;
    },


    async updateUser(userData: UserFormData) {
        const formData = new FormData();

        // 🧩 Đóng gói JSON dưới dạng Blob
        formData.append(
            "user",
            new Blob([JSON.stringify(userData)], { type: "application/json" })
        );

        // 🖼️ Nếu có avatar, thêm vào
        if (userData.avatarFile) {
            formData.append("image", userData.avatarFile);
        }

        // 🚀 Gọi API
        const res = await api.put("/user", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return res.data;
    }



};
