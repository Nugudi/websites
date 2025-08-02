import "@nugudi/react-components-tab/style.css";
import { Tabs } from "@nugudi/react-components-tab";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tab",
  component: Tabs,
  decorators: [
    (Story) => (
      <div
        style={{
          width: "100%",
          height: "100%",
          minHeight: 400,
          maxWidth: 600,
          margin: "0 auto",
        }}
      >
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["full"],
      control: "select",
      defaultValue: "full",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const TabStory: Story = {
  render: () => (
    <Tabs defaultValue="tab1" size="full">
      <Tabs.List>
        <Tabs.Item value="tab1">식당 정보</Tabs.Item>
        <Tabs.Item value="tab2">리뷰</Tabs.Item>
        <Tabs.Item value="tab3">메뉴</Tabs.Item>
      </Tabs.List>

      <Tabs.Panel value="tab1">
        <ul>
          <li>영업시간: 오전 10시 - 오후 2시</li>
          <li>전화번호: 02-1234-5678</li>
          <li>주소: 천안 너구리</li>
        </ul>
      </Tabs.Panel>

      <Tabs.Panel value="tab2">
        <div style={{ marginTop: "16px" }}>
          <div
            style={{
              marginBottom: "12px",
              padding: "8px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
            }}
          >
            <strong>안애옹</strong> ⭐⭐⭐⭐⭐
            <br />
            떡볶이가 최고에요 !
          </div>
        </div>
      </Tabs.Panel>

      <Tabs.Panel value="tab3">
        <ul>
          <li>김치찌개 - 8,000원</li>
          <li>떡볶이 - 7,000원</li>
          <li>불고기 - 12,000원</li>
          <li>마라탕 - 9,000원</li>
        </ul>
      </Tabs.Panel>
    </Tabs>
  ),
};

export const DisabledTabStory: Story = {
  render: () => (
    <Tabs defaultValue="info" size="full">
      <Tabs.List>
        <Tabs.Item value="info">정보</Tabs.Item>
        <Tabs.Item value="menu" disabled>
          메뉴 (준비중)
        </Tabs.Item>
      </Tabs.List>

      <Tabs.Panel value="info">
        <p>기본 정보가 여기에 표시됩니다.</p>
      </Tabs.Panel>

      <Tabs.Panel value="menu">
        <p>메뉴 정보는 준비 중입니다.</p>
      </Tabs.Panel>
    </Tabs>
  ),
};
