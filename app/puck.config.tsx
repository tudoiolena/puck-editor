import type { Config } from "@measured/puck";

export type UserConfig = {
  Hero: {
    title: string;
    description: string;
    align: "left" | "center";
    padding: string;
  };
  VerticalSpace: {
    size: string;
  };
  Heading: {
    text: string;
    size: "xl" | "2xl" | "3xl" | "4xl" | "5xl";
    align: "left" | "center" | "right";
  };
  Text: {
    text: string;
    size: "sm" | "base" | "lg";
    align: "left" | "center" | "right";
    color: "default" | "muted";
  };
  ButtonGroup: {
    buttons: Array<{
      label: string;
      href: string;
      variant: "primary" | "secondary";
    }>;
    align: "left" | "center" | "right";
  };
  Columns: {
    columns: Array<{
      content: string;
    }>;
    distribution: "auto" | "manual";
  };
  Card: {
    title: string;
    description: string;
    icon?: string;
    mode: "flat" | "card";
  };
  Flex: {
    items: Array<{
      title: string;
      description: string;
    }>;
    minItemWidth: number;
  };
};

export const config: Config<UserConfig> = {
  components: {
    Hero: {
      fields: {
        title: {
          type: "text",
        },
        description: {
          type: "textarea",
        },
        align: {
          type: "radio",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
          ],
        },
        padding: {
          type: "text",
        },
      },
      defaultProps: {
        title: "Hero Title",
        description: "Hero description",
        align: "left",
        padding: "64px",
      },
      render: ({ title, description, align, padding }) => {
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
    },
    VerticalSpace: {
      fields: {
        size: {
          type: "select",
          options: [
            { label: "Small (16px)", value: "16px" },
            { label: "Medium (32px)", value: "32px" },
            { label: "Large (64px)", value: "64px" },
            { label: "XLarge (96px)", value: "96px" },
          ],
        },
      },
      defaultProps: {
        size: "32px",
      },
      render: ({ size }) => {
        return <div style={{ height: size }} />;
      },
    },
    Heading: {
      fields: {
        text: {
          type: "text",
        },
        size: {
          type: "select",
          options: [
            { label: "XL", value: "xl" },
            { label: "2XL", value: "2xl" },
            { label: "3XL", value: "3xl" },
            { label: "4XL", value: "4xl" },
            { label: "5XL", value: "5xl" },
          ],
        },
        align: {
          type: "radio",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
      },
      defaultProps: {
        text: "Heading",
        size: "2xl",
        align: "left",
      },
      render: ({ text, size, align }) => {
        const sizeClasses = {
          xl: "text-xl",
          "2xl": "text-2xl",
          "3xl": "text-3xl",
          "4xl": "text-4xl",
          "5xl": "text-5xl",
        };
        return (
          <h2
            className={`${sizeClasses[size]} font-bold text-${align} text-gray-900 mb-2`}
          >
            {text}
          </h2>
        );
      },
    },
    Text: {
      fields: {
        text: {
          type: "textarea",
        },
        size: {
          type: "select",
          options: [
            { label: "Small", value: "sm" },
            { label: "Base", value: "base" },
            { label: "Large", value: "lg" },
          ],
        },
        align: {
          type: "radio",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        color: {
          type: "radio",
          options: [
            { label: "Default", value: "default" },
            { label: "Muted", value: "muted" },
          ],
        },
      },
      defaultProps: {
        text: "Text content",
        size: "base",
        align: "left",
        color: "default",
      },
      render: ({ text, size, align, color }) => {
        const sizeClasses = {
          sm: "text-sm",
          base: "text-base",
          lg: "text-lg",
        };
        const colorClasses = {
          default: "text-gray-900",
          muted: "text-gray-600",
        };
        return (
          <p
            className={`${sizeClasses[size]} ${colorClasses[color]} text-${align} whitespace-pre-wrap`}
          >
            {text}
          </p>
        );
      },
    },
    ButtonGroup: {
      fields: {
        buttons: {
          type: "array",
          arrayFields: {
            label: { type: "text" },
            href: { type: "text" },
            variant: {
              type: "select",
              options: [
                { label: "Primary", value: "primary" },
                { label: "Secondary", value: "secondary" },
              ],
            },
          },
          defaultItemProps: {
            label: "Button",
            href: "#",
            variant: "primary",
          },
        },
        align: {
          type: "radio",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
      },
      defaultProps: {
        buttons: [{ label: "Click me", href: "#", variant: "primary" }],
        align: "left",
      },
      render: ({ buttons, align }) => {
        const alignClasses = {
          left: "justify-start",
          center: "justify-center",
          right: "justify-end",
        };
        return (
          <div className={`flex gap-2 ${alignClasses[align]}`}>
            {buttons.map((button, idx) => (
              <a
                key={idx}
                href={button.href}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  button.variant === "primary"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }`}
              >
                {button.label}
              </a>
            ))}
          </div>
        );
      },
    },
    Columns: {
      fields: {
        columns: {
          type: "array",
          arrayFields: {
            content: { type: "textarea" },
          },
          defaultItemProps: {
            content: "Column content",
          },
        },
        distribution: {
          type: "radio",
          options: [
            { label: "Auto", value: "auto" },
            { label: "Manual", value: "manual" },
          ],
        },
      },
      defaultProps: {
        columns: [
          { content: "Column 1" },
          { content: "Column 2" },
        ],
        distribution: "auto",
      },
      render: ({ columns, distribution }) => {
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {columns.map((column, idx) => (
              <div key={idx} className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-700">{column.content}</p>
              </div>
            ))}
          </div>
        );
      },
    },
    Card: {
      fields: {
        title: {
          type: "text",
        },
        description: {
          type: "textarea",
        },
        icon: {
          type: "text",
        },
        mode: {
          type: "radio",
          options: [
            { label: "Flat", value: "flat" },
            { label: "Card", value: "card" },
          ],
        },
      },
      defaultProps: {
        title: "Card Title",
        description: "Card description",
        icon: "⭐",
        mode: "card",
      },
      render: ({ title, description, icon, mode }) => {
        return (
          <div
            className={`p-6 rounded-lg ${
              mode === "card"
                ? "bg-white shadow-lg border border-gray-100"
                : "bg-transparent"
            }`}
          >
            {icon && <div className="text-4xl mb-4">{icon}</div>}
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        );
      },
    },
    Flex: {
      fields: {
        items: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            description: { type: "text" },
          },
          defaultItemProps: {
            title: "Item",
            description: "Description",
          },
        },
        minItemWidth: {
          type: "number",
        },
      },
      defaultProps: {
        items: [
          { title: "Feature 1", description: "Description 1" },
          { title: "Feature 2", description: "Description 2" },
          { title: "Feature 3", description: "Description 3" },
        ],
        minItemWidth: 256,
      },
      render: ({ items, minItemWidth }) => {
        return (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}px, 1fr))`,
            }}
          >
            {items.map((item, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        );
      },
    },
  },
};

