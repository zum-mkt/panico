import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import { MarketingScripts } from "@/components/seo/MarketingScripts";
import { DynamicFavicon } from "@/components/seo/DynamicFavicon";

export function PublicLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <OrganizationSchema />
      <MarketingScripts />
      <DynamicFavicon />
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
