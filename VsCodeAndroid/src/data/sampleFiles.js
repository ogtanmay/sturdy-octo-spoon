// Sample file structure for the VS Code-like editor
export const sampleFiles = {
  id: 'root',
  name: 'my-project',
  type: 'folder',
  isOpen: true,
  children: [
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      isOpen: true,
      children: [
        {
          id: 'app-js',
          name: 'App.js',
          type: 'file',
          language: 'javascript',
          content: `import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Main App Component
const App = () => {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.example.com/data');
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePress = () => {
    setCount(prevCount => prevCount + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, World!</Text>
      <Text style={styles.subtitle}>
        Count: {count}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});

export default App;
`,
        },
        {
          id: 'index-js',
          name: 'index.js',
          type: 'file',
          language: 'javascript',
          content: `import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
`,
        },
        {
          id: 'components',
          name: 'components',
          type: 'folder',
          isOpen: false,
          children: [
            {
              id: 'button-js',
              name: 'Button.js',
              type: 'file',
              language: 'javascript',
              content: `import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ title, onPress, variant = 'primary', disabled = false }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, styles[\`\${variant}Text\`]]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#0e639c',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0e639c',
  },
  primaryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  secondaryText: {
    color: '#0e639c',
    fontSize: 14,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
`,
            },
            {
              id: 'header-js',
              name: 'Header.js',
              type: 'file',
              language: 'javascript',
              content: `import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Header = ({ title, onBack, rightAction }) => {
  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {rightAction && (
        <View style={styles.rightContainer}>
          {rightAction}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: '#1e1e1e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  backText: {
    color: '#cccccc',
    fontSize: 20,
  },
  title: {
    flex: 1,
    color: '#cccccc',
    fontSize: 16,
    fontWeight: '600',
  },
  rightContainer: {
    marginLeft: 12,
  },
});

export default Header;
`,
            },
          ],
        },
        {
          id: 'hooks',
          name: 'hooks',
          type: 'folder',
          isOpen: false,
          children: [
            {
              id: 'use-api-js',
              name: 'useApi.js',
              type: 'file',
              language: 'javascript',
              content: `import { useState, useCallback } from 'react';

/**
 * Custom hook for API calls
 * @param {Function} apiFunction - The API function to call
 * @returns {Object} - { data, loading, error, execute }
 */
const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return { data, loading, error, execute };
};

export default useApi;
`,
            },
          ],
        },
      ],
    },
    {
      id: 'package-json',
      name: 'package.json',
      type: 'file',
      language: 'json',
      content: `{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A React Native project",
  "main": "src/index.js",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "test": "jest",
    "lint": "eslint ."
  },
  "dependencies": {
    "expo": "~52.0.0",
    "react": "18.3.1",
    "react-native": "0.76.3",
    "@expo/vector-icons": "^14.0.0",
    "react-navigation": "^6.0.0",
    "@react-navigation/native": "^6.0.0",
    "@react-navigation/stack": "^6.0.0"
  },
  "devDependencies": {
    "@babel/core": "^7.24.0",
    "eslint": "^8.0.0",
    "jest": "^29.0.0",
    "@types/react": "~18.3.0"
  },
  "jest": {
    "preset": "jest-expo"
  }
}
`,
    },
    {
      id: 'app-json',
      name: 'app.json',
      type: 'file',
      language: 'json',
      content: `{
  "expo": {
    "name": "MyProject",
    "slug": "my-project",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.example.myproject"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.example.myproject"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
`,
    },
    {
      id: 'readme-md',
      name: 'README.md',
      type: 'file',
      language: 'markdown',
      content: `# My Project

A React Native application built with Expo.

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- Expo CLI

### Installation

\`\`\`bash
# Install dependencies
npm install

# Start the development server
npm start
\`\`\`

### Running on Device

\`\`\`bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
\`\`\`

## Project Structure

\`\`\`
src/
  ├── components/    # Reusable UI components
  ├── hooks/         # Custom React hooks
  ├── screens/       # Screen components
  ├── services/      # API services
  └── utils/         # Utility functions
\`\`\`

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

[MIT](https://choosealicense.com/licenses/mit/)
`,
    },
    {
      id: 'gitignore',
      name: '.gitignore',
      type: 'file',
      language: 'text',
      content: `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/

# Production
build/
dist/

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

# Expo
.expo/
dist/
web-build/

# Native
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# macOS
.DS_Store

# iOS
ios/Pods/
ios/build/

# Android
android/build/
android/app/build/
`,
    },
    {
      id: 'tsconfig',
      name: 'tsconfig.json',
      type: 'file',
      language: 'json',
      content: `{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@screens/*": ["src/screens/*"],
      "@services/*": ["src/services/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.d.ts",
    "expo-env.d.ts"
  ]
}
`,
    },
  ],
};

export const getFileById = (id, node = sampleFiles) => {
  if (node.id === id) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = getFileById(id, child);
      if (found) return found;
    }
  }
  return null;
};

export const getFileIcon = (name, type) => {
  if (type === 'folder') return 'folder';
  const ext = name.split('.').pop()?.toLowerCase();
  const iconMap = {
    js: 'javascript',
    jsx: 'react',
    ts: 'typescript',
    tsx: 'react',
    json: 'json',
    md: 'markdown',
    css: 'css',
    html: 'html',
    py: 'python',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    java: 'java',
    kt: 'kotlin',
    swift: 'swift',
    sh: 'shell',
    gitignore: 'git',
  };
  return iconMap[ext] || 'file';
};
