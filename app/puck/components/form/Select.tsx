export const Select = {
  fields: {
    name: { type: "text" as const, label: "Field Name" },
    label: { type: "text" as const, label: "Label" },
    required: { type: "radio" as const, options: [{ label: "Required", value: true }, { label: "Optional", value: false }] },
    options: {
      type: "array" as const,
      arrayFields: {
        label: { type: "text" as const },
        value: { type: "text" as const },
      },
      defaultItemProps: {
        label: "Option",
        value: "option",
      },
    },
    helperText: { type: "text" as const, label: "Helper Text" },
  },
  defaultProps: {
    name: "select",
    label: "Select Option",
    required: false,
    options: [
      { label: "Option 1", value: "option1" },
      { label: "Option 2", value: "option2" },
    ],
    helperText: "",
  },
  render: (props) => {
    const { name, label, required, options, helperText } = props;
    return (
      <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
        <select
          id={name}
          name={name}
          required={required}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select an option...</option>
          {options.map((option, idx) => (
            <option key={idx} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {helperText && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  },
};

