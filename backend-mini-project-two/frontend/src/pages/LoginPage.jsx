import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader } from "lucide-react";
import Layout from "../components/Layout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { loginUser } from "../services/auth.service";
import { useState } from "react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginUser(formData);
      if (response.accessToken) {
        localStorage.setItem("token", response.accessToken);
        toast.success("Login successful");
        setLoading(true);
        navigate("/todo");
      }
    } catch (error) {
      toast.error(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout centered>
      <div className="w-full max-w-md">
        <div className="card-panel p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-500 mt-2">
              Sign in to continue to your Todo Space
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              onChange={handleChange}
              required
              name="email"
              value={formData.email}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
              name="password"
              value={formData.password}
            />
            <Button type="submit" className="w-full group" disabled={loading}>
              {loading ? (
                <Loader />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-gray-500 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-emerald-600 hover:underline font-medium transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
