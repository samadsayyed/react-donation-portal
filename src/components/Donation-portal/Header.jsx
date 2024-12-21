import React, { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#02343f] flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full">
      <nav className="relative max-w-[85rem] w-full md:flex md:items-center md:justify-between md:gap-3 mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Logo w/ Collapse Button */}
        <div className="flex items-center justify-between">
          <a
            className="flex-none rounded-xl text-xl inline-block font-semibold focus:outline-none focus:opacity-80"
            href="/"
            aria-label="Preline"
          >
            <img className="h-8" src="/logo_sadaqah-2.png" alt="Blog Logo" />
          </a>

          {/* Collapse Button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className="relative size-9 flex justify-center items-center text-base font-semibold rounded-lg border border-gray-200 text-white hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              aria-expanded={isMenuOpen}
              aria-controls="hs-header-classic"
              aria-label="Toggle navigation"
            >
              {isMenuOpen ? (
                <svg
                  className="size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="M6 6 18 18"></path>
                </svg>
              ) : (
                <svg
                  className="size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
              <span className="sr-only">Toggle navigation</span>
            </button>
          </div>
        </div>

        {/* Collapse */}
        <div
          id="hs-header-classic"
          className={`hs-collapse ${
            isMenuOpen ? "block" : "hidden"
          } overflow-hidden transition-all duration-300 basis-full grow md:block`}
        >
          <div className="overflow-hidden overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
            <div className="py-2 md:py-0 flex flex-col md:flex-row md:items-center md:justify-end gap-0.5 md:gap-1">
              <a
                className="p-2 flex items-center text-base text-[#F0EDCC] focus:outline-none focus:text-[#F0EDCC]"
                href="/"
                aria-current="page"
              >
                Home
              </a>
              <a
                className="p-2 flex items-center text-base text-white hover:text-[#F0EDCC] focus:outline-none focus:text-[#F0EDCC]"
                href="/articles"
              >
                Articles
              </a>
              <a
                className="p-2 flex items-center text-base text-white hover:text-[#F0EDCC] focus:outline-none focus:text-[#F0EDCC]"
                href="/about"
              >
                About
              </a>
              <a
                className="p-2 flex items-center text-base text-white hover:text-[#F0EDCC] focus:outline-none focus:text-[#F0EDCC]"
                href="/faq"
              >
                FAQ
              </a>
              <a
                className="p-2 flex items-center text-base text-white hover:text-[#F0EDCC] focus:outline-none focus:text-[#F0EDCC]"
                href="/policies"
              >
                Policies
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
