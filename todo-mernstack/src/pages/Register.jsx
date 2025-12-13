import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would validate password match and hitting an API here
    login({ username: form.username, email: form.email });
    toast.success("Account created successfully!");
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded">
      <h2 className="text-xl font-bold mb-4">Create Account</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input required name="username" placeholder="Username" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <input required name="email" placeholder="Email" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        
        <div className="relative">
          <input required type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-sm text-gray-600 cursor-pointer"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="relative">
          <input required type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-2 text-sm text-gray-600 cursor-pointer"
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 cursor-pointer">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
