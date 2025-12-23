"use client";
import React, { useState, useEffect } from "react";
import { User2, Mail, Phone, Eye } from "lucide-react";

const EnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch('/api/enquiries');
        const result = await response.json();
        
        // Check if the response is an array before mapping
        if (Array.isArray(result)) {
          // Format the data to match the expected structure
          const formattedData = result.map(item => ({
            id: item.id,
            name: item.name,
            email: item.email,
            phone: item.phone || 'N/A',
            message: item.message,
            numberOfGuests: item.number_of_guests || 'N/A',
            date: new Date(item.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          }));
          
          setEnquiries(formattedData);
        } else {
          console.error('Error: Expected array but got:', result);
          setEnquiries([]); // Set to empty array if response is not an array
        }
      } catch (error) {
        console.error('Error fetching enquiries:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEnquiries();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl font-semibold text-[#0A3D2E]">Loading enquiries...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">

      {/* PAGE HEADER */}
      <div className="w-full px-8 py-8 border-b border-[#E5E7EB]">
        <h1 className="text-3xl font-semibold text-[#0A3D2E]">Enquiries</h1>
      </div>

      {/* TABLE SECTION */}
      <div className="w-full px-8 py-8">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="text-left text-[#6B7280] bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <th className="py-3 px-3 font-medium">Name</th>
              <th className="py-3 px-3 font-medium">Email</th>
              <th className="py-3 px-3 font-medium">Phone</th>
              <th className="py-3 px-3 font-medium">Number of Guests</th>
              <th className="py-3 px-3 font-medium">Message</th>
              <th className="py-3 px-3 font-medium">Date</th>
              <th className="py-3 px-3 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="text-[#0A3D2E]">
            {enquiries.map((item) => (
              <tr
                key={item.id}
                className="border-b border-[#E5E7EB] hover:bg-[#F8FAFB] transition"
              >
                <td className="py-4 px-3 font-medium">{item.name}</td>
                <td className="px-3">{item.email}</td>
                <td className="px-3">{item.phone}</td>
                <td className="px-3">{item.numberOfGuests}</td>
                <td className="px-3 max-w-xs truncate">{item.message}</td>
                <td className="px-3">{item.date}</td>

                {/* ACTION BUTTON */}
                <td className="px-3 text-right">
                  <button className="p-2 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] transition">
                    <Eye size={16} className="text-[#0A3D2E]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .filter-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          padding: 10px 16px;
          border-radius: 12px;
        }

        .filter-input {
          background: transparent;
          outline: none;
          font-size: 14px;
          color: #0A3D2E;
        }
      `}</style>
    </div>
  );
};

export default EnquiriesPage;