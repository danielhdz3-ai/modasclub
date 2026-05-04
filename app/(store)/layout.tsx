import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { CartDrawer } from "@/components/store/CartDrawer";
import { ToastContainer } from "@/components/ui/Toast";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <MobileNav />
      <CartDrawer />
      <ToastContainer />
      <main>{children}</main>
      <Footer />
    </>
  );
}
