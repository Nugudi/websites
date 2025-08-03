"use client";

import { Box, Emphasis, Heading } from "@nugudi/react-components-layout";
import { Tabs } from "@nugudi/react-components-tab";
import { ButtonContainer } from "./components/button-container";
import InputContainer from "./components/input-container";
import * as styles from "./page.css";

export default function Home() {
  return (
    <div>
      <Tabs defaultValue="tab1">
        <Tabs.List>
          <Tabs.Item value="tab1">식당 정보</Tabs.Item>
          <Tabs.Item value="tab2">리뷰</Tabs.Item>
        </Tabs.List>

        <Tabs.Panel value="tab1">
          <h3>첫 번째 탭 내용</h3>
          <Box
            background="main"
            padding={10}
            borderRadius="full"
            color="whiteAlpha"
          >
            <Heading as="h1" fontSize="h1" color="whiteAlpha">
              Nugudi UI 컴포넌트 테스트
            </Heading>
            <Emphasis fontSize="e1" color="whiteAlpha">
              Emphasis
            </Emphasis>
          </Box>

          <ButtonContainer />
        </Tabs.Panel>

        <Tabs.Panel value="tab2">
          <div className={styles.container}>
            <h3>두 번째 탭 내용</h3>
            <InputContainer />
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
