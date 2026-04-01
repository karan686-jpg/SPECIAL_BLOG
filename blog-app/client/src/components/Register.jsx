import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const { settoken, setisAuth, setuser, axios } = useContext(AppContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/user/register", {
        name,
        email,
        password,
      });
      if (data.success) {
        localStorage.setItem("token", data.token);
        settoken(data.token);
        setisAuth(true);
        setuser(data.user);
        // eslint-disable-next-line
        axios.defaults.headers.common["Authorization"] = " " + data.token;
        toast.success("Successfully registered!");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center py-20 bg-gray-50 min-h-[80vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-600">
          Create Account
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 w-full text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
        >
          Register
        </button>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/auth"
            className="text-purple-600 font-bold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
