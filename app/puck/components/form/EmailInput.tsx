import type { ComponentConfig } from '@measured/puck';
import type { UserConfig } from '../../types/config';

export const EmailInput: ComponentConfig<UserConfig['EmailInput']> = {
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
    helperText: { type: 'text' as const, label: 'Helper Text' },
  },
  defaultProps: {
    name: 'email',
    label: 'Email Address',
    placeholder: 'your@email.com',
    required: true,
    helperText: '',
  },
  render: (props) => {
    const { name, label, placeholder, required, helperText } = props;
    return (
      <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
        <input
          type="email"
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {helperText && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  },
};
