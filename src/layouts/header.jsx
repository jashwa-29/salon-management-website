import { useTheme } from "@/hooks/use-theme";
import { ChevronsLeft, Moon, Search, Sun, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import profileImg from "@/assets/profile-image.jpg";
import PropTypes from "prop-types";

export const Header = ({ collapsed, setCollapsed }) => {
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.clear();
        navigate("/");
    };

    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-black px-4 border-b border-yellow-600/20">
            {/* Left side - Collapse button */}
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10 text-yellow-500 hover:bg-yellow-500/10 rounded-full transition-colors"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft 
                        className={`h-5 w-5 transition-transform ${collapsed ? "rotate-180" : ""}`}
                    />
                </button>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-x-4">
                {/* Search */}
               

             

                {/* Profile & Logout */}
                <div className="flex items-center gap-x-2">
                 
                    <button
                        onClick={handleLogout}
                        className="p-2 text-gray-300 hover:text-yellow-500 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};