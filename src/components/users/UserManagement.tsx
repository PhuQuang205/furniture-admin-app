import {Button} from "@/components/ui/button";
import {Icon} from "@iconify/react";
import UserTable from "@/components/users/UserTable";
import {SearchInput} from "@/components/SearchInput";
import {useState} from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {AddUserModal} from "@/components/users/AddUserModal";
import {useUsers} from "@/hook/useUsers";
import {User} from "@/components/types";

export default function UserManagement() {

    const [keyword] = useState("");
    const [sortField, setSortField] = useState<string>("name");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const handleSearch = (kw: string) => {
        setPage(0);        
        refetch(0, kw);   
    };


    const handleSortChange = (field: string) => {
        setPage(0);
        setSortField(field);
        refetch(0, keyword, field, sortDir);
    };
    const toggleSortDir = () => {
        const newDir = sortDir === "asc" ? "desc" : "asc";
        setSortDir(newDir);
        refetch(0, keyword, sortField, newDir);
    };
    const {
        users,
        setUsers,
        loading,
        totalElements,
        page,
        totalPages,
        size,
        refetch,
        setPage,
        updateUserStatus,
        deleteUser
    } = useUsers();

    return (
        <>
            <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-2 flex-1">
                    <SearchInput
                        placeholder="Search by name or email..."
                        onSearch={handleSearch}
                        initialValue={keyword}
                        className="flex-1"
                    />
                    <Select value={sortField} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Sort field" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Fields</SelectLabel>
                                <SelectItem value="firstName">First name</SelectItem>
                                <SelectItem value="lastName">Last name</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="createdAt">Created At</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={toggleSortDir}
                        className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
                    >
                        {sortDir === "asc" ? (
                            <Icon icon="lucide:arrow-up" className="w-4 h-4" />
                        ) : (
                            <Icon icon="lucide:arrow-down" className="w-4 h-4" />
                        )}
                    </Button>
                </div>
                <AddUserModal
                    onCreate={(newUser) => {
                        setUsers((prev: User[]) => [newUser, ...prev]);
                    }}
                />
            </div>
            <UserTable
                users={users}
                loading={loading}
                size={size}
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                updateUserStatus={updateUserStatus}
                deleteUser={deleteUser}
                onPageChange={setPage}
                setUsers={setUsers}
            />
        </>
    );
}
