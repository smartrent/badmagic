import React from "react";

import Helpers from "../lib/helpers";

type Tab = {
  key: string;
  label: string;
  enabled: boolean;
}

type Props = {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (key:string) => void;
};

export default function Label({ tabs, activeTab, setActiveTab }: Props) {
  const renderTabs = (tab: Tab, activeTab: string, setActiveTab: (key:string) => void) => {
    let anchorClasses = Helpers.classes.tabs.inactive;
    let liClasses = 'mr -1';

    if(tab.key === activeTab){
      anchorClasses = Helpers.classes.tabs.active;
      liClasses = '-mb-px mr-1';
    }

    if(!tab.enabled){
      anchorClasses = Helpers.classes.tabs.disabled;
    }

    return(
      <li className={liClasses} key={`navigation_tab_${tab.key}`}>
        <a 
          className={anchorClasses} 
          onClick={tab.enabled ? ()=>setActiveTab(tab.key):null}
          href="#" 
          >
            {tab.label}
          </a>        
      </li>
    );
  }

  return (
    <ul className="flex border-b">
      {tabs.map(tab => renderTabs(tab, activeTab, setActiveTab))}
    </ul>
  );
}
