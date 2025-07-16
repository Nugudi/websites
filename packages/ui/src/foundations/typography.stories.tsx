const styles = [
  // H1
  "text-h1-semi30",
  // Title
  "text-title1-semi28",
  "text-title2-medi22",
  "text-title3-bold20",
  // Body
  "text-body1-regular17",
  "text-body2-regular16",
  "text-subheadline-regular15",
  "text-subheadline-semi15",
  "text-footnote-regular13",
  "text-footnote-semi13",
  // Caption
  "text-caption1-regular12",
  "text-caption2-regular11",
  // Logo
  "text-logo-large34",
  "text-logo-title20",
];

export default {
  title: "Foundations/Typography",
  parameters: {
    layout: "centered",
  },
};

export const Typography = () => (
  <div className="flex w-[50rem] flex-col gap-6 p-8">
    {styles.map((style) => (
      <div
        key={style}
        className="flex h-16 flex-row items-center justify-between"
      >
        <span className="text-2xl text-gray-500">{style}</span>
        <p className={style}>너의 구로 디지털 단지</p>
      </div>
    ))}
  </div>
);
