import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { CartDrawer } from "@/components/store/CartDrawer";
import { ToastContainer } from "@/components/ui/Toast";
import { StoreHydration } from "@/components/providers/StoreHydration";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StoreHydration />
      <AnnouncementBar />
      <Header />
      <MobileNav />
      <SearchOverlay />
      <CartDrawer />
      <ToastContainer />
      <main>{children}</main>
      <Footer />
    </>
  );
}
