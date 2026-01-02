"use client";

import React from "react";
import { X } from "lucide-react";

const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "info", // info, warning, danger
  isLoading = false
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return "bg-red-500 hover:bg-red-600";
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-[#0A3D2E] hover:bg-[#082f24]";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md z-10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
        >
          <X size={20} className="text-gray-500" />
        </button>
        
        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <div className="text-gray-600 mb-6">
            {message}
          </div>
          
          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`${getTypeStyles()} text-white px-4 py-2 rounded-xl transition ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;