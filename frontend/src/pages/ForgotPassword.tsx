import { Link } from "react-router-dom";
import "../styles/Login.css";
import "../styles/Register.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import url from "../utils/api-client";
import { Toaster, toast } from "sonner";

type Inputs = {
  email: string;
};

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isLoading },
  } = useForm<Inputs>();
  const [formErrors, setFormErrors] = useState<Partial<Inputs>>({});
  const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [userEmail, setUserEmail] = useState<string>('');

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const errors: Partial<Inputs> = {};

    if (!data.email) errors.email = "Email is required";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setRequestStatus('loading');
    setUserEmail(data.email);

    try {
      const requestBody = JSON.stringify({
        email: data.email,
      });
      
      const response = await fetch(url + "/api/v1/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        setRequestStatus('success');
        toast.success(responseData.message || "Password reset link sent to your email!");
      } else {
        setRequestStatus('error');
        toast.error(responseData.message || "Something went wrong");
      }
      
      reset();
    } catch (error) {
      setRequestStatus('error');
      console.error("Error:", error);
      toast.error((error as Error).message || "Failed to process request");
    }
  };

  const handleResendEmail = () => {
    setRequestStatus('idle');
    reset();
  };

  const renderForm = () => (
    <form className="formLogin" onSubmit={handleSubmit(onSubmit)}>
      <div className="inputs">
        <label>Email</label>
        {formErrors.email && (
          <span className="p-0 m-0 text-red-500">{formErrors.email}</span>
        )}
        <input
          type="email"
          id="email"
          required
          placeholder="Enter your Email"
          {...register("email")}
        />
      </div>

      <div className="message"></div>

      <div className="btns">
        <button 
          className="button rounded-xl" 
          disabled={isLoading || requestStatus === 'loading'}
        >
          {requestStatus === 'loading' ? "Sending..." : "Send Reset Link"}
        </button>
      </div>
    </form>
  );

  const renderSuccess = () => (
    <div className="text-center">
      <div className="mb-6">
        <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
      <p className="text-gray-600 mb-6">
        We've sent a password reset link to <span className="font-semibold">{userEmail}</span>
      </p>
      <div className="space-y-4">
        <button
          onClick={handleResendEmail}
          className="button rounded-xl w-full"
        >
          Resend Email
        </button>
        <Link to="/login" className="block text-center text-blue-600 hover:text-blue-800">
          Back to Login
        </Link>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="text-center">
      <div className="mb-6">
        <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-4">Something Went Wrong</h2>
      <p className="text-gray-600 mb-6">
        We couldn't send the reset link. Please try again.
      </p>
      <div className="space-y-4">
        <button
          onClick={handleResendEmail}
          className="button rounded-xl w-full"
        >
          Try Again
        </button>
        <Link to="/login" className="block text-center text-blue-600 hover:text-blue-800">
          Back to Login
        </Link>
      </div>
    </div>
  );

  return (
    <div className="containers">
      {/* Left side - Quote section */}
      <div className="container-quote">
        <div className="line">
          <h1>Welcome Back!</h1>
        </div>
        <div className="quote-content">
          <h1>Don't Worry, We've Got You Covered</h1>
          <p className="quote-text">
            "The only way to do great work is to love what you do. Even when you forget your password, 
            we're here to help you get back to what matters."
          </p>
          <div className="quote-author">- Steve Jobs</div>
          <div className="quote-tips">
            <h2>Quick Tips:</h2>
            <ul>
              <li>Check your spam folder for the reset link</li>
              <li>Use a strong password when you reset</li>
              <li>Keep your login details secure</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right side - Forgot Password form */}
      <div className="container-register">
        <Toaster position="top-right" richColors />
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <h1 className="text-xl font-normal mt-2">Enter your email to reset your password</h1>
        </div>

        {requestStatus === 'success' ? renderSuccess() :
         requestStatus === 'error' ? renderError() :
         renderForm()}

        {requestStatus === 'idle' && (
          <div className="mt-6 space-y-2">
            <p>
              Remember your password?{" "}
              <Link className="reg" to="/login">
                <span>Sign In</span>
              </Link>
            </p>
            <p>
              Go Back to the Homepage{" "}
              <Link className="reg" to="/">
                <span>Home</span>
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword; 