import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultFormContent = {
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
};

async function main() {
  console.log('Starting seed...');

  // Get all users
  const users = await prisma.user.findMany();

  if (users.length === 0) {
    console.log('No users found. Please create a user first.');
    return;
  }

  // Create default welcome form for each user who doesn't have one
  for (const user of users) {
    const existingForm = await prisma.form.findFirst({
      where: {
        slug: 'welcome',
        user_id: user.id,
      },
    });

    if (!existingForm) {
      await prisma.form.create({
        data: {
          title: 'Welcome Form',
          description: 'A sample form to get you started',
          slug: 'welcome',
          puck_content: defaultFormContent as any,
          is_published: true,
          user_id: user.id,
          settings: {
            emailNotifications: true,
            requireEmail: true,
            thankYouMessage: 'Thank you for your submission!',
          } as any,
        },
      });
      console.log(`✓ Created default welcome form for user: ${user.email}`);
    } else {
      console.log(`- Welcome form already exists for user: ${user.email}`);
    }
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

