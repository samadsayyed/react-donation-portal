import React, { useEffect, useState } from "react";
import "../../../index.css";

const ContactForm = () => {
  const [preferences, setPreferences] = useState({
    selectAll: false,
    email: "N",
    phone: "N",
    post: "N",
    sms: "N",
  });

  // Load preferences from local storage on component mount
  useEffect(() => {
    const storedPreferences = JSON.parse(
      localStorage.getItem("contactPreferences")
    );
    if (storedPreferences) {
      // Check if all preferences are "Y" to set selectAll
      const allSelected = Object.entries(storedPreferences)
        .filter(([key]) => key !== "selectAll" && key !== "expiry")
        .every(([, value]) => value === "Y");

      setPreferences({
        ...storedPreferences,
        selectAll: allSelected,
      });
    }
  }, []);

  // Save preferences to local storage with expiration
  const savePreferencesToLocalStorage = (updatedPreferences) => {
    const now = new Date();
    const expiry = now.getTime() + 24 * 60 * 60 * 1000; // 1 day from now
    localStorage.setItem(
      "contactPreferences",
      JSON.stringify({
        ...updatedPreferences,
        expiry,
      })
    );
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    const updatedPreferences = {
      ...preferences,
      [id]: checked ? "Y" : "N",
    };

    // Update selectAll based on all other checkboxes
    if (id !== "selectAll") {
      const allSelected = Object.entries(updatedPreferences)
        .filter(([key]) => key !== "selectAll" && key !== "expiry")
        .every(([, value]) => value === "Y");
      updatedPreferences.selectAll = allSelected;
    }

    setPreferences(updatedPreferences);
    savePreferencesToLocalStorage(updatedPreferences);
  };

  // Handle select all checkbox
  const handleSelectAll = (event) => {
    const { checked } = event.target;
    const newValue = checked ? "Y" : "N";
    const updatedPreferences = {
      selectAll: checked,
      email: newValue,
      phone: newValue,
      post: newValue,
      sms: newValue,
    };
    setPreferences(updatedPreferences);
    savePreferencesToLocalStorage(updatedPreferences);
  };

  return (
    <>
      <hr className="border-1 border-black" />
      <div className="flex justify-center items-center">
        <div className="bg-white rounded-lg md:p-8 px-2 w-full">
          <h1 className="text-2xl font-bold mb-4 text-center text-[#02343F]">
            Almost there!
          </h1>

          <div className="text-center mb-4">
            <p className="text-gray-700">
              Your support is making a life-saving impact. Stay connected and
              informed with our latest updates.
            </p>
          </div>

          <div className="container mx-auto md:p-6">
            <div className="grid grid-cols-4 gap-6">
              {/* Email Checkbox */}
              <div className="flex items-center flex-col bg-gray-50 border pt-4">
                <input
                  type="checkbox"
                  id="email"
                  className="relative md:right-[-45px] accent-[#02343F]"
                  checked={preferences.email === "Y"}
                  onChange={handleCheckboxChange}
                />
                <label
                  htmlFor="email"
                  className="flex flex-col items-center space-y-2 cursor-pointer px-2 text-center"
                >
                  <img
                    src="/mail.svg"
                    alt=""
                    className="md:w-[75px] md:h-[75px] w-[25px] h-[25px]"
                  />
                  <span className="md:text-sm text-[10px] font-medium">
                    Send me updates by email
                  </span>
                </label>
              </div>

              {/* Phone Checkbox */}
              <div className="flex items-center flex-col bg-gray-50 border pt-4">
                <input
                  type="checkbox"
                  id="phone"
                  className="relative md:right-[-45px] accent-[#02343F]"
                  checked={preferences.phone === "Y"}
                  onChange={handleCheckboxChange}
                />
                <label
                  htmlFor="phone"
                  className="flex flex-col items-center space-y-2 cursor-pointer px-2 text-center"
                >
                  <img
                    src="/phone.svg"
                    alt=""
                    className="md:w-[75px] md:h-[75px] w-[25px] h-[25px]"
                  />
                  <span className="text-sm font-medium">
                    Contact me by Phone
                  </span>
                </label>
              </div>

              {/* Post Checkbox */}
              <div className="flex items-center flex-col bg-gray-50 border pt-4">
                <input
                  type="checkbox"
                  id="post"
                  className="relative md:right-[-45px] accent-[#02343F]"
                  checked={preferences.post === "Y"}
                  onChange={handleCheckboxChange}
                />
                <label
                  htmlFor="post"
                  className="flex flex-col items-center space-y-2 cursor-pointer px-2 text-center"
                >
                  <img
                    src="/post.svg"
                    alt=""
                    className="md:w-[75px] md:h-[75px] w-[25px] h-[25px]"
                  />
                  <span className="text-sm font-medium">
                    Contact me by Post
                  </span>
                </label>
              </div>

              {/* SMS Checkbox */}
              <div className="flex items-center flex-col bg-gray-50 border pt-4">
                <input
                  type="checkbox"
                  id="sms"
                  className="relative md:right-[-45px] accent-[#02343F]"
                  checked={preferences.sms === "Y"}
                  onChange={handleCheckboxChange}
                />
                <label
                  htmlFor="sms"
                  className="flex flex-col items-center space-y-2 cursor-pointer px-2 text-center"
                >
                  <img
                    src="/sms.svg"
                    alt=""
                    className="md:w-[75px] md:h-[75px] w-[25px] h-[25px]"
                  />
                  <span className="text-sm font-medium">Contact me by SMS</span>
                </label>
              </div>
            </div>
          </div>
          {/* Select All Checkbox */}
        <div className="mb-4 md:mt-0 mt-5 bg-white max-w-xl mx-auto p-4 text-center border border-gray-500">
        <input
          id="selectAll"
          type="checkbox"
          className="w-6 h-6 accent-[#02343F] align-middle border-2 border-black"
          onChange={handleSelectAll}
          checked={preferences.selectAll}

          />
        <label
          htmlFor="selectAll"
          className="ms-2 text-md font-medium text-[#02343F]"
        >
         Select All Mode Of Communication
        </label>
      </div>

          <div className="text-center mt-4">
            <p className="text-gray-700 text-md text-justify">
              We take your privacy very seriously and are committed to
              protecting your personal information. To make sure we give you
              outstanding supporter experience we'll sometimes use the
              information you give us to ensure our communications meet your
              expectations. For more information about how we use and protect
              your data please read our Privacy Policy.
            </p>
            <br />
            <p className="text-gray-700 text-md text-justify">
              You can also change how we hear from us at any time by contacting
              our Support Care team,
            </p>
            <div className="flex text-center justify-center">
              <a
                href="mailto:info@technoservesolutions.com"
                className="font-bold justify-center hover:text-[#848378]"
              >
                info@technoservesolutions.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
