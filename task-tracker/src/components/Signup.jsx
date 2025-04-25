import { useState } from "react";
import API from "../services/api";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
export default function Signup({ onSwitchToLogin }) {
  const [form, setForm] = useState({ email: "", password: "", name: "", country: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
const navigate = useNavigate();
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    } else if (form.email.length > 50) {
      newErrors.email = "Email must be less than 50 characters";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (form.password.length > 20) {
      newErrors.password = "Password must be less than 20 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = "Password must contain uppercase, lowercase and number";
    }

    // Name validation
    if (!form.name) {
      newErrors.name = "Name is required";
    } else if (form.name.length > 30) {
      newErrors.name = "Name must be less than 30 characters";
    }

    // Country validation
    if (!form.country) {
      newErrors.country = "Country is required";
    } else if (form.country.length > 30) {
      newErrors.country = "Country must be less than 30 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        await API.post("/auth/register", form);
        alert("Registered successfully");
      } catch (err) {
        alert(err.response.data.error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Update the submit button
  <button
    type="submit"
    disabled={isLoading}
    className="w-full flex justify-center items-center py-2 px-4 rounded-lg shadow text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
    aria-label="Submit registration form"
  >
    {isLoading ? (
      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ) : (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        Sign Up
      </>
    )}
  </button>
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br p-4">
      {/* Changed flex-col for mobile and flex-row for larger screens */}
      <section className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-xl flex flex-col md:flex-row">
        {/* Left Brand Section - full width on mobile, 1/3 on desktop */}
        <div className="w-full md:w-1/3 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex flex-col justify-center">
          <div className="bg-white p-3 rounded-lg mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to Task Tracker</h1>
          <p className="text-blue-100">Organize your tasks efficiently</p>
        </div>

        {/* Right Form Section - full width on mobile, 2/3 on desktop */}
        <article className="w-full md:w-2/3 p-6 md:p-8">
          <nav className="flex justify-between mb-6  rounded-lg p-1">
            <button
              className="w-1/2 py-3 font-medium rounded-lg transition-all bg-blue-600 text-white hover:bg-blue-700 mr-1"
              onClick={() => navigate('/login')}
              aria-label="Switch to login form"
            >
              Login
            </button>
            <button
              className="w-1/2 py-3 font-medium rounded-lg transition-all bg-blue-800 text-white shadow-sm ml-1"
              aria-current="page"
              aria-label="Current registration form"
            >
              Register
            </button>
          </nav>

          <h2 className="text-xl font-bold text-gray-800 mb-4">Create your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Registration form">
            {/* Email Field */}
            <fieldset>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                placeholder="your@email.com"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                aria-required="true"
                aria-describedby="email-error"
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-500" role="alert">
                  {errors.email}
                </p>
              )}
            </fieldset>

            {/* Password Field */}
            <fieldset>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full text-black px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  placeholder="••••••••"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  aria-required="true"
                  aria-describedby="password-error"
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
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-500" role="alert">
                  {errors.password}
                </p>
              )}
            </fieldset>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                className="w-full px-4 text-black py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                placeholder="John Doe"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {/* Country Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                className="w-full text-black px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                placeholder="Your Country"
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2 px-4 rounded-lg shadow text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              aria-label="Submit registration form"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Sign Up
            </button>
          </form>

          <footer className="mt-4 text-center">
            <button onClick={() => navigate('/login')}
              className="text-black hover:text-blue-800 font-medium text-sm"
              aria-label="Switch to login page"
            >
              Already have an account? Log in
            </button>
          </footer>
        </article>
      </section>
    </main>
  );
}