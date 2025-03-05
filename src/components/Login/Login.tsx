import { useState } from "react";
import InputText from "../UI/InputText";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.REACT_APP_HOST}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: userName, password }),
        }
      );

      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        localStorage.setItem("tokens", data.id); // Save token
        // console.log(data.username);
        // setAuth(true); // Update authentication state
        navigate("/"); // Redirect to chat
      } else {
        alert("Login failed: " + data.message);
      }

      // Store token in localStorage

      navigate("/"); // Redirect to chat page
    } catch (err) {
      console.error(err); // Show error message
    }
  };

  return (
    <div className="flex flex-col gap-5 h-screen justify-center items-center bg-gray-300">
      <div className="text-3xl">Login</div>
      <div className="flex flex-col gap-5 p-5 rounded-4xl justify-center bg-gray-500 items-center">
        <InputText
          value={userName}
          onChange={(e) => setUserName(e)} // Fix onChange
          placeHolder="Username"
        />
        <InputText
          value={password}
          onChange={(e) => setPassword(e)} // Fix onChange
          placeHolder="Password"
          type="password"
        />
        {/* Show error if exists */}
        <button
          onClick={handleSubmit}
          className="bg-gray-200 p-2 px-4 rounded-4xl cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Login;
