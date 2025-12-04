import type { ComponentConfig } from '@measured/puck';
import type { UserConfig } from '../../types/config';

export const Flex: ComponentConfig<UserConfig['Flex']> = {
  fields: {
    items: {
      type: 'array' as const,
      arrayFields: {
        title: { type: 'text' as const },
        description: { type: 'text' as const },
      },
      defaultItemProps: {
        title: 'Item',
        description: 'Description',
      },
    },
    minItemWidth: {
      type: 'number' as const,
    },
  },
  defaultProps: {
    items: [
      { title: 'Feature 1', description: 'Description 1' },
      { title: 'Feature 2', description: 'Description 2' },
      { title: 'Feature 3', description: 'Description 3' },
    ],
    minItemWidth: 256,
  },
  render: (props) => {
    const { items, minItemWidth } = props;
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
};
