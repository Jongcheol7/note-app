import "./globals.css";
import ReactQueryProvider from "@components/common/ReactQueryProvider";
import SessionWrapper from "@components/common/SessionProvider";
import { Toaster } from "sonner";
import Header from "@/modules/common/Header";
import MainLayout from "@/modules/common/MainLayout";
import { useColorStore } from "@/store/useColorStore";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ 모바일 화면 최적화를 위한 필수 메타 태그 */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Note App</title>
      </head>
      <body className="relative flex flex-col mx-auto sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl px-4 sm:px-6 md:px-8 py-4">
        <SessionWrapper>
          <ReactQueryProvider>
            <MainLayout>
              <Header />
              {children}
              <Toaster position="bottom-center" richColors />
            </MainLayout>
          </ReactQueryProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
