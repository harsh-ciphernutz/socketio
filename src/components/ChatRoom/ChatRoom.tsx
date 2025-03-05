import { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";
import Message from "../UI/Message";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface ChatMessage {
  id?: number;
  senderId: number;
  receiverId: number;
  message: string;
}

// const socket = io("http://localhost:3000");

const ChatRoom = ({
  userId,
  receiverId,
  socket,
}: {
  userId: number;
  receiverId: number;
  socket: Socket;
}) => {
  const navigate = useNavigate();
  const [data, setData] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!userId) navigate("/login");

    console.log(receiverId);

    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.REACT_APP_HOST}/messages`, {
          method: "POST", // or 'GET' if the API expects query params instead of a body
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ senderId: userId, receiverId: receiverId }),
        });

        const getdata = await res.json();

        // const newData = getdata.map(
        //   (message: {
        //     senderId: number;
        //     receiverId: number;
        //     content: string;
        //   }) => {
        //     return {
        //       senderId: message.senderId,
        //       receiverId: message.receiverId,
        //       message: message.content,
        //     };
        //   }
        // );
        setMessages(getdata);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchData();
    console.log(messages);

    const handleMessage = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
      console.log(messages);
    };

    socket.on("newMessage", handleMessage);

    return () => {
      socket.off("newMessage", handleMessage);
    };
  }, [userId]);

  const submit = () => {
    if (data.trim()) {
      socket.emit("sendMessage", {
        senderId: userId,
        receiverId: receiverId,
        message: data,
      });
      setData("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="flex flex-col h-screen p-5 bg-gray-600 text-white w-full">
      <h1 className="w-full text-center text-3xl font-medium">Chat Room</h1>
      <h1 className="w-full text-center text-3xl font-medium">{receiverId}</h1>
      <div className="flex-grow flex overflow-y-auto flex-col px-5 custom-scrollbar">
        {messages.map((msg) => (
          <Message
            key={msg.id}
            message={msg.message}
            sending={msg.senderId === userId}
            name={msg.senderId.toString()}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        className="flex gap-5 mt-5"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <input
          className="flex-grow bg-gray-900 placeholder:text-white p-5 rounded-4xl"
          value={data}
          onChange={(e) => setData(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button
          className="bg-green-700 p-5 rounded-4xl hover:cursor-pointer"
          onClick={submit}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
