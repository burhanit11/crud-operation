import { useState } from "react";
import axios from "axios";

export default function UsersTable({
  users,
  page,
  totalPages,
  setPage,
  search,
  setSearch,
  refreshUsers,
}) {
  const [editingUser, setEditingUser] = useState(null); // for update
  const [updateData, setUpdateData] = useState({
    name: "",
    email: "",
    username: "",
    address: "",
    password: "",
  });

  const [deletingUser, setDeletingUser] = useState(null);

  // Delete user
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/v1/users/deleteUser/${deletingUser._id}`);
      setDeletingUser(null);
      refreshUsers();
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // Open update modal
  const openUpdate = (user) => {
    setEditingUser(user);
    setUpdateData({
      name: user.name || "",
      email: user.email || "",
      username: user.username || "",
      address: user.address || "",
    });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/v1/users/updateUser/${editingUser._id}`,
        updateData,
      );
      setEditingUser(null);
      refreshUsers();
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold text-gray-700 mb-4">Users List</h2>

      <input
        type="text"
        placeholder="Search by name"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Address</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.address}</td>
                <td className="border px-4 py-2 space-x-2 w-40">
                  <button
                    className="px-1 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    onClick={() => openUpdate(user)}
                  >
                    Update
                  </button>
                  <button
                    className="px-1 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => setDeletingUser(user)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="border px-4 py-2 text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
        >
          Next
        </button>
      </div>

      {/* Update Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Update User</h3>
            <form className="space-y-3" onSubmit={handleUpdateSubmit}>
              <input
                type="text"
                name="name"
                value={updateData.name}
                onChange={handleUpdateChange}
                placeholder="Name"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="email"
                name="email"
                value={updateData.email}
                onChange={handleUpdateChange}
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="username"
                value={updateData.username}
                onChange={handleUpdateChange}
                placeholder="Username"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <textarea
                name="address"
                value={updateData.address}
                onChange={handleUpdateChange}
                placeholder="Address"
                className="w-full p-2 border border-gray-300 rounded"
              />

              <div className="flex justify-end space-x-2 mt-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-sm">
            <h3 className="text-xl font-semibold mb-4 text-red-600">
              Delete User
            </h3>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <strong>{deletingUser.name}</strong>?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
