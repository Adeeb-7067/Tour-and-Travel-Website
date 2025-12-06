import { NavLink, useLocation } from "react-router-dom";
import menu_data from "../../../data/MenuData";
import { useEffect, useState } from "react";

const NavMenu = () => {
    const [navClick, setNavClick] = useState<boolean>(false);
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [navClick]);

    // Check if a menu item is active (for dropdown parents)
    const isMenuItemActive = (menuLink: string) => {
        if (menuLink === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(menuLink);
    };

    return (
        <ul className="navigation">
            {menu_data.map((menu) => (
                <li 
                    key={menu.id}  
                    className={`${menu.has_dropdown ? "menu-item-has-children" : ""} ${isMenuItemActive(menu.link) ? "active" : ""}`}
                >
                    <NavLink 
                        to={menu.link} 
                        onClick={() => setNavClick(!navClick)}
                        className={({ isActive }) => isActive ? "active" : ""}
                    >
                        {menu.title}
                    </NavLink>

                    {menu.has_dropdown && (
                        <>
                            {menu.sub_menus && (
                                <ul className="sub-menu">
                                    {menu.sub_menus.map((sub_m, i) => (
                                        <li key={i}>
                                            <NavLink 
                                                to={sub_m.link} 
                                                onClick={() => setNavClick(!navClick)}
                                                className={({ isActive }) => isActive ? "active" : ""}
                                            >
                                                {sub_m.title}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default NavMenu;