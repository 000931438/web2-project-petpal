import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "PetPal",
  description: "Pet Care Reminder App",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-900 text-neutral-100">
        
        {/* NAVBAR */}
        <header className="bg-neutral-900 border-b border-neutral-800 shadow-lg">
          <nav className="max-w-3xl mx-auto flex items-center justify-between p-4">
            
            {/* Logo */}
            <h1 className="text-2xl font-bold text-blue-400">PetPal</h1>

            {/* Links */}
            <div className="flex gap-6 text-neutral-300 font-medium">
              <Link href="/" className="hover:text-blue-400 transition">Home</Link>
              <Link href="/pet" className="hover:text-blue-400 transition">Pet Profile</Link>
              <Link href="/reminders" className="hover:text-blue-400 transition">Reminders</Link>
              <Link href="/weekly" className="hover:text-blue-400 transition">Weekly</Link>
            </div>

          </nav>
        </header>

        {/* MAIN CONTENT */}
        <main className="max-w-3xl mx-auto p-4">
          {children}
        </main>

      </body>
    </html>
  );
}
