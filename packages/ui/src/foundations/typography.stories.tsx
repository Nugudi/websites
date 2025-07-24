import { textColors, typographyBase, typographyStyles } from "./typography.css";

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
] as const;

export default {
  title: "Foundations/Typography",
  parameters: {
    layout: "centered",
  },
};

export const Typography = () => (
  <div
    style={{
      display: "flex",
      width: "100%",
      flexDirection: "column",
      gap: "24px",
      padding: "32px",
    }}
  >
    {styles.map((style) => (
      <div
        key={style}
        style={{
          display: "grid",
          height: "64px",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          className={`${typographyBase} ${textColors["main-500"]}`}
          style={{ fontSize: "24px" }}
        >
          {style}
        </span>
        <p className={`${typographyBase} ${typographyStyles[style]}`}>
          너의 구로 디지털 단지
        </p>
      </div>
    ))}
  </div>
);
