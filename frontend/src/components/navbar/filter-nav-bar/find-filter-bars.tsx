import type { Pages } from "@/constants/constants";
import Search_bar_filter from "./search-bar-nav";
import { usePathname } from "next/navigation";

export const FindTabsNav = ({
  mobile,
  tabs: propTabs,

}: {
  mobile: boolean;
  tabs: Pages[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
}) => {
  const location = usePathname();

  const active =
    propTabs.find((tab) => location.startsWith(tab.link)) || propTabs[0];

  

  return (
    
   
      <Search_bar_filter filter_bar={active} mobile={mobile}  />
    
  );
};
