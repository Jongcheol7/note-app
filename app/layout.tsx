import "./globals.css";
import ReactQueryProvider from "@components/common/ReactQueryProvider";
import SessionWrapper from "@components/common/SessionProvider";
import ErrorBoundary from "@components/common/ErrorBoundary";
import { Toaster } from "sonner";
import Header from "@/modules/common/Header";
import BottomNav from "@/modules/common/BottomNav";
import MainLayout from "@/modules/common/MainLayout";

export const metadata = {
  title: "NoteApp",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="relative flex flex-col mx-auto max-w-lg min-h-screen">
          <SessionWrapper>
            <ReactQueryProvider>
              <ErrorBoundary>
                <MainLayout>
                  <div className="px-4">
                    <Header />
                    <main className="flex-1 pb-20">{children}</main>
                  </div>
                  <BottomNav />
                  <Toaster
                    position="bottom-center"
                    richColors
                    toastOptions={{
                      className: "rounded-xl text-sm !bottom-20",
                    }}
                  />
                </MainLayout>
              </ErrorBoundary>
            </ReactQueryProvider>
          </SessionWrapper>
        </div>
      </body>
    </html>
  );
}
