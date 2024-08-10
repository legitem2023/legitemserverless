'use client'
import { usePathname } from "next/navigation";
export const routeChecker = () => {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith('/Administrator');
    return isAdminRoute
}