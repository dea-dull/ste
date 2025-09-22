import React, { useState } from "react";
import { Tooltip } from "@heroui/tooltip";
import { User, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import {
  FolderIcon,
  DocumentTextIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  Cog8ToothIcon,
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDriveOpen, setIsDriveOpen] = useState(false);

  const MenuItem = ({ icon: Icon, text, onClick, hasSubmenu = false, isSubmenuOpen = false }) => {
    if (!isOpen) {
      return (
        <Tooltip content={text} placement="right">
          <div className="menu-item" onClick={onClick}>
            <Icon className="icon" />
          </div>
        </Tooltip>
      );
    }

    return (
      <div className="menu-item" onClick={onClick}>
        <Icon className="icon" />
        <span>{text}</span>
        {hasSubmenu && (
          isSubmenuOpen ? (
            <ChevronDownIcon className="chevron" />
          ) : (
            <ChevronRightIcon className="chevron" />
          )
        )}
      </div>
    );
  };

  const handleUserAction = (actionKey) => {
    console.log("User action:", actionKey);
    switch (actionKey) {
      case "profile":
        console.log("Navigate to profile");
        break;
      case "settings":
        console.log("Open settings");
        break;
      case "notifications":
        console.log("Open notifications");
        break;
      case "privacy":
        console.log("Open privacy settings");
        break;
      case "logout":
        console.log("Logging out...");
        break;
      default:
        break;
    }
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Toggle Button */}
      <div className="toggle-container">
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          <i
            className={`bi ${isOpen ? "bi-layout-sidebar-inset" : "bi-layout-sidebar-reverse"}`}
          ></i>
        </button>
      </div>

      {/* App Logo */}
      <div className="sidebar-logo">
        <i className="bi bi-file-zip logo-icon"></i>
        {isOpen && <span className="logo-text">Starage</span>}
      </div>

      {/* Navigation */}
      <ul className="sidebar-items">
        <li>
          <MenuItem 
            icon={DocumentTextIcon} 
            text="Notes" 
            onClick={() => console.log("Notes clicked")}
          />
        </li>

        {/* Drive collapsible */}
        <li>
          <MenuItem 
            icon={FolderIcon} 
            text="Drive" 
            onClick={() => setIsDriveOpen(!isDriveOpen)}
            hasSubmenu={true}
            isSubmenuOpen={isDriveOpen}
          />
          {isOpen && isDriveOpen && (
            <ul className="submenu">
              <li className="submenu-item">Folder 1</li>
              <li className="submenu-item">Folder 2</li>
            </ul>
          )}
        </li>

        <li>
          <MenuItem 
            icon={UserIcon} 
            text="Contacts" 
            onClick={() => console.log("Contacts clicked")}
          />
        </li>

        <li>
          <MenuItem 
            icon={ChatBubbleLeftRightIcon} 
            text="Messages" 
            onClick={() => console.log("Messages clicked")}
          />
        </li>

        <li>
          <MenuItem 
            icon={ClockIcon} 
            text="Logs" 
            onClick={() => console.log("Logs clicked")}
          />
        </li>
      </ul>

      {/* Settings */}
      <div className="sidebar-settings">
        <MenuItem 
          icon={Cog6ToothIcon} 
          text="Settings" 
          onClick={() => console.log("Settings clicked")}
        />
      </div>

      {/* User profile with dropdown - CLICKABLE USER AREA */}
      <div className="sidebar-footer">
        {isOpen ? (
          <Dropdown placement="top-end" className="user-dropdown">
            <DropdownTrigger>
              <div className="sidebar-user-clickable">
                <User
                  description="israelai260@gmail.com"
                  avatarProps={{
                    src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                    size: "sm",
                    radius: "full",
                  }}
                  classNames={{
                    base: "sidebar-user-base",
                    wrapper: "sidebar-user-wrapper",
                    name: "sidebar-user-name",
                    description: "sidebar-user-description"
                  }}
                />
                <i className="bi bi-three-dots-vertical"></i>
              </div>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="User menu" 
              variant="shadow"
              className="user-dropdown-menu"
              onAction={handleUserAction}
            >
             
              <DropdownItem 
                key="notifications" 
                startContent={<BellIcon className="dropdown-icon" />}
                className="dropdown-item"
              >
                Notifications
              </DropdownItem>
              <DropdownItem 
                key="privacy" 
                startContent={<ShieldCheckIcon className="dropdown-icon" />}
                className="dropdown-item"
              >
                Privacy & Security
              </DropdownItem>
              <DropdownItem 
                key="logout" 
                startContent={<ArrowRightOnRectangleIcon className="dropdown-icon" />}
                className="dropdown-item text-danger"
                color="danger"
              >
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Tooltip 
            content={
              <div className="user-tooltip-content">
                <div>israelai260@gmail.com</div>
              </div>
            } 
            placement="right"
          >
            <div className="collapsed-user-container">
              <img
                src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                alt="User avatar"
                className="collapsed-avatar"
              />
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
