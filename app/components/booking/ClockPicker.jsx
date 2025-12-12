import React, { useState } from "react";

const ClockPicker = ({ selectedTime, onTimeSelect }) => {
  const [period, setPeriod] = useState(selectedTime ? 
    (parseInt(selectedTime.split(':')[0]) >= 12 ? "PM" : "AM") : "AM");
  const [mode, setMode] = useState("hour"); // hour or minute
  
  // Parse initial time
  let initialHour = 12;
  let initialMinute = 0;
  if (selectedTime) {
    const [hours, minutes] = selectedTime.split(":").map(Number);
    initialHour = hours % 12 || 12;
    initialMinute = minutes;
  }
  
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);

  // Handle time selection
  const handleTimeConfirm = () => {
    // Format hour for 24-hour time
    let formattedHour = hour;
    if (period === "AM" && hour === 12) {
      formattedHour = 0;
    } else if (period === "PM" && hour !== 12) {
      formattedHour = hour + 12;
    }
    
    const timeString = `${formattedHour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    if (onTimeSelect) {
      onTimeSelect(timeString);
    }
  };

  // Generate positions for clock numbers
  const getPosition = (index, total) => {
    const radius = 80;
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const x = 100 + radius * Math.cos(angle);
    const y = 100 + radius * Math.sin(angle);
    return { x, y };
  };

  // Hours (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // Minutes (0, 5, 10, ..., 55)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <div className="w-64 p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold mb-3 text-center">Select Time</h3>
      
      {/* Clock-like interface */}
      <div className="flex flex-col items-center">
        {/* Time display */}
        <div className="flex items-end mb-4">
          <div className="text-2xl font-medium">
            {hour}:{minute.toString().padStart(2, "0")}
          </div>
          <div className="flex flex-col ml-2 mb-1">
            <button
              onClick={() => setPeriod("AM")}
              className={`text-xs px-2 py-1 rounded transition-all ${
                period === "AM" ? "bg-black text-white" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              AM
            </button>
            <button
              onClick={() => setPeriod("PM")}
              className={`text-xs px-2 py-1 rounded transition-all ${
                period === "PM" ? "bg-black text-white" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              PM
            </button>
          </div>
        </div>
        
        {/* Mode selector */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode("hour")}
            className={`px-4 py-1 rounded-full text-sm transition-all ${
              mode === "hour" 
                ? "bg-black text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Hour
          </button>
          <button
            onClick={() => setMode("minute")}
            className={`px-4 py-1 rounded-full text-sm transition-all ${
              mode === "minute" 
                ? "bg-black text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Minute
          </button>
        </div>
        
        {/* Visual clock */}
        <div className="relative w-48 h-48 mb-4">
          {/* Clock face */}
          <svg width="100%" height="100%" viewBox="0 0 200 200">
            {/* Outer circle */}
            <circle cx="100" cy="100" r="90" fill="white" stroke="#e5e7eb" strokeWidth="2" />
            
            {/* Center dot */}
            <circle cx="100" cy="100" r="4" fill="black" />
            
            {/* Numbers */}
            {mode === "hour" ? (
              hours.map((h, index) => {
                const pos = getPosition(index, 12);
                return (
                  <g key={h}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="16"
                      fill={h === hour ? "black" : "white"}
                      stroke={h === hour ? "black" : "#e5e7eb"}
                      strokeWidth="2"
                      className="cursor-pointer hover:stroke-gray-400 transition-all"
                      onClick={() => setHour(h)}
                    />
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={h === hour ? "white" : "black"}
                      className="text-sm font-medium pointer-events-none"
                    >
                      {h}
                    </text>
                  </g>
                );
              })
            ) : (
              minutes.map((m, index) => {
                const pos = getPosition(index, 12);
                return (
                  <g key={m}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="16"
                      fill={m === minute ? "black" : "white"}
                      stroke={m === minute ? "black" : "#e5e7eb"}
                      strokeWidth="2"
                      className="cursor-pointer hover:stroke-gray-400 transition-all"
                      onClick={() => setMinute(m)}
                    />
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={m === minute ? "white" : "black"}
                      className="text-xs font-medium pointer-events-none"
                    >
                      {m.toString().padStart(2, "0")}
                    </text>
                  </g>
                );
              })
            )}
          </svg>
        </div>
        
        {/* Confirm button */}
        <button
          onClick={handleTimeConfirm}
          className="w-full py-2 bg-black text-white rounded-full text-sm hover:opacity-90 transition-opacity"
        >
          Confirm Time
        </button>
      </div>
    </div>
  );
};

export default ClockPicker;