// src/components/Register.js
import React, { useState } from "react";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const initialFormData = {
    email: "",
    username: "",
    password: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const navigate = useNavigate(); // Fix: Use navigate for redirection

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
      .post("register/", {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      })
      .then((res) => {
        console.log(res.data);
        navigate("/login"); // Fix: Proper redirection after registration
      });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-fit"
      >
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">
            Email
          </label>
          <input
          autoComplete="off"
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
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
          className="bg-black text-white py-2 px-4 rounded"
        >
          Register
        </button>
      </form>
      <div className=" mt-10">Already have an account? <span onClick={() => (navigate('/login'))} className=" cursor-pointer hover:underline" > Login here</span></div>
    </div>
  );
};

export default Register;
