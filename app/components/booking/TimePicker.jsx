import React, { useState, useEffect } from 'react';

const TimePicker = ({ selectedTime, onTimeSelect, isCheckInTime = false }) => {
  // Parse the selected time or default to 12:00 PM
  const parseTime = (timeString) => {
    if (!timeString) {
      // If this is for check-in time, default to 12 PM
      if (isCheckInTime) {
        return { hours: '12', minutes: '00', period: 'PM' };
      }
      return { hours: '12', minutes: '00', period: 'PM' };
    }
    
    // Check if the time string is in 12-hour format (HH:MM AM/PM)
    if (timeString.includes('AM') || timeString.includes('PM')) {
      // It's already in 12-hour format
      const [time, period] = timeString.split(' ');
      const [hours, minutes] = time.split(':');
      
      // If this is for check-in time and the period is AM, change it to PM
      if (isCheckInTime && period === 'AM') {
        return {
          hours: hours || '12',
          minutes: minutes || '00',
          period: 'PM'
        };
      }
      
      return {
        hours: hours || '12',
        minutes: minutes || '00',
        period: period || 'PM'
      };
    } else {
      // It's in 24-hour format, convert to 12-hour
      const [hours24, minutes] = timeString.split(':');
      let hours = parseInt(hours24, 10);
      let period = 'AM';
      
      if (hours >= 12) {
        period = 'PM';
        if (hours > 12) {
          hours -= 12;
        }
      }
      
      if (hours === 0) {
        hours = 12;
      }
      
      // If this is for check-in time and the period is AM, change it to PM
      if (isCheckInTime && period === 'AM') {
        period = 'PM';
      }
      
      return {
        hours: hours.toString(),
        minutes: minutes || '00',
        period
      };
    }
  };

  const { hours: initialHours, minutes: initialMinutes, period: initialPeriod } = parseTime(selectedTime);
  
  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(initialMinutes);
  const [period, setPeriod] = useState(initialPeriod);

  // Generate hour options based on whether this is check-in time
  const hourOptions = isCheckInTime 
    ? Array.from({ length: 12 }, (_, i) => String(i + 1)) // 1-12 for PM hours
    : Array.from({ length: 12 }, (_, i) => String(i + 1)); // 1-12 for all hours
  const minuteOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  // Update local state when selectedTime prop changes
  useEffect(() => {
    const { hours: newHours, minutes: newMinutes, period: newPeriod } = parseTime(selectedTime);
    setHours(newHours);
    setMinutes(newMinutes);
    setPeriod(newPeriod);
  }, [selectedTime]);

  const handleTimeChange = () => {
    const timeString = `${hours}:${minutes} ${period}`;
    if (onTimeSelect) {
      onTimeSelect(timeString);
    }
  };

  const handleApplyTime = () => {
    const timeString = `${hours}:${minutes} ${period}`;
    if (onTimeSelect) {
      onTimeSelect(timeString);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-72 border border-gray-200 z-50">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Select Time</h2>
      
      <div className="flex items-center justify-center space-x-3 mb-4">
        {/* Hours */}
        <div className="relative">
          <select
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-16 h-12 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-center font-medium text-gray-800 shadow-sm transition-all duration-200 appearance-none cursor-pointer hover:border-blue-300"
          >
            {hourOptions.map((h) => (
              <option key={h} value={h} className="text-center bg-white hover:bg-blue-50">{h}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <span className="text-gray-500 font-semibold text-lg">:</span>

        {/* Minutes */}
        <div className="relative">
          <select
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="w-16 h-12 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-center font-medium text-gray-800 shadow-sm transition-all duration-200 appearance-none cursor-pointer hover:border-blue-300"
          >
            {minuteOptions.map((m) => (
              <option key={m} value={m} className="text-center bg-white hover:bg-blue-50">{m}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* AM/PM */}
        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-16 h-12 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-center font-medium text-gray-800 shadow-sm transition-all duration-200 appearance-none cursor-pointer hover:border-blue-300"
            disabled={isCheckInTime} // Disable AM/PM selection for check-in time
          >
            {isCheckInTime ? (
              <option value="PM" className="bg-white hover:bg-blue-50">PM</option> // Only allow PM for check-in time
            ) : (
              <>
                <option value="AM" className="bg-white hover:bg-blue-50">AM</option>
                <option value="PM" className="bg-white hover:bg-blue-50">PM</option>
              </>
            )}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Selected Time Display */}
      <div className="text-lg font-medium text-gray-700 mb-4">
        Selected: <span className="font-bold text-blue-600">{hours}:{minutes} {period}</span>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApplyTime}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center transform hover:-translate-y-0.5"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Apply Time
      </button>
    </div>
  );
};

export default TimePicker;