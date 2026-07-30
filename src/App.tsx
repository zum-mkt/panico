import { AppRoutes } from "@/routes";
import { ScrollToTop } from "@/routes/ScrollToTop";
import { AuthRecoveryRedirect } from "@/routes/AuthRecoveryRedirect";

export default function App() {
  return (
    <>
      <AuthRecoveryRedirect />
      <ScrollToTop />
      <AppRoutes />
    </>
  );
}
