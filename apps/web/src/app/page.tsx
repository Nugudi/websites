export default function Home() {
  return (
    <div className="h-screen p-8" style={{ backgroundColor: "var(--zinc-50)" }}>
      {/* 기본 타이포그래피 테스트 */}
      <div className="space-y-4">
        <h1 className="heading-h1" style={{ color: "var(--main-500)" }}>
          Heading H1
        </h1>

        <div className="title-t1" style={{ color: "var(--main-800)" }}>
          Title T1
        </div>

        <p className="body-b3b" style={{ color: "var(--zinc-600)" }}>
          Body B1 - 기본 본문 텍스트
        </p>

        <p className="body-b3b" style={{ color: "var(--system-error)" }}>
          Body B3B - 굵은 본문 텍스트
        </p>
      </div>

      {/* 색상 팔레트 간단 테스트 */}
      <div className="mt-8">
        <h2 className="title-t2" style={{ color: "var(--main-500)" }}>
          색상 테스트
        </h2>
        <div className="mt-4 flex gap-4">
          <div
            className="h-12 w-12 rounded"
            style={{ backgroundColor: "var(--zinc-100)" }}
          />
          <div
            className="h-12 w-12 rounded"
            style={{ backgroundColor: "var(--zinc-500)" }}
          />
          <div
            className="h-12 w-12 rounded"
            style={{ backgroundColor: "var(--zinc-800)" }}
          />
        </div>
      </div>

      {/* 테스트 안내 */}
      <div className="fixed right-4 bottom-4 rounded border bg-white p-3 text-sm">
        콘솔: document.body.classList.add('theme-dark')
      </div>
    </div>
  );
}
