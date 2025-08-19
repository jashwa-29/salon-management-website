import { Outlet } from "react-router-dom";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "@/hooks/use-click-outside";
import { Sidebar } from "@/layouts/sidebar";
import { Header } from "@/layouts/header";
import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";

const Layout = () => {
    const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    const [collapsed, setCollapsed] = useState(!isDesktopDevice);

    const sidebarRef = useRef(null);

    useEffect(() => {
        setCollapsed(!isDesktopDevice);
    }, [isDesktopDevice]);

    useClickOutside([sidebarRef], () => {
        if (!isDesktopDevice && !collapsed) {
            setCollapsed(true);
        }
    });

    return (
        <div className="min-h-screen bg-black transition-colors">
            {/* Overlay for mobile sidebar */}
            <div
                className={cn(
                    "pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity",
                    !collapsed && "max-md:pointer-events-auto max-md:z-50 max-md:opacity-70",
                )}
            />
            
            {/* Gold accent bar at the top */}
            <div className="h-1 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 w-full fixed top-0 z-40" />
            
            <Sidebar
                ref={sidebarRef}
                collapsed={collapsed}
                className="bg-gray-900 border-r border-yellow-600/20"
            />
            
            <div className={cn(
                "transition-[margin] duration-300", 
                collapsed ? "md:ml-[70px]" : "md:ml-[240px]"
            )}>
                <Header
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    className="bg-gray-900 border-b border-yellow-600/20"
                />
                
                {/* Main content area with gold accent */}
                <div className="relative h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6 bg-black">
                    {/* Gold left border accent */}
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-yellow-600 to-yellow-800" />
                    
                    {/* Content container with subtle gold glow */}
                    <div className="rounded-lg border border-yellow-600/10 bg-gray-900/50 p-6 shadow-lg shadow-yellow-500/10">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;