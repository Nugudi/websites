import "@nugudi/react-components-switch/style.css";
import { Body, Title } from "@nugudi/react-components-layout";
import { Switch as _Switch } from "@nugudi/react-components-switch";
import { useSwitch, useToggleSwitch } from "@nugudi/react-hooks-switch";
import { useToggle } from "@nugudi/react-hooks-toggle";
import { vars } from "@nugudi/themes";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _Switch> = {
  title: "Components/Switch",
  component: _Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["sm", "md", "lg"],
      control: "select",
      defaultValue: "md",
    },
    color: {
      options: Object.keys(vars.colors.$scale),
      control: "select",
      defaultValue: "main",
    },
    isDisabled: {
      control: "boolean",
      defaultValue: false,
    },
    defaultSelected: {
      control: "boolean",
      defaultValue: false,
    },
    label: {
      control: "text",
      defaultValue: "알림 활성화",
    },
    labelPlacement: {
      options: ["start", "end"],
      control: "select",
      defaultValue: "end",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const BasicSwitch: Story = {
  args: {
    size: "md",
    color: "main",
    isDisabled: false,
    defaultSelected: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "기본 Switch 컴포넌트입니다. 크기, 색상, 활성화 상태 등을 props로 제어할 수 있습니다.",
      },
    },
  },
};

export const SwitchWithBuiltInLabel: Story = {
  render: () => {
    const { isSelected, toggle } = useToggle({ isSelected: false });

    return (
      <_Switch
        id="notification-switch"
        size="md"
        color="main"
        label="알림 활성화"
        labelPlacement="end"
        isSelected={isSelected}
        onToggle={toggle}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "내장된 라벨이 있는 Switch 컴포넌트입니다. 라벨을 클릭해도 스위치가 토글됩니다.",
      },
    },
  },
};

export const LabelPlacementStory: Story = {
  render: () => {
    const { isSelected: isSelected1, toggle: toggle1 } = useToggle({
      isSelected: false,
    });
    const { isSelected: isSelected2, toggle: toggle2 } = useToggle({
      isSelected: false,
    });

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <_Switch
          id="right-label-switch"
          label="라벨이 오른쪽에"
          labelPlacement="end"
          color="main"
          isSelected={isSelected1}
          onToggle={toggle1}
        />
        <_Switch
          id="left-label-switch"
          label="라벨이 왼쪽에"
          labelPlacement="start"
          color="main"
          isSelected={isSelected2}
          onToggle={toggle2}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "라벨 위치를 조정할 수 있는 Switch입니다. labelPlacement prop으로 라벨을 스위치의 왼쪽(start) 또는 오른쪽(end)에 배치할 수 있습니다.",
      },
    },
  },
};

export const SizesStory: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <_Switch size="sm" />
        <_Switch size="md" />
        <_Switch size="lg" />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "다양한 크기의 Switch 컴포넌트입니다. sm(작은), md(중간), lg(큰) 세 가지 크기를 제공합니다.",
      },
    },
  },
};

export const ColorsStory: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <_Switch color="main" defaultSelected />
        <_Switch color="zinc" defaultSelected />
        <_Switch color="whiteAlpha" defaultSelected />
        <_Switch color="blackAlpha" defaultSelected />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "다양한 색상 테마의 Switch 컴포넌트입니다. main, zinc, whiteAlpha, blackAlpha 등의 색상을 사용할 수 있습니다.",
      },
    },
  },
};

export const ControlledSwitch: Story = {
  render: () => {
    const { isSelected, toggle } = useToggle({ isSelected: false });

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <_Switch isSelected={isSelected} onToggle={toggle} color="main" />
        <Body fontSize="b2" color="zinc">
          스위치가 {isSelected ? "켜짐" : "꺼짐"} 상태입니다
        </Body>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "상태를 외부에서 제어하는 Controlled Switch입니다. useToggle 훅과 함께 사용하여 스위치 상태를 관리할 수 있습니다.",
      },
    },
  },
};

export const DisabledSwitch: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <_Switch isDisabled />
        <_Switch isDisabled defaultSelected />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "비활성화된 Switch 컴포넌트입니다. isDisabled prop을 true로 설정하면 사용자가 스위치를 조작할 수 없습니다.",
      },
    },
  },
};

