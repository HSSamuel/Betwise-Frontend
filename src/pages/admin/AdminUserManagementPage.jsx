import React, { useEffect, useState, useCallback } from "react";
import { useApi } from "../../hooks/useApi";
import {
  listUsers,
  adminDeleteUser,
  adminUpdateUserRole,
} from "../../services/adminService";
import Spinner from "../../components/ui/Spinner";
import Card from "../../components/ui/Card"; // Import the Card component
import Button from "../../components/ui/Button"; // Import the Button component
import Pagination from "../../components/ui/Pagination";
import { FaTrashAlt, FaUserShield, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import { useDebounce } from "../../hooks/useDebounce";

// New component for styling user roles
const RoleBadge = ({ role }) => {
  const is_admin = role === "admin";
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        is_admin
          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      }`}
    >
      {role}
    </span>
  );
};

const AdminUserManagementPage = () => {
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: "" });
  const debouncedSearchTerm = useDebounce(filters.search, 500);
  const { data, loading, error, request: fetchUsers } = useApi(listUsers);

  const fetchLatestUsers = useCallback(() => {
    const queryParams = { ...filters, search: debouncedSearchTerm };
    if (!queryParams.search) {
      delete queryParams.search;
    }
    fetchUsers(queryParams);
  }, [filters.page, debouncedSearchTerm, fetchUsers]);

  useEffect(() => {
    fetchLatestUsers();
  }, [fetchLatestUsers]);

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleDelete = async (user) => {
    if (
      window.confirm(`Are you sure you want to delete user ${user.username}?`)
    ) {
      try {
        await adminDeleteUser(user._id);
        toast.success("User deleted.");
        fetchLatestUsers();
      } catch (error) {
        toast.error(error.response?.data?.msg || "Failed to delete user.");
      }
    }
  };

  const handleRoleChange = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    if (window.confirm(`Change ${user.username}'s role to ${newRole}?`)) {
      try {
        await adminUpdateUserRole(user._id, newRole);
        toast.success("Role updated.");
        fetchLatestUsers();
      } catch (error) {
        toast.error(error.response?.data?.msg || "Failed to update role.");
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="mb-6 relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, username, or email..."
          value={filters.search}
          onChange={handleSearchChange}
          className="w-full max-w-md p-2 pl-10 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      {loading && <Spinner />}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Replaced table with a card grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {data?.users.map((user) => (
          <Card key={user._id}>
            <div className="flex items-center space-x-4">
              <img
                src={
                  user.profilePicture ||
                  `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&color=fff`
                }
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-bold">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{user.username}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t dark:border-gray-700 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">Email:</span>
                <span className="text-gray-600 dark:text-gray-300">
                  {user.email}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-semibold">Role:</span>
                <RoleBadge role={user.role} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-semibold">Joined:</span>
                <span className="text-gray-600 dark:text-gray-300">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-end space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRoleChange(user)}
              >
                <FaUserShield className="mr-2" /> Change Role
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(user)}
              >
                <FaTrashAlt className="mr-2" /> Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {!loading && data?.users.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No users found.</p>
      )}

      <Pagination
        currentPage={data?.currentPage || 1}
        totalPages={data?.totalPages || 1}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
      />
    </div>
  );
};

export default AdminUserManagementPage;
