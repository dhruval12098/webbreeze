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
    
    // Check if the time string is in 24-hour format (HH:MM) or 12-hour format (HH:MM AM/PM)
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

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg w-64">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Select Time</h2>
      <div className="flex items-center justify-center space-x-2">
        {/* Hours */}
        <select
          value={hours}
          onChange={(e) => {
            setHours(e.target.value);
            // Update parent component
            const timeString = `${e.target.value}:${minutes} ${period}`;
            if (onTimeSelect) {
              onTimeSelect(timeString);
            }
          }}
          className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-800 font-medium"
        >
          {hourOptions.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>

        <span className="text-gray-500 font-semibold">:</span>

        {/* Minutes */}
        <select
          value={minutes}
          onChange={(e) => {
            setMinutes(e.target.value);
            // Update parent component
            const timeString = `${hours}:${e.target.value} ${period}`;
            if (onTimeSelect) {
              onTimeSelect(timeString);
            }
          }}
          className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-800 font-medium"
        >
          {minuteOptions.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        {/* AM/PM */}
        <select
          value={period}
          onChange={(e) => {
            setPeriod(e.target.value);
            // Update parent component
            const timeString = `${hours}:${minutes} ${e.target.value}`;
            if (onTimeSelect) {
              onTimeSelect(timeString);
            }
          }}
          className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-800 font-medium"
          disabled={isCheckInTime} // Disable AM/PM selection for check-in time
        >
          {isCheckInTime ? (
            <option value="PM">PM</option> // Only allow PM for check-in time
          ) : (
            <>
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </>
          )}
        </select>
      </div>

      <div className="mt-4 text-gray-700 font-medium">
        Selected Time: {hours}:{minutes} {period}
      </div>
    </div>
  );
};

export default TimePicker;