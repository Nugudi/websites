const styles = [
  "h1",
  "t1",
  "t2",
  "t3",
  "b1",
  "b2",
  "b3",
  "b3b",
  "b4",
  "b4b",
  "e1",
  "e2",
  "l1",
  "l2",
];

export default {
  title: "Foundations/Typography",
  parameters: {
    layout: "centered",
  },
};

export const Typography = () => (
  <div className="flex w-full flex-col gap-6 p-8">
    {styles.map((style) => (
      <div
        key={style}
        className="grid h-16 grid-cols-2 items-center justify-between"
      >
        <span className="text-2xl text-main-500">{style}</span>
        <p className={style}>너의 구로 디지털 단지</p>
      </div>
    ))}
  </div>
);
