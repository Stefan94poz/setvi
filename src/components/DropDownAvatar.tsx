import React, { useState, useRef, useEffect } from "react";

interface DropDownAvatarProps {
  handleActivity: () => void;
}

export function DropDownAvatar({ handleActivity }: DropDownAvatarProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative inline-block">
      <img
        id="avatarButton"
        className="w-10 h-10 rounded-full cursor-pointer"
        src="https://picsum.photos/200"
        alt="User dropdown"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
      />

      {open && (
        <div
          ref={dropdownRef}
          id="userDropdown"
          className="absolute left-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700 dark:divide-gray-600"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside dropdown
        >
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
            <div>Bonnie Green</div>
            <div className="font-medium truncate">name@flowbite.com</div>
          </div>
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="avatarButton"
          >
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  handleActivity();
                  setOpen(false);
                }}
              >
                Activity
              </a>
            </li>
          </ul>
          <div className="py-1">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              onClick={() => {
                localStorage.removeItem("userData");
                window.location.reload();
              }}
            >
              Sign out
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
