import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import "../styles/Register.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setCredentials } from "../state/auth/authSlice";
import { useLoginMutation } from "../state/auth/authApi";
import { Toaster, toast } from "sonner";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<Inputs>();
  const [formErrors, setFormErrors] = useState<Partial<Inputs>>({});

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const errors: Partial<Inputs> = {};

    if (!data.email) errors.email = "Email is required";
    if (!data.password) errors.password = "Password is required";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      const decodedToken = jwtDecode(response.token);
      
      // Store token in localStorage
      localStorage.setItem('token', response.token);
      
      // Dispatch the credentials to Redux store
      dispatch(setCredentials({
        user: response.user,
        token: response.token
      }));

      if (decodedToken.sub === "tuyishimehope@gmail.com") {
        toast.success("Welcome again!");
        navigate("/Admin");
      } else {
        toast.success("Successfully logged in!");
        navigate("/Home");
      }
      reset();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Invalid email or password!");
    }
  };

  if (isLoading) {
    toast.loading("Sending Data to the Server...");
  }

  return (
    <div className="containers">
      {/* Left side - Quote section */}
      <div className="container-quote">
        <div className="line">
          <h1>Welcome Back!</h1>
        </div>
        <div className="quote-content">
          <h1>Connect, Collaborate, Create</h1>
          <p className="quote-text">
            "The best way to predict the future is to create it. Join our community of innovators 
            and make your mark on the digital world."
          </p>
          <div className="quote-tips">
            <h2>Why ConnectVerse?</h2>
            <ul>
              <li>Connect with like-minded professionals</li>
              <li>Share your ideas and get feedback</li>
              <li>Build your professional network</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="container-register">
        <Toaster position="top-right" richColors />
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Welcome Back!</h1>
          <h1 className="text-xl font-normal mt-2">Sign in to continue your journey</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">Invalid email or password!</p>
          </div>
        )}

        <form className="formLogin" onSubmit={handleSubmit(onSubmit)}>
          {/* Email input */}
          <div className="inputs">
            <label>Email</label>
            {formErrors.email && (
              <span className="p-0 m-0 text-red-500">{formErrors.email}</span>
            )}
            <input
              type="text"
              id="email"
              required
              placeholder="Enter your Email"
              {...register("email")}
            />
          </div>

          {/* Password input */}
          <div className="inputs">
            <label>Password</label>
            {formErrors.password && (
              <span className="p-0 m-0 text-red-500">{formErrors.password}</span>
            )}
            <input
              type="password"
              id="password"
              required
              placeholder="Enter your password"
              {...register("password")}
            />
          </div>

          <div className="message"></div>

          {/* Forgot Password Link */}
          <div className="forgot-password">
            <Link to="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </div>

          {/* Submit button */}
          <div className="btns">
            <button 
              className="button rounded-xl" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        {/* Navigation links */}
        <div className="mt-6 space-y-2">
          <p>
            Don't have an account?{" "}
            <Link className="reg" to="/Register">
              <span>Sign Up</span>
            </Link>
          </p>
          <p>
            Go Back to the Homepage{" "}
            <Link className="reg" to="/">
              <span>Home</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
