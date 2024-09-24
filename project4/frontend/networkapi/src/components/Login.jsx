import React, { useState } from "react";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const initialFormData = {
    username: "",
    password: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const navigate = useNavigate(); // Use navigate for redirection

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    axiosInstance
      .post("token/", {
        username: formData.username,
        password: formData.password,
      })
      .then((res) => {
        // Store tokens and username in localStorage
        localStorage.setItem("access_token", res.data.access); // Store access token
        localStorage.setItem("refresh_token", res.data.refresh); // Store refresh token
        localStorage.setItem("username", formData.username); // Store the username in localStorage

        // Set the Authorization header with the token
        axiosInstance.defaults.headers["Authorization"] =
          "JWT " + localStorage.getItem("access_token");

        console.log(res.data);
        navigate("/"); // Redirect to home after login
      })
      .catch((err) => {
        console.error("Login failed:", err);
      });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-fit"
      >
        <h2 className="text-xl font-semibold mb-4">Login</h2>

        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700">
            Username
          </label>
          <input
             autoComplete="off"
          
            type="text"
            id="username"
            name="username"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">
            Password
          </label>
          <input
             autoComplete="off"
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <button
          type="submit"
          className="  bg-white border text-black py-2 px-4 rounded font-semibold"
        >
          Login
        </button>
      </form>
      <div className=" mt-10">Haven't signed up yet? <span onClick={() => (navigate('/register'))} className=" cursor-pointer hover:underline" > Sign up here</span></div>
    </div>
  );
};

export default Login;
