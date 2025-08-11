"use client";

import {
  Box,
  Divider,
  Emphasis,
  Flex,
  Heading,
} from "@nugudi/react-components-layout";
import { Tabs } from "@nugudi/react-components-tab";
import { ButtonContainer } from "./components/button-container";
import ChipContainer from "./components/chip-container";
import InputOTPContainer from "./components/input-otp-container";
import { SwitchContainer } from "./components/switch-container";
import TextareaContainer from "./components/textarea-container";
import * as styles from "./page.css";

export default function Home() {
  return (
    <Tabs defaultValue="tab1">
      <Tabs.List>
        <Tabs.Item value="tab1">식당 정보</Tabs.Item>
        <Tabs.Item value="tab2">리뷰</Tabs.Item>
      </Tabs.List>

      <Tabs.Panel value="tab1" className={styles.container}>
        <Flex direction="column" gap={16} align="stretch">
          <Box borderRadius="2xl">
            <Heading as="h1" fontSize="h1" color="blackAlpha">
              Nugudi UI 컴포넌트 테스트
            </Heading>
          </Box>

          <Divider color="zinc" orientation="horizontal" size={2} />

          <Box>
            <Emphasis fontSize="e1" color="blackAlpha">
              Emphasis 컴포넌트 예시
            </Emphasis>
          </Box>

          <Divider color="zinc" orientation="horizontal" size={2} />

          <Box borderRadius="2xl">
            <Heading as="h2" fontSize="h1" color="whiteAlpha">
              강조 박스 컴포넌트
            </Heading>
          </Box>

          <Divider color="main" size={3} />

          <Box borderRadius="2xl">
            <ButtonContainer />
            <SwitchContainer />
          </Box>

          <Divider color="zinc" orientation="horizontal" size={2} />

          <Flex
            direction="row"
            gap={12}
            justify="space-between"
            align="center"
            wrap="wrap"
          >
            <Box borderRadius="2xl">
              <Heading as="h3" fontSize="h1" color="zinc">
                플렉스 박스 1
              </Heading>
            </Box>
            <Box borderRadius="2xl">
              <Heading as="h3" fontSize="h1" color="blackAlpha">
                플렉스 박스 2
              </Heading>
            </Box>
          </Flex>
        </Flex>
      </Tabs.Panel>

      <Tabs.Panel value="tab2" className={styles.container}>
        <ChipContainer />
        <TextareaContainer />
        <InputOTPContainer />
      </Tabs.Panel>
    </Tabs>
  );
}
