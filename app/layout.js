import "./globals.css";
import Header from "@/components/common/Header";
import UserSession from "@/lib/UserSession";

export default async function RootLayout({ children }) {
  const user = await UserSession();
  return (
    <html lang="en">
      <body className="relative flex flex-col min-h-screen max-w-2xl mx-auto py-3 px-3 bg-amber-100">
        <Header initialUser={user} />
        {children}
      </body>
    </html>
  );
}
