import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "E-commerce",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <div style={{ marginTop: "1rem" }}>{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
