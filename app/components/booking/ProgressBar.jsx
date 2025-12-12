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
    <div className="flex items-center gap-4 mb-10 w-full">
      {/* Back Button */}
      {active > 1 && onBack && (
        <button 
          onClick={() => onBack(active - 1)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-black mr-4"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      )}

      {/* Progress Container */}
      <div className="flex items-center flex-1">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Circle */}
            <div className="flex flex-col items-center relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium z-10 relative
                ${step.id < active 
                  ? "bg-black text-white" 
                  : step.id === active 
                    ? "bg-black text-white border-2 border-black" 
                    : "bg-white text-gray-400 border-2 border-gray-300"}
              `}>
                {step.id}
              </div>
              <span className={`text-xs mt-2 absolute top-8 whitespace-nowrap ${
                step.id <= active ? "text-black font-medium" : "text-gray-500"
              }`}>
                {step.label}
              </span>
            </div>

            {/* Progress Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 relative">
                <div 
                  className={`h-0.5 absolute top-0 left-0 transition-all duration-300 ${
                    step.id < active ? "bg-black w-full" : "bg-gray-300 w-full"
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