# @nugudi/react-components-tab

React Tab 컴포넌트 라이브러리입니다. 간단하고 유연한 API로 탭 인터페이스를 구현할 수 있습니다.

## 설치

```bash
npm install @nugudi/react-components-tab
```

## 기본 사용법

### 컴파운드 패턴

간단하게 `defaultValue`만 설정하면 내부에서 상태를 관리합니다.

```tsx
import { Tabs } from "@nugudi/react-components-tab";

const App = () => {
  return (
    <Tabs defaultValue="tab1" size="full">
      <Tabs.List>
        <Tabs.Item value="tab1">식당 정보</Tabs.Item>
        <Tabs.Item value="tab2">리뷰</Tabs.Item>
        <Tabs.Item value="tab3" disabled>
          메뉴
        </Tabs.Item>
      </Tabs.List>

      <Tabs.Panel value="tab1">
        <h3>식당 정보</h3>
        <p>식당의 기본 정보를 확인하세요.</p>
      </Tabs.Panel>

      <Tabs.Panel value="tab2">
        <h3>리뷰</h3>
        <p>다른 고객들의 리뷰를 읽어보세요.</p>
      </Tabs.Panel>

      <Tabs.Panel value="tab3">
        <h3>메뉴</h3>
        <p>메뉴 정보는 준비 중입니다.</p>
      </Tabs.Panel>
    </Tabs>
  );
};
```

## 접근성

이 컴포넌트는 WAI-ARIA 가이드라인을 따릅니다:

- `role="tablist"`, `role="tab"`, `role="tabpanel"` 속성 사용
- `aria-selected`, `aria-disabled` 상태 관리
- 키보드 네비게이션 지원 (화살표 키)
