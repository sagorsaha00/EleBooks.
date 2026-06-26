"use client";

import React from "react";
import { useUsers, useDeleteUser,useUpdateUserRole } from "../../../lib/getData";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function MangeUserSection() {
  const { data: users, isLoading, isError, error } = useUsers();
  const deleteUserMutation = useDeleteUser();
  const updateUserRoleMutation = useUpdateUserRole();

  const handleRoleChange = (userId, newRole) => {
    updateUserRoleMutation.mutate({ userId, newRole });
  };
  const handleDelete = (userId) => {
  deleteUserMutation.mutate(userId);
  };

  if (isLoading) {
    return <div className="p-6 text-center font-medium">Loading users...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-error font-medium">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 bg-base-100 rounded-xl shadow-sm max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-base-content">Manage Users</h2>

      <div className="space-y-3">
        {users && users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-base-200/50 rounded-xl gap-4 hover:bg-base-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Rounded Picture Option */}
                {user.pic ? (
                  <img
                    src={user.pic}
                    alt={user.name || "User"}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center uppercase shrink-0">
                    {user.name ? user.name[0] : "U"}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-base-content leading-tight">
                    {user.name}
                  </h4>
                  <p className="text-sm text-base-content/60">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-13 sm:ml-0">
                <select
                  className="select select-bordered select-sm rounded-lg bg-base-100"
                  defaultValue={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="librarian">Librarian</option>
                </select>

                <button
                  onClick={() => handleDelete(user._id)}
                  className="btn btn-error cursor-pointer btn-sm rounded-lg text-red btn-square h-9 w-9 p-0 flex items-center justify-center"
                  aria-label="Delete user"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 text-base-content/50 bg-base-200/30 rounded-xl">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}
