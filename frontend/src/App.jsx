import { useState, useEffect } from "react";
import axios from "axios";
import SignupForm from "./components/SignupForm";
import UsersTable from "./components/UsersTable";

function App() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  // Fetch users whenever page or search changes
  useEffect(() => {
    getUsers();
  }, [page, search]);

  const getUsers = async () => {
    try {
      const res = await axios.get(
        `/api/v1/users/getUsers?page=${page}&limit=10&name=${search}`,
      );
      setUsers(res.data?.data?.users || []);
      setTotalPages(res.data?.data?.pages || 1);
    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold  text-center mb-6 text-blue-700">
        User Management
      </h1>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <SignupForm refreshUsers={getUsers} />
      </div>

      <div className="max-w-5xl mx-auto mt-8 bg-white p-6 rounded shadow">
        <UsersTable
          users={users}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          search={search}
          setSearch={setSearch}
          refreshUsers={getUsers}
        />
      </div>
    </div>
  );
}

export default App;
