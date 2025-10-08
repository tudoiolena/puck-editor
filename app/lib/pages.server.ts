import type { Data } from "@measured/puck";
import { prisma } from "./db";

export interface Page {
  id: string;
  path: string;
  data: Data;
}

// In-memory storage for demo purposes
// In production, you would use a database
const pages: Record<string, Data> = {
  "/dashboard": {
    content: [
      {
        type: "Hero",
        props: {
          id: "hero-1",
          title: "Welcome to Your Dashboard",
          description: "Build beautiful pages with our visual editor. Drag and drop components, customize everything, and publish instantly.",
          align: "center",
          padding: "80px",
        },
      },
      {
        type: "VerticalSpace",
        props: {
          id: "space-1",
          size: "64px",
        },
      },
      {
        type: "Heading",
        props: {
          id: "heading-1",
          text: "Key Features",
          size: "3xl",
          align: "center",
        },
      },
      {
        type: "VerticalSpace",
        props: {
          id: "space-2",
          size: "32px",
        },
      },
      {
        type: "Flex",
        props: {
          id: "flex-1",
          items: [
            {
              title: "🎨 Visual Editor",
              description: "Intuitive drag-and-drop interface for building pages",
            },
            {
              title: "⚡ Fast & Modern",
              description: "Built with the latest web technologies for optimal performance",
            },
            {
              title: "🔧 Customizable",
              description: "Every component can be tailored to your exact needs",
            },
          ],
          minItemWidth: 280,
        },
      },
      {
        type: "VerticalSpace",
        props: {
          id: "space-3",
          size: "64px",
        },
      },
      {
        type: "Card",
        props: {
          id: "card-1",
          title: "Get Started Today",
          description: "Click the 'Edit Page' button above to start customizing this dashboard with our visual editor.",
          icon: "🚀",
          mode: "card",
        },
      },
      {
        type: "VerticalSpace",
        props: {
          id: "space-4",
          size: "32px",
        },
      },
      {
        type: "ButtonGroup",
        props: {
          id: "buttons-1",
          buttons: [
            {
              label: "View Documentation",
              href: "#docs",
              variant: "primary",
            },
            {
              label: "Browse Components",
              href: "#components",
              variant: "secondary",
            },
          ],
          align: "center",
        },
      },
    ],
    root: {
      props: {
        title: "Dashboard",
      },
    },
  },
};

export async function getPage(path: string): Promise<Data | null> {
  // TODO: Fetch from database
  // const page = await prisma.page.findUnique({
  //   where: { path },
  // });
  // return page?.data || null;

  return pages[path] || null;
}

export async function savePage(path: string, data: Data): Promise<void> {
  // TODO: Save to database
  // await prisma.page.upsert({
  //   where: { path },
  //   update: { data },
  //   create: { path, data },
  // });

  pages[path] = data;
}

export async function resolvePage(path: string): Promise<Data> {
  const data = await getPage(path);
  
  if (!data) {
    // Return default empty page structure
    return {
      content: [],
      root: {
        props: {
          title: "New Page",
        },
      },
    };
  }
  
  return data;
}

