import { Link, useSearchParams } from "react-router-dom";
import "../styles/Login.css";
import "../styles/Register.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import url from "../utils/api-client";
import { Toaster, toast } from "sonner";

type Inputs = {
  password: string;
  confirmPassword: string;
};

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { isLoading },
  } = useForm<Inputs>();
  
  const [formErrors, setFormErrors] = useState<Partial<Inputs>>({});
  const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const errors: Partial<Inputs> = {};

    if (!data.password) errors.password = "Password is required";
    if (!data.confirmPassword) errors.confirmPassword = "Please confirm your password";
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (data.password && data.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setRequestStatus('loading');

    try {
      const requestBody = JSON.stringify({
        token: token,
        newPassword: data.password,
      });
      
      const response = await fetch(url + "/api/v1/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        setRequestStatus('success');
        toast.success(responseData.message || "Password has been reset successfully!");
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

  const renderForm = () => (
    <form className="formLogin" onSubmit={handleSubmit(onSubmit)}>
      <div className="inputs">
        <label>New Password</label>
        {formErrors.password && (
          <span className="p-0 m-0 text-red-500">{formErrors.password}</span>
        )}
        <input
          type="password"
          id="password"
          required
          placeholder="Enter your new password"
          {...register("password")}
        />
      </div>

      <div className="inputs">
        <label>Confirm Password</label>
        {formErrors.confirmPassword && (
          <span className="p-0 m-0 text-red-500">{formErrors.confirmPassword}</span>
        )}
        <input
          type="password"
          id="confirmPassword"
          required
          placeholder="Confirm your new password"
          {...register("confirmPassword")}
        />
      </div>

      <div className="message"></div>

      <div className="btns">
        <button 
          className="button rounded-xl" 
          disabled={isLoading || requestStatus === 'loading'}
        >
          {requestStatus === 'loading' ? "Resetting..." : "Reset Password"}
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
      <h2 className="text-2xl font-bold mb-4">Password Reset Successful!</h2>
      <p className="text-gray-600 mb-6">
        Your password has been reset successfully. You can now log in with your new password.
      </p>
      <div className="space-y-4">
        <Link 
          to="/login" 
          className="button rounded-xl w-full block text-center"
        >
          Go to Login
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
      <h2 className="text-2xl font-bold mb-4">Reset Failed</h2>
      <p className="text-gray-600 mb-6">
        The password reset link may have expired or is invalid. Please request a new password reset link.
      </p>
      <div className="space-y-4">
        <Link 
          to="/forgot-password" 
          className="button rounded-xl w-full block text-center"
        >
          Request New Reset Link
        </Link>
        <Link to="/login" className="block text-center text-blue-600 hover:text-blue-800">
          Back to Login
        </Link>
      </div>
    </div>
  );

  if (!token) {
    return (
      <div className="containers">
        <div className="container-quote">
          <div className="line">
            <h1>Invalid Reset Link</h1>
          </div>
          <div className="quote-content">
            <h1>Something's Not Right</h1>
            <p className="quote-text">
              The password reset link appears to be invalid or has expired. 
              Please request a new password reset link to continue.
            </p>
            <div className="quote-tips">
              <h2>What to do next:</h2>
              <ul>
                <li>Request a new password reset link</li>
                <li>Check your email for the new link</li>
                <li>Make sure to use the link within 24 hours</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="container-register">
          <Toaster position="top-right" richColors />
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Invalid Reset Link</h1>
            <h1 className="text-xl font-normal mt-2">Please request a new password reset link</h1>
          </div>

          <div className="space-y-4">
            <Link 
              to="/forgot-password" 
              className="button rounded-xl w-full block text-center"
            >
              Request New Reset Link
            </Link>
            <Link to="/login" className="block text-center text-blue-600 hover:text-blue-800">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="containers">
      {/* Left side - Quote section */}
      <div className="container-quote">
        <div className="line">
          <h1>Reset Your Password</h1>
        </div>
        <div className="quote-content">
          <h1>Create a Strong Password</h1>
          <p className="quote-text">
            "Security isn't about being perfect, it's about making it harder for others to break in. 
            Choose a strong password that's unique to this account."
          </p>
          <div className="quote-tips">
            <h2>Password Tips:</h2>
            <ul>
              <li>Use at least 8 characters</li>
              <li>Include numbers and special characters</li>
              <li>Don't reuse passwords from other sites</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right side - Reset Password form */}
      <div className="container-register">
        <Toaster position="top-right" richColors />
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <h1 className="text-xl font-normal mt-2">Enter your new password below</h1>
        </div>

        {requestStatus === 'success' ? renderSuccess() :
         requestStatus === 'error' ? renderError() :
         renderForm()}
      </div>
    </div>
  );
};

export default ResetPassword; 