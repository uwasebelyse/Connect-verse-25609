import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import url from "../utils/api-client";
import "../styles/Login.css";

type VerificationInputs = {
  code: string;
};

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit } = useForm<VerificationInputs>();
  const [isLoading, setIsLoading] = useState(false);
  const email = location.state?.email || "";
  const [backendError, setBackendError] = useState<string>("");

  const onSubmit = async (data: VerificationInputs) => {
    if (!email) {
      toast.error("Email not found. Please register again.");
      navigate("/register");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(url + "/api/v1/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          code: data.code,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setBackendError(responseData.error || "Verification failed");
        toast.error(responseData.error || "Verification failed");
        return;
      }

      toast.success("Email verified successfully!");
      //delay for 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setBackendError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Email not found. Please register again.");
      //delay for 2 seconds
      setTimeout(() => {
        navigate("/register");
      }, 2000);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(url + "/api/v1/auth/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        toast.error(responseData.error || "Failed to resend verification code");
        return;
      }

      toast.success("Verification code resent successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to resend verification code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="containers">
      <div className="container-quote">
        <div className="line">
          <h1>Verify Your Email</h1>
        </div>
        <div className="quote-content">
          <h1>One Last Step!</h1>
          <p className="quote-text">
            "We've sent a verification code to your email address. Please check your inbox and enter the code below to complete your registration."
          </p>
          <div className="quote-tips">
            <h2>Didn't receive the code?</h2>
            <ul>
              <li>Check your spam folder</li>
              <li>Make sure you entered the correct email</li>
              <li>Click the resend button below</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container-register">
        <Toaster position="top-right" richColors />
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Email Verification</h1>
          <h1 className="text-xl font-normal mt-2">Enter your verification code</h1>
        </div>

        {backendError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{backendError}</p>
          </div>
        )}

        <form className="formRegister" onSubmit={handleSubmit(onSubmit)}>
          <div className="inputs">
            <label>Verification Code</label>
            <input
              type="text"
              id="code"
              placeholder="Enter verification code"
              required
              disabled={isLoading}
              {...register("code")}
            />
          </div>

          <div className="btns">
            <button 
              className="button rounded-xl" 
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>
          </div>
        </form>

        <div className="mt-6 space-y-2">
          <button
            onClick={handleResendCode}
            disabled={isLoading}
            className="text-blue-600 hover:text-blue-800"
          >
            Resend verification code
          </button>
          <p>
            Go Back to{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:text-blue-800"
            >
              Registration
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification; 