"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";

const ProgressBar = ({ active = 1, onBack }) => {
  const steps = [
    { id: 1, label: "STEP 1" },
    { id: 2, label: "STEP 2" },
    { id: 3, label: "STEP 3" },
    { id: 4, label: "Confirmation" }
  ];

  return (
    <div className="flex items-center gap-2 md:gap-4 mb-6 md:mb-10 w-full">
      {/* Back Button */}
      {active > 1 && onBack && (
        <button 
          onClick={() => onBack(active - 1)}
          className="flex items-center gap-1 text-sm text-[#594B00] hover:text-[#173A00] mr-2 md:mr-4"
        >
          <ArrowLeft size={16} />
          <span className="hidden md:inline">Back</span>
        </button>
      )}

      {/* Progress Container */}
      <div className="flex items-center flex-1">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Circle */}
            <div className="flex flex-col items-center relative">
              <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-medium z-10 relative
                ${step.id < active 
                  ? "bg-[#594B00] text-white" 
                  : step.id === active 
                    ? "bg-[#594B00] text-white border-2 border-[#594B00]" 
                    : "bg-white text-[#594B00] border-2 border-[#594B00]/30"}
              `}>
                {step.id}
              </div>
              <span className={`text-[10px] md:text-xs mt-1 md:mt-2 absolute top-7 md:top-8 whitespace-nowrap ${
                step.id <= active ? "text-[#594B00] font-medium" : "text-[#594B00]/50"
              }`}>
                {step.label}
              </span>
            </div>

            {/* Progress Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 relative">
                <div 
                  className={`h-0.5 absolute top-0 left-0 transition-all duration-300 ${
                    step.id < active ? "bg-[#594B00] w-full" : "bg-[#594B00]/30 w-full"
                  }`} 
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;