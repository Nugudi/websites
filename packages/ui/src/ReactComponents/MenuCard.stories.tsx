import "@nugudi/react-components-menu-card/style.css";
import { MenuCard as _MenuCard } from "@nugudi/react-components-menu-card";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _MenuCard> = {
  title: "Components/MenuCard",
  component: _MenuCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    title: {
      control: "text",
      description: "메뉴 카드의 제목",
      table: {
        type: { summary: "string" },
        category: "Content",
      },
    },
    subtitle: {
      control: "text",
      description: "메뉴 카드의 부제목 (장소 등)",
      table: {
        type: { summary: "string" },
        category: "Content",
      },
    },
    timeRange: {
      control: "text",
      description: "운영 시간",
      table: {
        type: { summary: "string" },
        category: "Content",
      },
    },
    isPackagingAvailable: {
      control: "boolean",
      description: "포장 가능 여부",
      table: {
        type: { summary: "boolean" },
        category: "Content",
      },
    },
    items: {
      control: false,
      description: "메뉴 아이템 배열",
      table: {
        type: { summary: "MenuItem[]" },
        category: "Content",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "애옹 푸드",
    subtitle: "애옹애옹 지하1층",
    timeRange: "오전 9시 ~ 오후2시",
    isPackagingAvailable: true,
    items: [
      { name: "백미밥", category: "RICE" },
      { name: "잡곡밥", category: "RICE" },
      { name: "현미밥", category: "RICE" },
      { name: "김치볶음밥", category: "RICE" },

      // 면류
      { name: "잔치국수", category: "NOODLE" },
      { name: "비빔냉면", category: "NOODLE" },
      { name: "우동", category: "NOODLE" },

      // 국/탕/찌개
      { name: "김치찌개", category: "SOUP" },
      { name: "된장찌개", category: "SOUP" },
      { name: "갈비탕", category: "SOUP" },

      // 주요 반찬
      { name: "제육볶음", category: "MAIN_DISH" },
      { name: "닭갈비", category: "MAIN_DISH" },
      { name: "고등어구이", category: "MAIN_DISH" },

      // 서브반찬
      { name: "계란찜", category: "SIDE_DISH" },
      { name: "두부조림", category: "SIDE_DISH" },
      { name: "시금치나물", category: "SIDE_DISH" },

      // 김치 절임류
      { name: "배추김치", category: "KIMCHI" },
      { name: "깍두기", category: "KIMCHI" },
      { name: "오이소박이", category: "KIMCHI" },

      // 빵토스트샌드위치
      { name: "크로와상", category: "BREAD_SANDWICH" },
      { name: "햄치즈샌드위치", category: "BREAD_SANDWICH" },
      { name: "베이글", category: "BREAD_SANDWICH" },

      // 샐러드/과일
      { name: "그린샐러드", category: "SALAD_FRUIT" },
      { name: "과일샐러드", category: "SALAD_FRUIT" },

      // 음료 후식류
      { name: "아메리카노", category: "DRINK" },
      { name: "요거트", category: "DRINK" },
      { name: "식혜", category: "DRINK" },

      // 기타
      { name: "견과류", category: "OTHER" },
    ],
  },
};

export const MenuCardWithNoPackaging: Story = {
  name: "너구리 푸드",
  args: {
    title: "너구링딩딩딩딩링디리딩딩딩 푸드",
    subtitle: "너굴너굴 14층",
    timeRange: "오전 11시 ~ 오후 2시",
    items: [
      // 밥류
      { name: "백미밥", category: "RICE" },
      { name: "현미밥", category: "RICE" },

      // 면류
      { name: "짜장면", category: "NOODLE" },

      // 국/탕/찌개
      { name: "파송송 계란국", category: "SOUP" },

      // 주요 반찬
      { name: "탕탕탕탕수육", category: "MAIN_DISH" },

      // 서브반찬
      { name: "두부조림", category: "SIDE_DISH" },
      { name: "시금치나물", category: "SIDE_DISH" },

      // 김치 절임류
      { name: "배추김치", category: "KIMCHI" },
    ],
  },
};
