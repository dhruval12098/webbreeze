import React, { useState } from 'react';

const TimePicker = () => {
  const [hours, setHours] = useState('12');
  const [minutes, setMinutes] = useState('00');
  const [period, setPeriod] = useState('AM');

  const hourOptions = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minuteOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg w-64">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Select Time</h2>
      <div className="flex items-center justify-center space-x-2">
        {/* Hours */}
        <select
          value={hours}
          onChange={(e) => setHours(e.target.value)}
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
          onChange={(e) => setMinutes(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-800 font-medium"
        >
          {minuteOptions.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        {/* AM/PM */}
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-800 font-medium"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>

      <div className="mt-4 text-gray-700 font-medium">
        Selected Time: {hours}:{minutes} {period}
      </div>
    </div>
  );
};

export default TimePicker;
