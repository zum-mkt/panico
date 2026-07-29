import { AppRoutes } from "@/routes";
import { ScrollToTop } from "@/routes/ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <AppRoutes />
    </>
  );
}
