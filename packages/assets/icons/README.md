# 🔧 아이콘 시스템 사용 가이드

## 📝 새 아이콘 추가하기

새로운 아이콘을 추가하려면 다음 3단계를 따라주세요:

### 1. SVG 파일 추가

SVG 파일을 `svg/` 폴더에 넣어주세요.

```
packages/assets/icons/svg/new-icon.svg
```

### 2. iconRegistry에 등록

`src/registry.ts` 파일의 `iconRegistry` 객체에 아이콘을 등록해주세요:

```typescript
import NewIcon from "../svg/new-icon.svg?react";

export const iconRegistry: IconRegistry = {
  // ... 기존 아이콘들
  NewIcon: {
    component: NewIcon,
    tags: ["new", "새로운", "추가", "키워드"],
  },
};
```

### 3. index.ts에 export 추가

`src/index.ts` 파일에 export를 추가해주세요:

```typescript
export { default as NewIcon } from "../svg/new-icon.svg?react";
```
