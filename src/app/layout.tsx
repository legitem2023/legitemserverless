import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import Script from "next/script";
import Header from "@/components/Partial/Header";
import Aside from "@/components/Partial/Aside";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Banner from "@/components/Partial/Banner";
const inter = Inter({ subsets: ["latin"] });
import { SessionProvider } from "next-auth/react"

export const metadata: Metadata = {
  title: "Legitem",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <html lang="en">
            <Head>
              <link rel="manifest" href='/manifest.json' sizes="any" />
              <link rel="icon" href="/icon-512x512.png" />
              <title>Legitem</title>
            </Head>
            <body className={inter.className}>
            <ToastContainer position="top-center"
                            autoClose={1000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme='light'/>
            <Script
                type="module"
                src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
                strategy="lazyOnload"
              />
            <div className="flex flex-wrap">
              <div className="flex flex-1 justify-center h-[8vh] align-center bg-gradient-to-t from-lime-500 via-lime-700 to-lime-800 z-50">
                <Header/>
              </div>
              {children}
              <Aside/>
              <Banner/>
            </div>
              </body>
          </html>
    
  );
}
