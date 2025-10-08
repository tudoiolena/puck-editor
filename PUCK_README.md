# Puck Editor Integration

This project integrates [Puck](https://puckeditor.com/) - a visual editor for React - following the official React Router recipe pattern.

## Architecture

The implementation follows the [Puck React Router recipe](https://github.com/puckeditor/puck/tree/main/recipes/react-router) with the following structure:

### Key Files

1. **`app/puck.config.tsx`** - Puck configuration defining available components
   - `HeadingBlock` - Configurable headings (H1-H6)
   - `TextBlock` - Text/paragraph blocks
   - `ButtonBlock` - Button components with variants

2. **`app/lib/pages.server.ts`** - Server-side page data management
   - `getPage(path)` - Fetch page data by path
   - `savePage(path, data)` - Save/update page data
   - `resolvePage(path)` - Resolve page data with fallback to default

3. **`app/components/puck/PuckRender.tsx`** - Render component for displaying Puck content
   - Uses `Render` component from `@measured/puck`
   - Renders the saved page content

4. **`app/routes/puck.$.tsx`** - Catch-all route for Puck editor
   - Accessible at `/puck/*` paths
   - Provides the visual editor interface
   - Handles saving via action

5. **`app/routes/dashboard.tsx`** - Updated to use Puck
   - Displays rendered Puck content
   - "Edit Page" button links to `/puck/dashboard`

## Usage

### Viewing Content

Navigate to any page (e.g., `/dashboard`) to see the rendered Puck content.

### Editing Content

1. Click the "Edit Page" button on the dashboard
2. You'll be redirected to `/puck/dashboard`
3. Use the visual editor to modify content:
   - Add/remove components from the left panel
   - Edit component properties in the right panel
   - Drag to reorder components
4. Click "Publish" to save changes
5. You'll be redirected back to the published page

## Data Storage

Currently using in-memory storage for demonstration. In production:

1. **Add Database Model** (already have Prisma set up):
   ```prisma
   model Page {
     id        Int      @id @default(autoincrement())
     path      String   @unique
     data      Json
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```

2. **Update `app/lib/pages.server.ts`** to use Prisma instead of in-memory storage

## Available Components

Inspired by the [Puck demo editor](https://demo.puckeditor.com/edit), our configuration includes rich, production-ready components:

### Hero
- **Fields**: `title`, `description`, `align` (left/center), `padding`
- **Usage**: Eye-catching hero sections for landing pages
- **Features**: Gradient background, responsive text sizing

### VerticalSpace
- **Fields**: `size` (16px/32px/64px/96px)
- **Usage**: Add consistent vertical spacing between sections
- **Features**: Helps maintain visual rhythm

### Heading
- **Fields**: `text`, `size` (XL-5XL), `align` (left/center/right)
- **Usage**: Section headings with flexible sizing
- **Features**: Responsive typography, alignment control

### Text
- **Fields**: `text`, `size` (sm/base/lg), `align`, `color` (default/muted)
- **Usage**: Body text and paragraphs
- **Features**: Multiple sizes, alignment options, color variants

### ButtonGroup
- **Fields**: `buttons` (array), `align` (left/center/right)
- **Usage**: Groups of call-to-action buttons
- **Features**: Array field support, multiple button variants, flexible alignment

### Columns
- **Fields**: `columns` (array), `distribution` (auto/manual)
- **Usage**: Multi-column layouts
- **Features**: Responsive grid, auto-distribution

### Card
- **Fields**: `title`, `description`, `icon`, `mode` (flat/card)
- **Usage**: Feature cards, content blocks
- **Features**: Optional icon, card/flat modes, shadow effects

### Flex
- **Fields**: `items` (array), `minItemWidth`
- **Usage**: Flexible grid layouts for features/items
- **Features**: Auto-responsive grid, customizable minimum width

## Extending

To add new components, edit `app/puck.config.tsx`:

```tsx
export const config: Config<UserConfig> = {
  components: {
    // ... existing components
    MyNewComponent: {
      fields: {
        myField: {
          type: "text",
        },
      },
      defaultProps: {
        myField: "Default value",
      },
      render: ({ myField }) => {
        return <div>{myField}</div>;
      },
    },
  },
};
```

Don't forget to update the `UserConfig` type at the top of the file.

## Routes

- `/dashboard` - View rendered content
- `/puck/dashboard` - Edit dashboard content
- `/puck/*` - Edit any page (e.g., `/puck/about`, `/puck/contact`)

## References

- [Puck Documentation](https://puckeditor.com/docs)
- [Puck React Router Recipe](https://github.com/puckeditor/puck/tree/main/recipes/react-router)
- [Puck GitHub Repository](https://github.com/puckeditor/puck)

