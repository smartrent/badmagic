import React, { useContext } from "react";

import Context from "../Context";

import Helpers from "../lib/helpers";

type Tab = {
  key: string;
  label: string;
};

type Props = {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (key: string) => void;
};

export default ({ tabs, activeTab, setActiveTab }: Props) => {
  const { darkMode } = useContext(Context);

  const renderTabs = (
    tab: Tab,
    activeTab: string,
    setActiveTab: (key: string) => void
  ) => {
    let anchorClasses = `${Helpers.classes.tabs.inactive} ${
      darkMode ? "border-gray-700" : ""
    }`;
    let liClasses = "mr -1";

    if (tab.key === activeTab) {
      anchorClasses = `${Helpers.classes.tabs.active} ${
        darkMode ? "border-gray-700" : ""
      }`;
      liClasses = "-mb-px mr-1";
    }

    return (
      <li className={liClasses} key={`navigation_tab_${tab.key}`}>
        <a
          className={anchorClasses}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab(tab.key);
          }}
          href="#"
        >
          {tab.label}
        </a>
      </li>
    );
  };

  return (
    <ul className={`flex border-b ${darkMode ? "border-gray-700" : ""}`}>
      {tabs.map((tab) => renderTabs(tab, activeTab, setActiveTab))}
    </ul>
  );
};
