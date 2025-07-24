# 🌌 To-Do Universe

A cosmic productivity application that transforms task management into an exploration of space. Create, organize, and manage your tasks as floating cards in a beautiful, interactive, and infinite star-filled universe.

![To-Do Universe Screenshot](https://via.placeholder.com/800x400/000014/ffffff?text=🌌+To-Do+Universe)

## ✨ Features

### 🎯 Core Functionality
- **Draggable Task Cards**: Each task is a colorful, draggable card that you can position anywhere in the universe
- **Brief Descriptions**: Quick task summaries (max 120 characters) with a live character counter
- **Markdown Notes**: A dedicated text area for rich text notes with full Markdown support
- **Smart Links**: Add, remove, and manage links. The app automatically detects external URLs (clickable) and local file paths (with a copy button)
- **Auto-Save**: All tasks and your current view (camera position and zoom) are automatically saved to localStorage

### 🚀 Spatial Interaction
- **Infinite Cosmic Canvas**: An endless universe where you can place tasks anywhere
- **Pan & Scan**: Click and drag any empty space to navigate your universe
- **Pinch & Wheel Zoom**: Zoom in on task clusters or pull back to see the bigger picture using a mouse wheel or a two-finger pinch gesture on touch devices
- **Orbit Mode**: Toggle a mesmerizing mode where your cards gently revolve around the center of your view

### 🎨 Visual Design
- **Rich Background**: An animated background with stars, nebulae, and galaxies
- **Meteor Shower Effect**: A beautiful meteor shower effect in light mode
- **Unique Colors**: Each new card gets a random, vibrant color from a curated palette
- **Smooth Animations**: Fluid interactions powered by Framer Motion
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### 🌙 Theming & Accessibility
- **Light/Dark Modes**: Instantly switch between a dark space theme and a glowing light theme
- **Reduced Motion**: Respects the user's operating system preferences for motion reduction
- **High Contrast Support**: Enhanced visibility options for users who need them

### 💾 Data Management
- **Backup Universe**: One-click export of your entire universe (cards and camera view) to a JSON file
- **Restore Universe**: Easily import a previously saved universe from a JSON file
- **Auto-Load**: Automatically loads your last session when you open the app

## 🛠 Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Markdown**: React Markdown
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A package manager like npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo-universe
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) and start exploring your universe!

## 📂 Project Structure

```
todo-universe/
├── app/
│   ├── globals.css         # Global styles and CSS variables
│   ├── layout.tsx          # Root layout component
│   └── page.tsx           # Main application logic
├── lib/
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # Utility functions
├── public/                # Static assets (auto-generated)
├── .eslintrc.json        # ESLint configuration
├── .gitignore            # Git ignore rules
├── next-env.d.ts         # Next.js type definitions
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies and scripts
├── postcss.config.js     # PostCSS configuration
├── README.md            # This file
├── tailwind.config.ts   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## 📖 Usage Guide

### Getting Started
1. When you first open the app, you'll see a welcome card in the center
2. Use the collapsible sidebar on the left for all controls and actions

### Creating and Managing Tasks
- **Create a Card**: Click "New Task" in the sidebar
- **Edit a Card**: Click the pencil icon on any card
- **Delete a Card**: Click the trash icon on any card
- **Move a Card**: Click and drag any card to reposition it (not available in Orbit mode)

### Navigation
- **Pan the Universe**: Click and drag any empty space
- **Zoom**: Use your mouse wheel or pinch with two fingers on a touch device
- **Reset View**: Click "Reset View" to return to the center at 100% zoom

### Special Features
- **Toggle Orbit Mode**: Click "Toggle Orbit" to watch your cards orbit around the center
- **Switch Themes**: Toggle between dark space theme and light theme
- **Backup/Restore**: Use the "Backup Universe" and "Restore Universe" buttons to save/load your entire workspace

### Task Details
- **Brief**: A short description (max 120 characters) displayed as the card title
- **Notes**: Detailed information with full Markdown support
- **Links**: Add web URLs (auto-detected as external) or file paths (local) with custom labels

## 🎨 Customization

### Themes
The app supports two themes:
- **Dark Mode**: Classic space theme with bright stars on a black background
- **Light Mode**: Softer theme with meteor showers and dimmed colors for eye comfort

### Colors
Cards are automatically assigned colors from a curated palette of 14 vibrant colors that ensure good contrast and visual appeal.

### Performance
The app is optimized for smooth performance:
- Canvas-based star field rendering for efficient background animations
- Memoized components to prevent unnecessary re-renders
- Reduced motion support for accessibility
- Local storage for instant loading

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Components
- **StarField**: Canvas-based animated background with stars and nebulae
- **TodoCard**: Interactive draggable task cards with editing capabilities
- **MeteorShower**: Animated meteors for the light theme
- **App**: Main component managing state and interactions

### State Management
The app uses React's `useState` and `useEffect` hooks with local storage persistence. The main state includes:
- `cards`: Array of todo items
- `camera`: Position and zoom level
- `theme`: Current theme ('light' or 'dark')
- `orbitMode`: Whether orbit animation is active

## 🐛 Troubleshooting

### Common Issues
1. **Cards not saving**: Check if localStorage is enabled in your browser
2. **Performance issues**: Try reducing the number of cards or disabling animations in your OS settings
3. **Touch gestures not working**: Ensure you're using a modern browser with touch support

### Browser Compatibility
- **Recommended**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Features that may not work in older browsers**: Canvas animations, CSS Grid, ES6 modules

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues and enhancement requests.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌟 Acknowledgments

- **Framer Motion** for smooth animations
- **Tailwind CSS** for utility-first styling
- **Lucide React** for beautiful icons
- **React Markdown** for rich text support
- **Next.js** for the amazing React framework

---

**Made with 💫 for productivity enthusiasts who dream among the stars.**

*Explore your tasks in a universe of infinite possibilities.*
