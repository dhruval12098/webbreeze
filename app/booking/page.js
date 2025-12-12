"use client";

import React, { useState } from "react";

import StepOne from "../components/booking/StepOne";
import StepTwo from "../components/booking/StepTwo";
import StepThree from "../components/booking/StepThree";
import Confirmation from "../components/booking/Confirmation";

const Page = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const goToStep = (step) => setCurrentStep(step);

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