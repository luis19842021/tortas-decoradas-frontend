import Navbar from "@/componenets/Navbar";
import './globals.css';
import Footer from "@/componenets/Footer";
import CarritoPanel from "@/features/carrito/CarritoPanel";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;

}>) {
  return (
    <html lang="es">
      <body className="bg-confetti min-h-screen flex flex-col">

        <Navbar />
        <CarritoPanel />

        <main className="flex-1 flex flex-col">
          {children}
        </main>

        <Footer/>
      </body>
    </html>
  );
}
