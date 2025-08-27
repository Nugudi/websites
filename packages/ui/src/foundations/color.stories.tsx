import { Body, Grid, Title, VStack } from "@nugudi/react-components-layout";
import "@nugudi/react-components-layout/style.css";
import { COLOR_SHADES, type ColorShade, vars } from "@nugudi/themes";

const colorGroups = Object.keys(vars.colors.$scale);

const grayColors = ["zinc"];
const chromaticColors = colorGroups.filter(
  (color) => !grayColors.includes(color),
);

export default {
  title: "Foundations/Color",
  parameters: {
    layout: "padded",
  },
};

export const Color = () => {
  const shades = [...COLOR_SHADES];

  const renderColorRow = (colorName: string) => (
    <div
      key={colorName}
      style={{
        display: "grid",
        gridTemplateColumns: "100px repeat(10, 1fr)",
        gap: "4px",
        alignItems: "center",
      }}
    >
      <Body fontSize="b3" colorShade={500}>
        {colorName}
      </Body>

      {shades.map((shade) => {
        const cssVar =
          vars.colors.$scale[colorName as keyof typeof vars.colors.$scale]?.[
            shade
          ];
        return (
          <div
            key={shade}
            style={{
              width: "100%",
              aspectRatio: "2/1",
              backgroundColor: cssVar || "#f3f4f6",
              borderRadius: "4px",
            }}
            title={`${colorName}-${shade}`}
          />
        );
      })}
    </div>
  );

  return (
    <VStack padding={16} gap={48}>
      {/* Gray Section */}
      <VStack gap={2}>
        <Title fontSize="t1">Gray</Title>
        <VStack gap={2}>
          <ShadeHeader shades={shades} />
        </VStack>
        <VStack gap={2}>
          {grayColors
            .filter(
              (color) =>
                vars.colors.$scale[color as keyof typeof vars.colors.$scale],
            )
            .map(renderColorRow)}
        </VStack>
      </VStack>

      {/* Chromatic Section */}
      <VStack gap={2}>
        <Title fontSize="t1">Chromatic</Title>
        <VStack gap={2}>
          <ShadeHeader shades={shades} />
        </VStack>
        <VStack gap={2}>
          {chromaticColors
            .filter(
              (color) =>
                vars.colors.$scale[color as keyof typeof vars.colors.$scale],
            )
            .map(renderColorRow)}
        </VStack>
      </VStack>
    </VStack>
  );
};

const ShadeHeader = ({ shades }: { shades: ColorShade[] }) => (
  <Grid templateColumns="100px repeat(10, 1fr)">
    <div />
    {shades.map((shade) => (
      <Body
        fontSize="b4"
        colorShade={500}
        key={shade}
        style={{
          textAlign: "center",
        }}
      >
        {shade}
      </Body>
    ))}
  </Grid>
);
