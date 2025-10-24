export const ThemeScript = () => {
  const initDarkTheme = `
    (() => {
      try {
        // 기본 다크 테마 설정 (hydration 일관성을 위해)
        document.documentElement.classList.add('theme-dark');
        
        // 사용자 선호도에 따른 테마 적용
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (!isDark) {
          document.documentElement.classList.remove('theme-dark');
        }

        // 테마 변경 감지
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
          if (e.matches) {
            document.documentElement.classList.add('theme-dark');
          } else {
            document.documentElement.classList.remove('theme-dark');
          }
        });
      } catch (e) {
        console.error('[ThemeScript] Failed to apply theme:', e);
      }
    })();
  `;

  // biome-ignore lint/security/noDangerouslySetInnerHtml: 다크모드 초기화 스크립트
  return <script dangerouslySetInnerHTML={{ __html: initDarkTheme }} />;
};
