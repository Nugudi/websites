import { Flex } from "@nugudi/react-components-layout";
import { MenuCard } from "@nugudi/react-components-menu-card";
import Link from "next/link";
import TabBar from "@/src/shared/ui/components/tab-bar";
import * as styles from "./page.css";

import HomeView from "@/src/domains/restaurant/ui/views/home-view";

const HomePage = () => {
  return <HomeView />;
};

export default HomePage;