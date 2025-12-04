export const RadioGroup = {
  fields: {
    name: { type: 'text' as const, label: 'Field Name' },
    label: { type: 'text' as const, label: 'Label' },
    required: {
      type: 'radio' as const,
      options: [
        { label: 'Required', value: true },
        { label: 'Optional', value: false },
      ],
    },
    options: {
      type: 'array' as const,
      arrayFields: {
        label: { type: 'text' as const },
        value: { type: 'text' as const },
      },
      defaultItemProps: {
        label: 'Option',
        value: 'option',
      },
    },
  },
  defaultProps: {
    name: 'radio',
    label: 'Choose One',
    required: false,
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ],
  },
  render: (props) => {
    const { name, label, required, options } = props;
    return (
      <div className="mb-4">
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-600">*</span>}
          </legend>
          <div className="space-y-2">
            {options.map((option, idx) => (
              <div key={idx} className="flex items-center">
                <input
                  type="radio"
                  id={`${name}-${idx}`}
                  name={name}
                  value={option.value}
                  required={required && idx === 0}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor={`${name}-${idx}`} className="ml-2 text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    );
  },
};
