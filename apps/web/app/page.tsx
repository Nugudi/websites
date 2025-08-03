"use client";

import {
  Box,
  Divider,
  Emphasis,
  Heading,
} from "@nugudi/react-components-layout";
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

          <Heading as="h1" fontSize="h1" color="blackAlpha">
            Nugudi UI 컴포넌트 테스트
          </Heading>
          <Divider color="zinc" orientation="horizontal" size={10} />
          <Emphasis fontSize="e1" color="blackAlpha">
            Emphasis
          </Emphasis>
          <Divider color="zinc" orientation="horizontal" size={10} />
          <Box padding={10} background="main">
            <Heading as="h1" fontSize="h1" color="blackAlpha">
              Nugudi UI 컴포넌트 테스트
            </Heading>
          </Box>
          <Divider color="main" size={5} />

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
