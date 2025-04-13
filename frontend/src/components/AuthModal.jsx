import React, { useState } from "react";

const AuthModal = ({ isOpen, onClose, isSignup }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login"; 
    const bodyData = isSignup
      ? formData
      : { usernameOrEmail: formData.username, password: formData.password };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    const data = await response.json();
    if (data.success) {
      alert(isSignup ? "Signup Successful!" : "Login Successful!");
      onClose(); // Close modal
    } else {
      alert(data.message);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-opacity bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4">
            {isSignup ? "Sign Up" : "Login"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            {isSignup && (
              <input
                type="password"
                name="confirmpassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              {isSignup ? "Sign Up" : "Login"}
            </button>
          </form>
          <button
            onClick={onClose}
            className="w-full mt-2 text-center text-gray-600 hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default AuthModal;
