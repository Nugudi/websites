#!/bin/bash

echo "🚀 Nugudi 프로젝트 초기 세팅을 시작합니다..."

# Check Node.js version
echo "📋 Node.js 버전 확인 중..."
NODE_VERSION=$(node -v)
echo "현재 Node.js 버전: $NODE_VERSION"

# Install dependencies
echo "📦 의존성 설치 중..."
pnpm install

# Setup git hooks
echo "🔗 Git 훅 설정 중..."
pnpm prepare

# Run linting
echo "🔍 코드 린팅 검사 중..."
pnpm lint

# Run type checking
echo "🔧 타입 체크 중..."
pnpm check-types

# Build UI package
echo "🎨 UI 패키지 빌드 중..."
pnpm --filter @nugudi/nugudi-ui build

echo "✅ 초기 세팅이 완료되었습니다!"
echo ""
echo "다음 명령어를 사용하여 개발을 시작하세요:"
echo "  pnpm dev          # 모든 앱 개발 모드 실행"
echo "  pnpm commit       # 커밋 메시지 작성 도우미"
echo ""
echo "Storybook은 다음 명령어로 실행할 수 있습니다:"
echo "  cd packages/ui && pnpm dev:storybook"