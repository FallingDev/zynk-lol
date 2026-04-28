# Zynk.lol

A modern, customizable profile platform built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Features

- **Customizable Profiles**: Create beautiful profile pages with custom colors, fonts, layouts, and effects
- **Link Management**: Add, edit, and organize your links with drag-and-drop support
- **Discord Integration**: Login with Discord OAuth and display Discord widgets
- **Template System**: Community-driven templates with moderation
- **Premium Features**: Advanced customization options (one-time $9.99 purchase)
- **Analytics**: Profile view tracking and engagement stats

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js (Credentials + Discord OAuth)
- **UI Components**: Custom glassmorphism design system

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Discord OAuth credentials (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/zynk-lol.git
cd zynk-lol
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/zynk?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
```

4. Set up the database:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
zynk-lol/
├── app/
│   ├── (auth)/           # Auth pages (login, register)
│   ├── (dashboard)/      # Dashboard pages (protected)
│   ├── [username]/       # Public profile pages
│   ├── api/              # API routes
│   ├── page.tsx          # Landing page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # UI components (Button, GlassCard, etc.)
│   ├── layout/           # Layout components (Sidebar)
│   ├── dashboard/        # Dashboard-specific components
│   ├── profile/          # Profile components
│   └── providers/        # Context providers
├── lib/
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # Auth utilities
│   ├── auth-options.ts   # NextAuth configuration
│   ├── validations.ts    # Zod schemas
│   └── utils.ts          # Utility functions
├── prisma/
│   └── schema.prisma     # Database schema
├── types/
│   ├── index.ts          # TypeScript types
│   └── next-auth.d.ts    # NextAuth type extensions
├── public/
│   ├── logo-dark.png     # Dark mode logo
│   └── logo-light.png    # Light mode logo
└── package.json
```

## Database Schema

The application uses the following main models:

- **User**: Accounts with email/password or Discord OAuth
- **Profile**: User profile data (bio, appearance settings, etc.)
- **Link**: User's profile links
- **Badge**: Achievements/badges system
- **Template**: Community-submitted profile templates
- **Widget**: Optional profile widgets (Discord, Spotify)
- **ProfileView**: Analytics tracking

## Customization

### Themes

The application uses a dark-first design with:
- **Primary Colors**: Purple → Blue gradient (#8b5cf6 → #3b82f6)
- **Background**: Near-black (#0a0a0a)
- **Glassmorphism**: Backdrop blur with transparency

### Profile Customization Options

Users can customize:
- Accent colors
- Font family (Inter, Roboto, Poppins, Montserrat)
- Layout (Floating, Stacked, Compact)
- Avatar shape (Square, Rounded, Circle)
- Card style (Glass, Outlined, Soft)
- Background (Solid color, Image, Gradient)
- Effects (Glow, Tilt, Animations)

## Deployment

### Build for production:

```bash
npm run build
```

### Deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/zynk-lol)

Make sure to set all environment variables in your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) for details

## Support

For support, email support@zynk.lol or join our [Discord server](https://discord.gg/zynk).