export const TextSwitchStory: Story = {
  render: () => {
    const { isSelected, toggle } = useToggle({ isSelected: true });
    const { switchProps } = useSwitch({
      elementType: "div",
      isSelected: isSelected,
      onToggle: toggle,
    });

    return (
      <Title
        {...switchProps}
        as="div"
        fontSize="t2"
        color="main"
        style={{
          userSelect: "none",
          cursor: "pointer",
          padding: "10px",
          borderRadius: "8px",
          backgroundColor: switchProps["aria-checked"] ? "#4CAF50" : "#e0e0e0",
          color: switchProps["aria-checked"] ? "white" : "#666",
          transition: "all 0.3s",
        }}
      >
        {switchProps["aria-checked"] ? "스위치 켜짐" : "스위치 꺼짐"}
      </Title>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "useSwitch 훅을 사용하여 커스텀 스위치를 만드는 예제입니다. div 엘리먼트를 스위치처럼 동작하게 할 수 있습니다.",
      },
    },
  },
};

export const ToggleSwitchStory: Story = {
  render: () => {
    const { switchProps, isSelected } = useToggleSwitch(
      { elementType: "button" },
      false,
    );
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <button
          {...switchProps}
          type="button"
          style={{
            width: "60px",
            height: "30px",
            borderRadius: "15px",
            border: "none",
            backgroundColor: isSelected ? "#4CAF50" : "#ccc",
            position: "relative",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "3px",
              left: isSelected ? "33px" : "3px",
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: "white",
              transition: "left 0.3s",
            }}
          />
        </button>
        <Body fontSize="b2" color="zinc">
          {isSelected ? "활성화됨" : "비활성화됨"}
        </Body>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "useToggleSwitch 훅을 사용하여 토글 가능한 스위치를 만드는 예제입니다. 내부적으로 상태를 관리합니다.",
      },
    },
  },
};

export const WithExternalLabel: Story = {
  render: () => {
    const { isSelected: builtInSelected, toggle: builtInToggle } = useToggle({
      isSelected: false,
    });
    const { isSelected: externalSelected, toggle: externalToggle } = useToggle({
      isSelected: false,
    });
    const { isSelected: htmlLabelSelected, toggle: htmlLabelToggle } =
      useToggle({ isSelected: false });

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* 내장 라벨: Switch 컴포넌트의 label prop 사용 */}
        <div>
          <Title fontSize="t2" color="main" style={{ marginBottom: "0.5rem" }}>
            1. 내장 라벨 (권장)
          </Title>
          <_Switch
            id="built-in-label-demo"
            label="알림 받기"
            isSelected={builtInSelected}
            onToggle={builtInToggle}
            color="main"
          />
          <Body fontSize="b3" color="zinc" style={{ marginTop: "0.5rem" }}>
            → Switch 컴포넌트의 label prop 사용
            <br />→ 라벨 클릭 시 자동으로 토글됨 (접근성 보장)
          </Body>
        </div>

        {/* 외부 라벨: HTML label 요소 사용 */}
        <div>
          <Title fontSize="t2" color="main" style={{ marginBottom: "0.5rem" }}>
            2. HTML label 요소 (표준)
          </Title>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <_Switch
              id="html-label-demo"
              isSelected={htmlLabelSelected}
              onToggle={htmlLabelToggle}
              color="zinc"
            />
            <label htmlFor="html-label-demo" style={{ cursor: "pointer" }}>
              <Body fontSize="b2" color="zinc">
                다크 모드 활성화
              </Body>
            </label>
          </div>
          <Body fontSize="b3" color="zinc" style={{ marginTop: "0.5rem" }}>
            → HTML label 요소와 htmlFor 속성 사용
            <br />→ 라벨 클릭 시 자동으로 토글됨 (웹 표준)
          </Body>
        </div>

        {/* 단순 텍스트: 클릭 이벤트 직접 처리 */}
        <div>
          <Title fontSize="t2" color="main" style={{ marginBottom: "0.5rem" }}>
            3. 단순 텍스트 (비추천)
          </Title>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <_Switch
              id="simple-text-demo"
              isSelected={externalSelected}
              onToggle={externalToggle}
              color="blackAlpha"
            />
            <Body
              fontSize="b2"
              color="zinc"
              style={{ cursor: "pointer" }}
              onClick={externalToggle}
            >
              푸시 알림 허용
            </Body>
          </div>
          <Body fontSize="b3" color="zinc" style={{ marginTop: "0.5rem" }}>
            → 단순 텍스트에 onClick 이벤트 추가
            <br />→ 접근성 도구가 연결을 인식하지 못함 (비추천)
          </Body>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "라벨 처리 방식을 비교하는 예제입니다. 내장 라벨, HTML label 요소, 단순 텍스트의 차이점을 보여줍니다. 접근성을 위해 내장 라벨이나 HTML label 요소 사용을 권장합니다.",
      },
    },
  },
};
