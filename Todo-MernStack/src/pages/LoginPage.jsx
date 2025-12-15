import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Layout from "../components/Layout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/");
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
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-500 cursor-pointer hover:text-gray-700">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                Remember me
              </label>
              <a
                href="#"
                className="text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full group">
              Sign In
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
