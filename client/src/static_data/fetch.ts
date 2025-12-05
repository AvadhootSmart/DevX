export const FETCH_USERS = `import React from "react";

  export function Card() {
    const [users, setUsers] = React.useState([]);

    const fetchUsers = async () => {
      try {
        const res = await fetch("https://dummyjson.com/users");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="p-4 border rounded-lg shadow-md bg-white max-w-sm">
          <button
            onClick={fetchUsers}
            className="bg-black text-white px-3 py-2 rounded-md mb-4"
          >
            Fetch Users
          </button>

          {/* Only render list once data has been fetched */}
          {users.length > 0 && (
            <ul className="space-y-3">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center gap-3 p-2 border rounded-md"
                >
                  <img
                    src={user.image}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-medium">{user.username}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
`;