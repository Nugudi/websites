"use client";

import { Emphasis, Heading } from "@nugudi/react-components-layout";
import { Tabs } from "@nugudi/react-components-tab";
import { ButtonContainer } from "./components/button-container";
import InputContainer from "./components/input-container";

export default function Home() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <Tabs defaultValue="tab1">
        <Tabs.List>
          <Tabs.Item value="tab1">식당 정보</Tabs.Item>
          <Tabs.Item value="tab2">리뷰</Tabs.Item>
        </Tabs.List>

        <Tabs.Panel value="tab1">
          <h3>첫 번째 탭 내용</h3>
          <Heading as="h1" fontSize="h1" color="main">
            Nugudi UI 컴포넌트 테스트
          </Heading>
          <Emphasis fontSize="e1" color="blackAlpha">
            Emphasis
          </Emphasis>
          <ButtonContainer />
        </Tabs.Panel>

        <Tabs.Panel value="tab2">
          <h3>두 번째 탭 내용</h3>
          <InputContainer />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
