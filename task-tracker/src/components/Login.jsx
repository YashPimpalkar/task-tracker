import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function Login({ setIsAuthenticated , onSwitchToSignup }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("uid", res.data.uid);
      setIsAuthenticated(true)
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.error || "Login failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br p-4">
      <section className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-xl flex flex-col md:flex-row">
        {/* Left Brand Section */}
        <div className="w-full md:w-1/3 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex flex-col justify-center">
          <div className="bg-white p-3 rounded-lg mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to Task Tracker</h1>
          <p className="text-blue-100">Organize your tasks efficiently</p>
        </div>

        {/* Right Form Section */}
        <article className="w-full md:w-2/3 p-6 md:p-8">
          <nav className="flex justify-between mb-6 rounded-lg p-1">
            <button
              className="w-1/2 py-3 font-medium rounded-lg transition-all bg-blue-600 text-white hover:bg-blue-700 mr-1"
              aria-current="page"
              aria-label="Current login form"
            >
              Login
            </button>
            <button
              className="w-1/2 py-3 font-medium rounded-lg transition-all hover:bg-blue-100 text-blue-600 ml-1"
              onClick={() => navigate("/register")}
              aria-label="Switch to signup form"
            >
              Register
            </button>
          </nav>

          <h2 className="text-xl font-bold text-gray-800 mb-4">Welcome back</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </fieldset>

            <fieldset>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-500"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                </button>
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2 px-4 rounded-lg shadow text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <footer className="mt-4 text-center">
            <button
                onClick={() => navigate("/register")}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Don't have an account? Sign up
            </button>
          </footer>
        </article>
      </section>
    </main>
  );
}
