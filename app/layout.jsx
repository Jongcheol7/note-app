import "./globals.css";
import ReactQueryProvider from "@components/common/ReactQueryProvider";
import SessionWrapper from "@components/common/SessionProvider";
import { Toaster } from "sonner";
import Header from "@/modules/common/Header";
import MainLayout from "@/modules/common/MainLayout";

export const metadata = {
  title: "NoteApp",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>NoteApp</title>
        <link rel="icon" href="/logo.png" />
      </head> */}
      <body>
        <div className="relative flex flex-col mx-auto sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl px-4 sm:px-6 md:px-8 py-3">
          <SessionWrapper>
            <ReactQueryProvider>
              <MainLayout>
                <Header />
                {children}
                <Toaster position="bottom-center" richColors />
              </MainLayout>
            </ReactQueryProvider>
          </SessionWrapper>
        </div>
      </body>
    </html>
  );
}
