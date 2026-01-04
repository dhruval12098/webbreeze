"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from '@/app/context/AuthContext';

import StepOne from "../components/booking/StepOne";
import StepTwo from "../components/booking/StepTwo";
import StepThree from "../components/booking/StepThree";
import Confirmation from "../components/booking/Confirmation";

const Page = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { isAuthenticated, loading } = useAuth();

  const goToStep = (step) => setCurrentStep(step);

  // Redirect to login if not authenticated and not in payment processing
  useEffect(() => {
    const isPaymentProcessing = sessionStorage.getItem('isPaymentProcessing');
    if (!loading && !isAuthenticated && !isPaymentProcessing) {
      window.location.href = '/login';
    }
  }, [isAuthenticated, loading]);

  // Don't render if not authenticated and not in payment processing
  if (!loading && !isAuthenticated && !sessionStorage.getItem('isPaymentProcessing')) {
    return null; // The redirect will happen before this renders
  }

  return (
    <main className="w-full min-h-screen flex">
      {currentStep === 1 && <StepOne goToStep={goToStep} />}
      {currentStep === 2 && <StepTwo goToStep={goToStep} />}
      {currentStep === 3 && <StepThree goToStep={goToStep} />}
      {currentStep === 4 && <Confirmation />}
    </main>
  );
};

export default Page;