# VS Code Android

A VS Code-like code editor app for Android built with React Native (Expo). It faithfully recreates the VS Code experience on mobile devices with the same dark theme, UI layout, and core functionality.

## Screenshots

### Welcome Screen
![Welcome Screen](screenshots/vscode-android-welcome.png)

### Code Editor with Syntax Highlighting
![Code Editor](screenshots/vscode-android-editor.png)

### Full Editor with Terminal
![Editor with Terminal](screenshots/vscode-android-terminal.png)

## Features

- **VS Code Dark+ Theme** — Exact same color scheme as VS Code
- **Activity Bar** — Left sidebar icons (Explorer, Search, Git, Debug, Extensions)
- **File Explorer** — File tree with folder expand/collapse and icons
- **Code Editor** — Syntax highlighted code viewer with line numbers
- **Syntax Highlighting** — Support for JavaScript, TypeScript, JSON, Markdown, and more
- **Tab Bar** — Multiple files open in tabs
- **Breadcrumb Navigation** — File path shown above the editor
- **Terminal Panel** — Interactive terminal with simulated command output
- **Search Panel** — Search across files with case-sensitive and regex options
- **Status Bar** — VS Code-style status bar with git branch, cursor position, encoding
- **Welcome Screen** — VS Code-style welcome screen with recent files

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/go) app on your Android phone

### Installation

```bash
cd VsCodeAndroid

# Install dependencies
npm install

# Start the Expo development server
npm start
```

Then scan the QR code with the **Expo Go** app on your Android phone.

### Running on Android Emulator

```bash
npm run android
```

### Running on Web (for preview)

```bash
npm run web
```

## Project Structure

```
VsCodeAndroid/
├── App.js                     # Main app entry point
├── app.json                   # Expo configuration
├── src/
│   ├── components/
│   │   ├── ActivityBar.js     # Left sidebar icons
│   │   ├── AppStatusBar.js    # Bottom status bar
│   │   ├── CodeEditor.js      # Code editor with syntax highlighting
│   │   ├── FileExplorer.js    # File tree explorer
│   │   ├── SearchPanel.js     # Search panel
│   │   ├── TabBar.js          # File tabs
│   │   └── Terminal.js        # Terminal/panel area
│   ├── data/
│   │   └── sampleFiles.js     # Sample project file structure
│   └── theme/
│       └── vsCodeTheme.js     # VS Code Dark+ theme colors
└── screenshots/               # App screenshots
```

## Technology Stack

- **React Native** with [Expo](https://expo.dev/)
- **@expo/vector-icons** for Ionicons
- **react-native-web** for web preview
- Custom syntax tokenizer for code highlighting
