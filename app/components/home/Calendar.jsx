import React, { useState, useEffect } from "react";

const Calendar = ({ selectedDate, onDateSelect, roomId }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [bookedDates, setBookedDates] = useState([]);
  
  // Fetch booked dates for the current room
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        // Fetch all bookings for this room (if roomId is provided)
        if (roomId) {
          const response = await fetch(`/api/bookings/availability?room_id=${roomId}`);
          const result = await response.json();
          
          if (result.success) {
            // Extract booked dates from the bookings
            // Only mark dates as booked from check-in to day before check-out
            // since check-out day is available after 10 AM
            const dates = [];
            result.data.forEach(booking => {
              const checkIn = new Date(booking.check_in_date);
              const checkOut = new Date(booking.check_out_date);
              
              // Add all dates between check-in and day before check-out to the booked dates
              const currentDate = new Date(checkIn);
              while (currentDate < checkOut) { // Note: < instead of <= to exclude check-out date
                const dateStr = currentDate.toISOString().split('T')[0];
                dates.push(dateStr);
                currentDate.setDate(currentDate.getDate() + 1);
              }
            });
            setBookedDates(dates);
          }
        } else {
          // If no room ID is provided, fetch all bookings for all rooms
          const response = await fetch('/api/bookings/availability');
          const result = await response.json();
          
          if (result.success) {
            // Extract booked dates from the bookings
            // Only mark dates as booked from check-in to day before check-out
            // since check-out day is available after 10 AM
            const dates = [];
            result.data.forEach(booking => {
              const checkIn = new Date(booking.check_in_date);
              const checkOut = new Date(booking.check_out_date);
              
              // Add all dates between check-in and day before check-out to the booked dates
              const currentDate = new Date(checkIn);
              while (currentDate < checkOut) { // Note: < instead of <= to exclude check-out date
                const dateStr = currentDate.toISOString().split('T')[0];
                dates.push(dateStr);
                currentDate.setDate(currentDate.getDate() + 1);
              }
            });
            setBookedDates(dates);
          }
        }
      } catch (error) {
        console.error('Error fetching booked dates:', error);
        // In case of error, use an empty array
        setBookedDates([]);
      }
    };
    
    fetchBookedDates();
  }, [roomId]);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const getCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);

    return days;
  };

  const formatDate = (day) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2,"0")}-${String(
      day
    ).padStart(2,"0")}`;
  };

  const isBooked = (day) => {
    const dateStr = formatDate(day);
    // Check if this date is in the booked dates array
    return bookedDates.includes(dateStr);
  };
  
  // Check if a date is in the past
  const isPastDate = (day) => {
    const currentDate = new Date(currentYear, currentMonth, day);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0); // Reset time part for comparison
    return currentDate < todayDate;
  };

  const handleSelect = (day) => {
    // Prevent selection of past dates and booked dates
    if (isPastDate(day) || isBooked(day)) return;
    const formattedDate = formatDate(day);
    if (onDateSelect) {
      onDateSelect(formattedDate);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else setCurrentMonth((prev) => prev + 1);
  };

  const prevMonth = () => {
    // Prevent going to previous months if we're at the current month
    const currentMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const displayedMonthDate = new Date(currentYear, currentMonth, 1);
    
    if (displayedMonthDate <= currentMonthDate) return;
    
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else setCurrentMonth((prev) => prev - 1);
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 bg-white rounded-2xl shadow-lg border border-gray-100">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="text-gray-600 hover:text-black text-lg transition"
          disabled={currentYear === today.getFullYear() && currentMonth === today.getMonth()}
        >
          ‹
        </button>

        <h2 className="text-lg font-semibold tracking-wide">
          {monthNames[currentMonth]} {currentYear}
        </h2>

        <button
          onClick={nextMonth}
          className="text-gray-600 hover:text-black text-lg transition"
        >
          ›
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-2">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-7 gap-2">
        {getCalendarDays().map((day, index) =>
          day ? (
            <button
              key={index}
              onClick={() => handleSelect(day)}
              disabled={isPastDate(day) || isBooked(day)}
              className={`
                relative flex items-center justify-center h-10 rounded-full transition-all
                ${
                  isPastDate(day) || isBooked(day)
                    ? "text-gray-400 cursor-not-allowed"
                    : "cursor-pointer"
                }
                ${
                  selectedDate === formatDate(day)
                    ? "bg-black text-white shadow-md"
                    : !isPastDate(day) && !isBooked(day)
                    ? "text-gray-800 hover:bg-gray-100"
                    : ""
                }
              `}
            >
              {/* Booked date */}
              {isBooked(day) ? (
                <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm shadow">
                  {day}
                </div>
              ) : (
                <div className="w-8 h-8 flex items-center justify-center rounded-full text-sm">
                  {day}
                </div>
              )}
            </button>
          ) : (
            <div key={index}></div>
          )
        )}
      </div>
    </div>
  );
};

export default Calendar;