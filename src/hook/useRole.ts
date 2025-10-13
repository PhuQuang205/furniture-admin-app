

// import { useUser } from "@/context/UserContext";
//
// export const useRole = () => {
//     const { user } = useUser();
//
//     const hasRole = (roleName: string) => {
//         return user?.roles?.some(r => r.name === roleName);
//     };
//
//     return {
//         isAdmin: hasRole("ROLE_ADMIN"),
//         isProductManager: hasRole("ROLE_PRODUCT_MANAGER"),
//         isInventoryManager: hasRole("ROLE_INVENTORY_MANAGER"),
//         isOrderManager: hasRole("ROLE_ORDER_MANAGER"),
//         isShipper: hasRole("ROLE_SHIPPER"),
//         isAssistant: hasRole("ROLE_ASSISTANT"),
//         isCustomer: hasRole("ROLE_CUSTOMER"),
//         hasRole,
//     };
// };

import { useUser } from "@/context/UserContext";

export function useRole() {
    const { user } = useUser();
    const hasRole = (roles: string[]) =>
        user?.roles?.some(r => roles.includes(r.name));
    return { hasRole };
}
