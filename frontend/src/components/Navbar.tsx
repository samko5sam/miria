import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navLinkStyle = {
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "700",
  };

  const activeNavLinkStyle = {
    color: "#FFFFFF",
    fontWeight: "700",
  };

  return (
    <header className="flex items-center p-4">
      {/* Left Icon & Title */}
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-white text-3xl">
          widgets
        </span>
        <Link
          to="/"
          className="text-white text-lg font-bold leading-tight tracking-[-0.015em]"
        >
          Miria
        </Link>
      </div>

      {/* Center Links */}
      <div className="flex-1 flex justify-center items-center gap-6">
        <NavLink
          to="/about"
          style={({ isActive }) =>
            isActive ? activeNavLinkStyle : navLinkStyle
          }
        >
          {t("about")}
        </NavLink>
        {user?.role === "admin" && (
          <NavLink
            to="/admin"
            style={({ isActive }) =>
              isActive ? activeNavLinkStyle : navLinkStyle
            }
          >
            {t("admin")}
          </NavLink>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center justify-end gap-4">
        {user ? (
          <button
            onClick={logout}
            className="text-white/80 text-base font-bold leading-normal tracking-[0.015em] hover:text-white transition-colors"
          >
            {t("logout")}
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-white/80 text-base font-bold leading-normal tracking-[0.015em] hover:text-white transition-colors"
            >
              {t("login")}
            </Link>
            <Link
              to="/register"
              className="bg-primary px-4 py-2 rounded-lg text-white text-sm font-bold hover:bg-opacity-90 transition-colors"
            >
              {t("register")}
            </Link>
          </div>
        )}
        {/* Language Switcher - optional styling */}
        <div className="flex gap-2">
          <button
            onClick={() => changeLanguage("en-US")}
            className={`text-sm ${i18n.language.startsWith("en") ? "text-white" : "text-white/50"}`}
          >
            EN
          </button>
          <button
            onClick={() => changeLanguage("zh-TW")}
            className={`text-sm ${i18n.language.startsWith("zh") ? "text-white" : "text-white/50"}`}
          >
            TW
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
