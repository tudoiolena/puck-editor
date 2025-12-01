import type { UserConfig } from "../../types/config";

export const Hero = {
  fields: {
    title: {
      type: "text" as const,
    },
    description: {
      type: "textarea" as const,
    },
    align: {
      type: "radio" as const,
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
      ],
    },
    padding: {
      type: "text" as const,
    },
  },
  defaultProps: {
    title: "Hero Title",
    description: "Hero description",
    align: "left" as const,
    padding: "64px",
  },
  render: (props) => {
    const { title, description, align, padding } = props;
    return (
      <div
        style={{ padding }}
        className={`bg-gradient-to-br from-blue-50 to-indigo-100 ${
          align === "center" ? "text-center" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">{title}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{description}</p>
        </div>
      </div>
    );
  },
};

