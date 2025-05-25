import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import "../styles/Register.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import url from "../utils/api-client";
import { Toaster, toast } from "sonner";

type Inputs = {
  email: string;
  fullname: string;
  password: string;
  username: string;
};

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const [formErrors, setFormErrors] = useState<Partial<Inputs>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [backendError, setBackendError] = useState<string>("");

  const splitFullName = (fullname: string) => {
    const nameParts = fullname.trim().split(/\s+/);
    return {
      firstname: nameParts[0],
      lastname: nameParts.slice(1).join(' ')
    };
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const errors: Partial<Inputs> = {};
    setBackendError(""); // Clear any previous backend errors

    if (!data.email) errors.email = "Email is required";
    if (!data.fullname) errors.fullname = "Full name is required";
    if (!data.password) errors.password = "Password is required";
    if (!data.username) errors.username = "Username is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const { firstname, lastname } = splitFullName(data.fullname);
      
      const requestBody = JSON.stringify({
        email: data.email,
        firstname,
        lastname,
        password: data.password,
        username: data.username,
      });
      
      setIsLoading(true);
      const response = await fetch(
        url + "/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
        }
      );
      
      const responseData = await response.json();
      
      if (!response.ok) {
        setBackendError(responseData.error || "Registration failed");
        toast.error(responseData.error || "Registration failed");
        return;
      }

      toast.success("Account created successfully! Please verify your email.");
      navigate("/verify-email", { state: { email: data.email } });
      reset();
    } catch (error) {
      console.error("Error:", error);
      setBackendError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
        <div className="w-full h-screen overflow-y-auto no-scrollbar">
            <div className="containers">
                <div className="container-quote">
                    <div className="line">
                    <h1>Welcome to ConnectVerse!</h1>
                    </div>
                    <div className="quote-content">
                    <h1>Join Our Community</h1>
                    <p className="quote-text">
                        "The best way to predict the future is to create it. Join our community of innovators 
                        and make your mark on the digital world."
                    </p>
                    <div className="quote-tips">
                        <h2>Why Join Us?</h2>
                        <ul>
                        <li>Connect with like-minded professionals</li>
                        <li>Share your ideas and get feedback</li>
                        <li>Build your professional network</li>
                        </ul>
                    </div>
                    </div>
                </div>

                <div className="container-register">
                    <Toaster position="top-right" richColors />
                    
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold">Create Your Account</h1>
                        <h1 className="text-xl font-normal mt-2">Join our growing community</h1>
                    </div>

                    {backendError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{backendError}</p>
                        </div>
                    )}

                    <form className="formRegister" onSubmit={handleSubmit(onSubmit)}>
                        <div className="inputs">
                            <label>Full Name</label>
                            {formErrors.fullname && (
                            <span className="p-0 m-0 text-red-500">
                                {formErrors.fullname}
                            </span>
                            )}
                            <input
                            type="text"
                            id="fullname"
                            placeholder="Enter your full name"
                            required
                            disabled={isLoading}
                            {...register("fullname")}
                            />
                        </div>

                        <div className="inputs">
                            <label>Email</label>
                            {formErrors.email && (
                            <span className="p-0 m-0 text-red-500">{formErrors.email}</span>
                            )}
                            <input
                            type="email"
                            id="email"
                            placeholder="Enter your Email"
                            required
                            disabled={isLoading}
                            {...register("email")}
                            />
                        </div>

                        <div className="inputs">
                            <label>Username</label>
                            {formErrors.username && (
                            <span className="p-0 m-0 text-red-500">
                                {formErrors.username}
                            </span>
                            )}
                            <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            required
                            disabled={isLoading}
                            {...register("username")}
                            />
                        </div>

                        <div className="inputs">
                            <label>Password</label>
                            {formErrors.password && (
                            <span className="p-0 m-0 text-red-500">
                                {formErrors.password}
                            </span>
                            )}
                            <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            required
                            disabled={isLoading}
                            {...register("password")}
                            />
                        </div>

                        <div className="btns">
                            <button 
                            className="button rounded-xl" 
                            disabled={isLoading}
                            >
                            {isLoading ? "Creating Account..." : "Sign Up"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 space-y-2">
                        <p>
                            Already have an account?{" "}
                            <Link className="reg" to="/Login">
                            <span>Sign in</span>
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
    </div>
  );
};

export default Register;
