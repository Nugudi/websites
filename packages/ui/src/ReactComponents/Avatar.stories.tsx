import "@nugudi/react-components-avatar/style.css";

import { FillHeartIcon } from "@nugudi/assets-icons";
import {
  Avatar as _Avatar,
  AvatarGroup as _AvatarGroup,
} from "@nugudi/react-components-avatar";
import {
  Body,
  Emphasis,
  HStack,
  VStack,
} from "@nugudi/react-components-layout";
import { vars } from "@nugudi/themes";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta: Meta<typeof _Avatar> = {
  title: "Components/Avatar",
  component: _Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    alt: {
      control: "text",
      description: "이미지 대체 텍스트 (웹 접근성)",
      table: {
        type: { summary: "string" },
        category: "Basic",
      },
    },
    src: {
      control: "text",
      description: "아바타 이미지 URL",
      table: {
        type: { summary: "string" },
        category: "Basic",
      },
    },
    size: {
      options: ["sm", "md", "lg"],
      control: "select",
      defaultValue: "md",
      description: "아바타 크기",
      table: {
        type: { summary: "sm | md | lg" },
        defaultValue: { summary: "md" },
        category: "Appearance",
      },
    },
    borderRadius: {
      options: ["full", "lg", "md", "sm", "none"],
      control: "select",
      defaultValue: "full",
      description: "아바타 모서리 둥글기",
      table: {
        type: { summary: "full | lg | md | sm | none" },
        defaultValue: { summary: "full" },
        category: "Appearance",
      },
    },
    showBadge: {
      control: "boolean",
      defaultValue: false,
      description: "온라인 상태 뱃지 표시 여부",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "State",
      },
    },
    badgeColor: {
      options: Object.keys(vars.colors.$scale),
      control: "select",
      defaultValue: "main",
      description: "뱃지 색상 (테마 색상 사용)",
      table: {
        type: { summary: "ColorScale" },
        defaultValue: { summary: "main" },
        category: "State",
      },
    },
    icon: {
      control: false,
      description: "이니셜 대신 표시할 커스텀 아이콘",
      table: {
        type: { summary: "ReactElement" },
        category: "Advanced",
      },
    },
    onError: {
      control: false,
      description: "이미지 로딩 실패 시 호출되는 함수",
      table: {
        type: { summary: "() => void" },
        category: "Advanced",
      },
    },
    imgElement: {
      control: false,
      description: "커스텀 이미지 엘리먼트 (Next.js Image 통합용)",
      table: {
        type: { summary: "ReactElement" },
        category: "Advanced",
      },
    },
    imgProps: {
      control: false,
      description: "이미지 props (Next.js getImageProps 통합용)",
      table: {
        type: { summary: "ImgHTMLAttributes<HTMLImageElement>" },
        category: "Advanced",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alt: "기본 아바타",
    size: "md",
  },
};

export const WithImage: Story = {
  args: {
    src: "https://bit.ly/kent-c-dodds",
    alt: "애옹스 프로필",
    size: "md",
  },
};

export const WithIcon: Story = {
  args: {
    icon: <FillHeartIcon width={24} height={24} />,
    size: "sm",
  },
};

export const Sizes: Story = {
  render: () => {
    const sizes = ["sm", "md", "lg"] as const;
    return (
      <HStack gap={16} align="center">
        {sizes.map((size) => (
          <_Avatar size={size} key={`default-${size}`} />
        ))}
      </HStack>
    );
  },
};

export const WithBadge: Story = {
  render: () => {
    const badgeColors = Object.keys(vars.colors.$scale) as Array<
      keyof typeof vars.colors.$scale
    >;

    return (
      <HStack gap={16}>
        {badgeColors.map((color) => (
          <VStack key={color} gap={8} align="center">
            <_Avatar size="sm" showBadge badgeColor={color} />
            <Emphasis fontSize="e2" color="zinc">
              {color}
            </Emphasis>
          </VStack>
        ))}
      </HStack>
    );
  },
};

export const FallbackBehavior: Story = {
  render: () => {
    const [imageError, setImageError] = useState(false);

    return (
      <VStack gap={32}>
        <VStack gap={16} align="center">
          <_Avatar
            src="/broken-image-url.jpg"
            size="lg"
            onError={() => setImageError(true)}
          />
          <Body fontSize="b3" color="zinc">
            {imageError
              ? "이미지 로드 실패 → 기본 아이콘 표시"
              : "이미지 로딩 중..."}
          </Body>
        </VStack>
      </VStack>
    );
  },
};

export const BorderRadius: Story = {
  render: () => {
    const radiusOptions = ["full", "lg", "md", "sm", "none"] as const;
    return (
      <HStack gap={16}>
        {radiusOptions.map((radius) => (
          <VStack key={radius} gap={8} align="center">
            <_Avatar
              size="lg"
              borderRadius={radius}
              src="https://bit.ly/kent-c-dodds"
            />
            <Emphasis fontSize="e2" color="zinc">
              {radius}
            </Emphasis>
          </VStack>
        ))}
      </HStack>
    );
  },
};

export const AvatarGroupBasic: Story = {
  render: () => {
    const avatarUrls = [
      "https://bit.ly/kent-c-dodds",
      "https://bit.ly/ryan-florence",
      "https://bit.ly/prosper-otemuyiwa",
      "https://bit.ly/sage-adebayo",
      "https://bit.ly/code-beast",
    ];

    return (
      <VStack gap={16}>
        <VStack gap={24}>
          {(["sm", "md", "lg"] as const).map((size) => (
            <HStack key={size} gap={16} align="center">
              <_AvatarGroup size={size} max={4}>
                {avatarUrls.map((url, index) => (
                  <_Avatar
                    key={`${size}-${url}`}
                    src={url}
                    alt={`User ${index + 1}`}
                  />
                ))}
              </_AvatarGroup>
            </HStack>
          ))}
        </VStack>
      </VStack>
    );
  },
};
