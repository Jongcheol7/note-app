import "./globals.css";
import Header from "@components/common/Header";
import ReactQueryProvider from "@components/common/ReactQueryProvider";
import SessionWrapper from "@components/common/SessionProvider";

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative flex flex-col min-h-screen max-w-2xl mx-auto py-3 px-3 bg-amber-100">
        <SessionWrapper>
          <ReactQueryProvider>
            <Header />
            {children}
          </ReactQueryProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
