import { useEffect, useState } from "react";
import ChatRoom from "../ChatRoom/ChatRoom";
import User from "../UI/User";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.REACT_APP_HOST}/`);

const HomePage = () => {
  const [users, setUsers] = useState<{ username: string; id: number }[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const storedUserId = localStorage.getItem("tokens");
  const userId = storedUserId ? parseInt(storedUserId, 10) : null;

  useEffect(() => {
    if (!userId) return;

    socket.emit("joinChat", { userId });

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.REACT_APP_HOST}/users/`
        );
        const allUsers = await response.json();
        const filteredUsers = allUsers.filter(
          (user: { id: number }) => user.id !== userId
        );
        setUsers(filteredUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [userId]);

  return (
    <div className="flex bg-gray-800">
      <div className="flex flex-col gap-2 h-full p-2">
        {users.length > 0 ? (
          users.map((user) => (
            <User
              key={user.id}
              name={user.id.toString()}
              onClick={() => setSelectedUser(user.id)}
            />
          ))
        ) : (
          <p>Loading users...</p>
        )}
      </div>
      {selectedUser && userId && (
        <ChatRoom
          key={selectedUser}
          userId={userId}
          receiverId={selectedUser}
          socket={socket}
        />
      )}
    </div>
  );
};

export default HomePage;
