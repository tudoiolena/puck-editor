import type { ComponentConfig } from '@measured/puck';
import type { UserConfig } from '../../types/config';

export const Columns: ComponentConfig<UserConfig['Columns']> = {
  fields: {
    columns: {
      type: 'array' as const,
      arrayFields: {
        content: { type: 'textarea' as const },
      },
      defaultItemProps: {
        content: 'Column content',
      },
    },
    distribution: {
      type: 'radio' as const,
      options: [
        { label: 'Auto', value: 'auto' },
        { label: 'Manual', value: 'manual' },
      ],
    },
  },
  defaultProps: {
    columns: [{ content: 'Column 1' }, { content: 'Column 2' }],
    distribution: 'auto' as const,
  },
  render: (props) => {
    const { columns, distribution } = props;
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
};
