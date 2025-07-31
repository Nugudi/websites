import { vars } from "@nugudi/themes";

const colorGroups = Object.keys(vars.colors.$scale);
const colorOptions = ["all", ...colorGroups];

export default {
  title: "Foundations/Color",
  parameters: {
    layout: "centered",
  },
  argTypes: {
    colorGroup: {
      options: colorOptions,
      control: "select",
    },
  },
};

export const Color = ({ colorGroup = "main" }: { colorGroup?: string }) => {
  const groupsToShow = colorGroup === "all" ? colorGroups : [colorGroup];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "32px",
        padding: "32px",
      }}
    >
      {groupsToShow.map((selectedGroup) => (
        <div
          key={selectedGroup}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "16px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: "600",
              color: "#111827",
              textTransform: "capitalize",
            }}
          >
            {selectedGroup}
          </h3>
          <div
            style={{
              display: "grid",
              gap: "8px",
            }}
          >
            {Object.entries(
              vars.colors.$scale[
                selectedGroup as keyof typeof vars.colors.$scale
              ],
            ).map(([shade, cssVar]) => (
              <div
                key={shade}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #f3f4f6",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: cssVar,
                    borderRadius: "4px",
                    border: "1px solid #e5e7eb",
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    {selectedGroup}-{shade}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#6b7280",
                    }}
                  >
                    {cssVar}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
