# 📷 Rensa - Photography Community Platform

> **Where Every Picture Tells Its Recipe.**

A modern web application dedicated to the art of authentic photography. Share and discover camera recipes—the exact settings and techniques that create stunning images.

## 🏆 Badges

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Tests](https://img.shields.io/badge/tests-Jest-red.svg)

## 📋 Table of Contents

- [About](#-about)
- [Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Testing](#-testing)
- [SEO Optimization](#-seo-optimization)
- [Contributing](#-contributing)
- [Support](#-support)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)
- [Roadmap](#-roadmap)

## 📖 About

**Rensa** is a photography sharing platform where photographers can document and share the exact camera settings and techniques used to capture their images.

In a world of heavy post-processing and filters, Rensa focuses on the magic that happens _inside_ the camera. The application allows photographers to share and discover **"Camera Recipes"**—the specific combination of film simulations, white balance shifts, dynamic range settings, and tone curves used to capture a distinct look.

Whether you're shooting with Fujifilm, Ricoh, or other custom-profile capable cameras, Rensa helps you:

- Document the exact settings that created your image
- Share your unique photographic style
- Discover techniques from the community
- Learn and replicate visual styles you admire

## ✨ Key Features

- **🎞️ Recipe Sharing**: Upload your photos alongside detailed camera settings (Film Simulation, ISO, Grain Effect, WB Shift, etc.)
- **🔍 EXIF Integration**: Automatically extracts metadata to help populate recipe details
- **🎨 Visual Library**: Browse galleries of distinct visual styles (Vintage, Cinematic, B&W) and learn their settings
- **💬 Community Comments**: Engage with photographers through comments and discussions
- **📱 Responsive Design**: Beautiful viewing experience on desktop, tablet, and mobile devices
- **⚡ Modern Performance**: Fast loading and seamless navigation with Next.js and TypeScript
- **🌙 User Authentication**: Secure sign-up and login for personalized experience
- **📸 Photo Upload**: Easy photo upload with automatic EXIF extraction
- **❤️ Bookmarks**: Save your favorite photos for later reference
- **🔔 Notifications**: Stay updated on community activity

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js](https://nextjs.org/) v14 (React 18)
- **Language**: [TypeScript](https://www.typescriptlang.org/) v5.0
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v3.0
- **UI Components**: Daisy UI, Phosphor Icons
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Jotai](https://jotai.org/), [TanStack Query](https://tanstack.com/query/latest), Zustand
- **HTTP Client**: Axios
- **Testing**: [Jest](https://jestjs.io/), React Testing Library

### Backend Services

- **APIs**: Elysia.js (TypeScript), FastAPI (Python)
- **Database**: MongoDB
- **Real-time**: Socket.io
- **File Storage**: Cloudinary
- **Caching**: Redis
- **Authentication**: NextAuth.js

### Development Tools

- **Linting**: ESLint
- **Build Tool**: Next.js built-in
- **Package Manager**: npm / yarn

## 📁 Project Structure

```
rensa-frontend/
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── (auth)/              # Authentication routes
│   │   ├── (explorable)/        # Browsable routes
│   │   ├── api/                 # API routes
│   │   ├── home/                # Home page
│   │   ├── upload/              # Photo upload
│   │   ├── bug-reports/         # Bug report page
│   │   ├── contact/             # Contact page
│   │   ├── layout.tsx           # Root layout with global SEO
│   │   ├── robots.ts            # Search engine crawling rules
│   │   ├── sitemap.ts           # Dynamic sitemap generation
│   │   └── page.tsx             # Home page entry
│   ├── components/              # Reusable React components
│   │   ├── buttons/
│   │   ├── forms/
│   │   ├── cards/
│   │   ├── navbar/
│   │   ├── footer/
│   │   └── SchemaMarkup.tsx     # JSON-LD structured data
│   ├── sections/                # Page sections
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility functions
│   │   ├── auth.ts              # Authentication logic
│   │   ├── axios-client.ts      # HTTP client setup
│   │   ├── mongodb.ts           # Database connection
│   │   └── validation.ts        # Form validation
│   ├── models/                  # Data models/schemas
│   ├── providers/               # Context providers
│   ├── services/                # API service layer
│   ├── stores/                  # State management
│   └── types/                   # TypeScript types
├── public/                      # Static assets
├── __test__/                    # Test files
├── jest.config.ts               # Jest configuration
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **git**: Latest version
- **MongoDB**: Local or cloud instance (MongoDB Atlas)
- **Cloudinary Account**: For image hosting ([Sign up](https://cloudinary.com/))

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/rensa.git
cd rensa-frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your configuration:

```env
# Database
MONGODB_URI=mongodb://...

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📖 Usage

### Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Format code
npm run format
```

### Common Tasks

**Uploading a Photo**

1. Navigate to the Upload page
2. Select your image and fill in camera settings
3. Add optional details (title, description, tags)
4. Submit to share with the community

**Exploring Recipes**

1. Visit the Explore page
2. Browse photos by category or search for specific styles
3. Click on a photo to view the full recipe details
4. Learn the camera settings used to create that look

**Creating a Personal Roll**

1. Navigate to your profile
2. Create a new "Roll" (collection)
3. Add photos to organize your photography style

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm run test -- filename.test.tsx
```

### Test Structure

Tests are organized in the `__test__/` directory:

- `__test__/frontend/` - React component tests
- `__test__/api/` - API endpoint tests
- `__test__/lib/` - Utility function tests
- `__test__/fixtures/` - Test data and mocks

## 🔍 SEO Optimization

Rensa is fully optimized for search engines with:

- **Metadata Management**: Dynamic meta tags for Open Graph, Twitter Cards, and canonical URLs
- **Structured Data**: JSON-LD schema markup for Organization and WebPage
- **Sitemap & Robots**: Automatic sitemap generation and robots.txt configuration
- **Semantic HTML**: Proper heading hierarchy and semantic HTML5 elements
- **Image Optimization**: Responsive images with priority loading and descriptive alt text
- **Social Sharing**: Dynamic OG images for rich previews on social platforms

### SEO Files

| File                              | Purpose                                |
| --------------------------------- | -------------------------------------- |
| `src/app/layout.tsx`              | Global metadata and schema integration |
| `src/app/home/metadata.ts`        | Home page metadata and keywords        |
| `src/app/robots.ts`               | Search engine crawling rules           |
| `src/app/sitemap.ts`              | Dynamic XML sitemap generation         |
| `src/components/SchemaMarkup.tsx` | JSON-LD structured data schemas        |
| `src/app/opengraph-image.tsx`     | Dynamic OG image generation            |
| `src/app/twitter-image.tsx`       | Dynamic Twitter Card image             |

For detailed SEO information, see [SEO_OPTIMIZATION_GUIDE.md](./SEO_OPTIMIZATION_GUIDE.md).

## 🤝 Contributing

We love contributions! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### Contribution Process

1. **Fork the repository** and create a feature branch

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes** and ensure they follow the coding standards

3. **Write tests** for new features or bug fixes

4. **Run tests and linting**

```bash
npm run test
npm run lint
```

5. **Commit with clear messages**

```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve issue"
```

6. **Push to your fork** and create a **Pull Request**

### Coding Standards

- Use **TypeScript** for all new code
- Follow the existing code style and patterns
- Write descriptive commit messages
- Keep components small and focused
- Add tests for new features
- Update documentation as needed

For detailed contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md)

For our community standards, see [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)

## 💬 Support

### Getting Help

- **📚 Documentation**: Check [SEO_OPTIMIZATION_GUIDE.md](./SEO_OPTIMIZATION_GUIDE.md) and inline code comments
- **🐛 Report Issues**: Use [GitHub Issues](https://github.com/yourusername/rensa/issues) for bug reports
- **💡 Request Features**: Use [GitHub Discussions](https://github.com/yourusername/rensa/discussions) for feature requests
- **💬 Community Chat**: Join our [Discord Community](https://discord.gg/your-invite)
- **📧 Email Support**: Contact us at support@rensa.site

### Reporting Bugs

When reporting bugs, please include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Browser, Node version)
- Screenshots if applicable

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for complete details.

MIT License © 2026 Rensa Contributors

## 🙏 Acknowledgements

### Contributors

- Thanks to all contributors who have helped shape Rensa

### Technologies

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [MongoDB](https://www.mongodb.com/) - Database
- [Cloudinary](https://cloudinary.com/) - Image hosting

### Community

- Photography enthusiasts who inspire the project
- Open-source community for tools and libraries

## 🗺️ Roadmap & Status

### Current Status

🟢 **Active Development** - Currently in active development with regular updates

### Completed ✅

- [x] Core photo upload functionality
- [x] Recipe metadata sharing
- [x] User authentication
- [x] Photo exploration and browsing
- [x] Comment system
- [x] SEO optimization
- [x] Responsive design
- [x] Dark mode support

### In Progress 🔄

- [ ] Advanced search filters
- [ ] Photo editing tools
- [ ] Mobile app (React Native)
- [ ] AI-powered recipe suggestions
- [ ] Social sharing integrations

### Planned 📋

- [ ] Advanced analytics dashboard
- [ ] API for third-party integrations
- [ ] Camera settings database
- [ ] Workshop and tutorial section
- [ ] Community voting system
- [ ] Print-on-demand integration

For more details, see our [GitHub Issues](https://github.com/yourusername/rensa/issues) and [Project Board](https://github.com/yourusername/rensa/projects)

---

**Made with 📷 by the Rensa Team**

Visit us at [rensa.site](https://rensa.site)
