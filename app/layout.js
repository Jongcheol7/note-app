import "./globals.css";
import Header from "@/components/common/Header";
import UserSession from "@/lib/UserSession";
import Image from "next/image";

export default async function RootLayout({ children }) {
  const user = await UserSession();
  return (
    <html lang="en">
      <body className="max-w-2xl mx-auto py-3 px-3 bg-gray-100">
        <Header initialUser={user} />
        {children}
      </body>
    </html>
  );
}
