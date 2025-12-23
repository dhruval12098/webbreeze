"use client";
import React, { useState, useRef, useEffect } from "react";
import Calendar from "../home/Calendar";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Enquiry = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [guests, setGuests] = useState("Number of Guests");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dateRef = useRef(null);
  const guestRef = useRef(null);

  // Close calendar & dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
      if (guestRef.current && !guestRef.current.contains(event.target)) {
        setGuestsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          selected_date: selectedDate,
          number_of_guests: guests !== "Number of Guests" ? guests : null
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success('Enquiry submitted successfully!');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        setSelectedDate(null);
        setGuests("Number of Guests");
      } else {
        toast.error(result.error || 'Failed to submit enquiry');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      toast.error('An error occurred while submitting your enquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[98%] mx-auto rounded-3xl bg-white px-4 md:px-8 lg:px-16 py-12">
      <div className="w-full border rounded-3xl p-3 md:p-4 lg:p-5">
        <div className="flex flex-col md:flex-row gap-6">

          {/* LEFT IMAGE */}
          <div className="rounded-2xl flex-1 relative overflow-hidden" style={{ margin: "3px" }}>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent" />

            <div className="absolute bottom-8 left-8 text-white max-w-xs">
              <h2
                className="text-3xl md:text-4xl italic mb-3"
                style={{ fontFamily: "Playfair Display" }}
              >
                Enquire Now
              </h2>
              <p
                className="text-sm leading-relaxed opacity-90"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                Have questions or ready to plan your stay? Reach out to us and
                we'll help you create a peaceful getaway.
              </p>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="flex-1 mt-2 md:mt-0">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border-b pb-2 focus:outline-none"
                style={{ fontFamily: "Plus Jakarta Sans" }}
                required
              />

              <div className="flex gap-4">
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-1/2 border-b pb-2 focus:outline-none"
                  style={{ fontFamily: "Plus Jakarta Sans" }}
                  required
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-1/2 border-b pb-2 focus:outline-none"
                  style={{ fontFamily: "Plus Jakarta Sans" }}
                />
              </div>

              {/* DATE PICKER */}
              <div className="relative" ref={dateRef}>
                <input
                  type="text"
                  readOnly
                  placeholder="Select Date"
                  value={selectedDate || ""}
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full border-b pb-2 focus:outline-none cursor-pointer"
                  style={{ fontFamily: "Plus Jakarta Sans" }}
                />
                {showCalendar && (
                  <div className="absolute top-full left-0 mt-2 z-10">
                    <Calendar
                      selectedDate={selectedDate}
                      onDateSelect={(date) => {
                        setSelectedDate(date);
                        setShowCalendar(false);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* MODERN CUSTOM DROPDOWN */}
              <div className="relative" ref={guestRef}>
                <button
                  type="button"
                  onClick={() => setGuestsOpen(!guestsOpen)}
                  className="w-full text-left border-b pb-2 flex justify-between items-center"
                  style={{ fontFamily: "Plus Jakarta Sans" }}
                >
                  <span className={`${guests === "Number of Guests" ? "text-gray-400" : "text-black"}`}>
                    {guests}
                  </span>
                  <span className="text-sm opacity-60">▾</span>
                </button>

                {guestsOpen && (
                  <div className="absolute z-20 mt-2 w-full rounded-xl border bg-white shadow-lg overflow-hidden animate-fade-in">
                    {["1 Guest", "2 Guests", "3 Guests", "4 Guests", "5+ Guests"].map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setGuests(item);
                            setGuestsOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition"
                          style={{ fontFamily: "Plus Jakarta Sans" }}
                        >
                          {item}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                className="w-full border-b pb-2 resize-none focus:outline-none"
                style={{ fontFamily: "Plus Jakarta Sans" }}
                required
              />

              <div className="w-full flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-black text-white px-6 py-2 rounded-full hover:opacity-90 transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ fontFamily: "Plus Jakarta Sans" }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Enquiry;