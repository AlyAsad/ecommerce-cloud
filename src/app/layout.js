import Navbar from "../components/Navbar";

export const metadata = {
  title: "E-commerce",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {/* Add a margin to create space between Navbar and page content */}
        <div style={{ marginTop: "1rem" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
