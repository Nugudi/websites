import { ArrowRightIcon } from "@nugudi/assets-icons";
import { Flex } from "@nugudi/react-components-layout";
import { NavigationItem } from "@nugudi/react-components-navigation-item";
import Link from "next/link";

const MyPage = () => {
  return (
    <Flex direction="column" style={{ width: "100%" }}>
      <div>마이페이지</div>

      <Link href="/">
        <NavigationItem rightIcon={<ArrowRightIcon />}>
          개인정보 약관
        </NavigationItem>
      </Link>
    </Flex>
  );
};

export default MyPage;
