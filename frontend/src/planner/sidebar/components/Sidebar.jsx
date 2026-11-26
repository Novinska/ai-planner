import React from "react";
import classNames from "classnames";
import "../styles/sidebar.scss";
import { menuItems } from "../Constants";
import Logo from "../../../images/logo.png";
import axios from "axios";

const Sidebar = ({
  user,
  activePage,
  setActivePage,
  isActive,
  setIsActive,
}) => {
  console.log("ЮЗЕР ВСЕРЕДИНІ САЙДБАРУ:", user);

  const googleAvatar = user?.photos?.[0]?.value;

  return (
    <aside
      className={classNames("sidebar", {
        "sidebar-active": isActive,
        "sidebar-hide": !isActive,
      })}
    >
      <div className="sidebar-pannel">
        <div className="sidebar-logo-wrapper">
          <img src={Logo} alt="logo" className="logo-img" />
          <h2 className="logo-text">PLANAI</h2>
          <span className="slogan">Твій AI-помічник</span>
        </div>
        <button
          className={classNames("btn sidebar-btn", {
            "sidebar-active-btn": isActive,
            "sidebar-hide-btn": !isActive,
          })}
          onClick={() => setIsActive(!isActive)}
        >
          <span
            className={classNames("icon show-hide-icons", {
              "icon-collapse": isActive,
              "icon-expand": !isActive,
            })}
          />
        </button>
      </div>
      <div
        className={classNames({
          "sidebar-active-content": isActive,
          "sidebar-hide-content": !isActive,
        })}
      >
        <div className="sidebar-menu">
          {menuItems.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => {
                setActivePage(id);
                if (window.innerWidth < 1024) {
                  setIsActive(false);
                }
              }}
              className={classNames("btn menu-item-btn", {
                "menu-item-btn-active": activePage === id,
              })}
            >
              <span className={classNames("menu-icon", icon)} />
              <span className="menu-label">{label}</span>
            </button>
          ))}
        </div>
        <div className="daily-quote">
          <p className="daily-quote-text">Цитата дня</p>
          <p className="daily-quote-text">
            Щоб вирватися вперед треба просто почати.
          </p>
          <p className="daily-quote-text author"> - Марк Твен</p>
        </div>
        <div className="sidebar-user">
          <div className="user-info">
            <span className="icon icon-user" />
            <span className="user-name">
              {user ? user.displayName?.split(" ")[0] : "Гість"}
            </span>
          </div>
          <span className="icon icon-logout" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
