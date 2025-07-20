import fs from "node:fs";
import * as theme from "../dist/index.js";

// theme.css
// :root {
//   --gray-900: #171923
// }

const toCssCasting = (str) => {
  return str
    .replace(/([a-z])(\d)/, "$1-$2")
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase();
};

// 클래스명을 kebab-case로 변환하는 함수
const toClassName = (mainKey, subKey) => {
  // mainKey와 subKey를 kebab-case로 변환
  const mainKebab = mainKey.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

  const subKebab = subKey.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

  return `${mainKebab}-${subKebab}`;
};

const generateThemeCssVariables = () => {
  const cssString = [];

  Object.entries(theme.vars).forEach(([key, value]) => {
    if (key === "colors") {
      Object.entries(value.$static).forEach(([colorKey, colorValue]) => {
        if (colorKey === "light") {
          const selector = ":root";

          const cssVariables = Object.entries(colorValue)
            .map(([mainKey, mainValue]) =>
              Object.entries(mainValue)
                .map(
                  ([subKey, subValue]) =>
                    `--${toCssCasting(mainKey)}-${toCssCasting(
                      subKey,
                    )}: ${subValue};`,
                )
                .join("\n"),
            )
            .join("\n");

          return cssString.push(`${selector} {\n${cssVariables}\n}`);
        }

        if (colorKey === "dark") {
          const selector = ":root .theme-dark";

          const cssVariables = Object.entries(colorValue)
            .map(([mainKey, mainValue]) =>
              Object.entries(mainValue)
                .map(
                  ([subKey, subValue]) =>
                    `--${toCssCasting(mainKey)}-${toCssCasting(
                      subKey,
                    )}: ${subValue};`,
                )
                .join("\n"),
            )
            .join("\n");

          return cssString.push(`${selector} {\n${cssVariables}\n}`);
        }
      });

      return;
    }

    const selector = ":root";

    const cssVariables = Object.entries(value)
      .map(([mainKey, mainValue]) =>
        Object.entries(mainValue)
          .map(
            ([subKey, subValue]) =>
              `--${toCssCasting(mainKey)}-${toCssCasting(subKey)}: ${subValue};`,
          )
          .join("\n"),
      )
      .join("\n");

    return cssString.push(`${selector} {\n${cssVariables}\n}`);
  });
  return cssString;
};

// .heading-h1 {
//   font-size: 3rem;
//   font-weight: 700;
//   line-height: 100%;
// }

const generateThemeCssClasses = () => {
  const cssString = [];

  Object.entries(theme.classes).forEach(([, value]) => {
    const cssClasses = Object.entries(value)
      .map(([mainKey, mainValue]) =>
        Object.entries(mainValue)
          .map(([subKey, subValue]) => {
            const className = `.${toClassName(mainKey, subKey)}`;

            const styleProperties = Object.entries(subValue)
              .map(
                ([styleKey, styleValue]) =>
                  `${toCssCasting(styleKey)}: ${styleValue};`,
              )
              .join("\n");

            return `${className} {\n${styleProperties}\n}`;
          })
          .join("\n"),
      )
      .join("\n");

    cssString.push(cssClasses);
  });

  return cssString;
};

const generateThemeCss = () => {
  const variables = generateThemeCssVariables();
  const classes = generateThemeCssClasses();

  fs.writeFileSync("dist/themes.css", [...variables, ...classes].join("\n"));
};

generateThemeCss();
