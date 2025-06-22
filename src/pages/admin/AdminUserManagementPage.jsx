import React, { useEffect, useState, useCallback } from "react";
import { useApi } from "../../hooks/useApi";
import {
  listUsers,
  adminDeleteUser,
  adminUpdateUserRole,
} from "../../services/adminService";
import Spinner from "../../components/ui/Spinner";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Pagination from "../../components/ui/Pagination";
import { FaTrashAlt, FaUserShield, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import { useDebounce } from "../../hooks/useDebounce";

const RoleBadge = ({ role }) => {
  const is_admin = role === "admin";
  return (
    <span
      className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
        is_admin
          ? "bg-purple-200 text-purple-800" // Darker purple text
          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      }`}
    >
      {role}
    </span>
  );
};

const AdminUserManagementPage = () => {
  const [filters, setFilters] = useState({ page: 1, limit: 15, search: "" });
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

  // Separate users into admins and regular users for rendering
  const admins = data?.users.filter((u) => u.role === "admin") || [];
  const regularUsers = data?.users.filter((u) => u.role !== "admin") || [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="mb-6 flex justify-between items-center">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, username, or email..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full max-w-md p-2 pl-10 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        {data && data.totalCount > 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">{data.totalCount}</span> Users
          </div>
        )}
      </div>

      {loading && <Spinner />}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Admins Section */}
      {admins.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-3 mt-4 text-purple-700 dark:text-purple-400">
            Administrators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
            {admins.map((user) => (
              <Card
                key={user._id}
                className="!p-4 flex flex-col bg-purple-50 dark:bg-gray-800 border-2 border-purple-500"
              >
                {/* Card content is the same, just the container is styled */}
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          user.profilePicture ||
                          `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=8A2BE2&color=fff`
                        }
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-base font-bold truncate">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                    <RoleBadge role={user.role} />
                  </div>
                  <div className="mt-3 text-xs space-y-1">
                    <p className="truncate text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">Email:</span> {user.email}
                    </p>
                    <p>
                      <span className="font-semibold">Joined:</span>{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t dark:border-gray-700 flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="!py-1 !px-2"
                    onClick={() => handleRoleChange(user)}
                  >
                    <FaUserShield className="mr-1.5" /> Change Role
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    className="!py-1 !px-2"
                    onClick={() => handleDelete(user)}
                  >
                    <FaTrashAlt className="mr-1.5" /> Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Regular Users Section */}
      {regularUsers.length > 0 && (
        <>
          {admins.length > 0 && (
            <h2 className="text-xl font-semibold mb-3 mt-4">Users</h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {regularUsers.map((user) => (
              <Card
                key={user._id}
                className="!p-4 flex flex-col border-2 border-blue-500 bg-blue-50 dark:bg-gray-800"
              >
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          user.profilePicture ||
                          `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&color=fff`
                        }
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-base font-bold truncate">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                    <RoleBadge role={user.role} />
                  </div>
                  <div className="mt-3 text-xs space-y-1">
                    <p className="truncate text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">Email:</span> {user.email}
                    </p>
                    <p>
                      <span className="font-semibold">Joined:</span>{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t dark:border-gray-700 flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="!py-1 !px-2"
                    onClick={() => handleRoleChange(user)}
                  >
                    <FaUserShield className="mr-1.5" /> Change Role
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    className="!py-1 !px-2"
                    onClick={() => handleDelete(user)}
                  >
                    <FaTrashAlt className="mr-1.5" /> Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

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
