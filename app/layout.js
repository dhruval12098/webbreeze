import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import ConditionalNavbar from "./components/common/ConditionalNavbar";
import ConditionalFooter from "./components/common/ConditionalFooter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from './context/AuthContext';

export const metadata = {
  title: "Breeze & Grains - Kerala Homestay",
  description: "Your peaceful Kerala retreat by the backwaters of Alappuzha",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        <AuthProvider>
          <SmoothScroll>
            <ConditionalNavbar />
            {children}
            <ConditionalFooter />
            <ToastContainer position="top-right" autoClose={5000} />
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}