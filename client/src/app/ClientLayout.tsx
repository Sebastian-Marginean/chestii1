"use client";
import { usePathname } from "next/navigation";
import CadruPrincipal from "./cadruPrincipal";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return isAuthPage ? (
    <>{children}</>
  ) : (
    <CadruPrincipal>{children}</CadruPrincipal>
  );
}
