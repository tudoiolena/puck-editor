export const TextArea = {
  fields: {
    name: { type: 'text' as const, label: 'Field Name' },
    label: { type: 'text' as const, label: 'Label' },
    placeholder: { type: 'text' as const, label: 'Placeholder' },
    required: {
      type: 'radio' as const,
      options: [
        { label: 'Required', value: true },
        { label: 'Optional', value: false },
      ],
    },
    rows: { type: 'number' as const, label: 'Rows' },
    helperText: { type: 'text' as const, label: 'Helper Text' },
  },
  defaultProps: {
    name: 'message',
    label: 'Message',
    placeholder: '',
    required: false,
    rows: 4,
    helperText: '',
  },
  render: (props) => {
    const { name, label, placeholder, required, rows, helperText } = props;
    return (
      <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {helperText && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  },
};
