import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-hot-toast";

interface VerificationSectionProps {
  step: number;
  isVerified: boolean;
  setIsVerified: (verified: boolean) => void;
}

// Type assertion for ReCAPTCHA component
// This is a test key, replace with actual key in production
const RecaptchaComponent = ReCAPTCHA as any;

const VerificationSection = ({ step, isVerified, setIsVerified }: VerificationSectionProps) => {
  const handleVerification = (token: string | null) => {
    if (token) {
      setIsVerified(true);
      toast.success("Verification successful!");
    } else {
      setIsVerified(false);
      toast.error("Verification failed, please try again");
    }
  };

  return (
    <div className="mb-6 transition-all duration-300 hover:bg-gray-50 p-3 rounded-lg">
      <div className="flex items-center mb-2">
        <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center mr-2">
          {step}
        </div>
        <h3 className="font-medium">Complete Verification</h3>
      </div>
      <div className="ml-8">
        {isVerified ? (
          <div className="text-green-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Verification successful</span>
          </div>
        ) : (
          <div className="my-3 transform transition-transform duration-200 hover:scale-[1.01]">
            <RecaptchaComponent
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // This is a test key, replace with actual key in production
              onChange={handleVerification}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationSection; 