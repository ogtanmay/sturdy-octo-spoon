import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, fontFamily } from '../theme/vsCodeTheme';

// Simple syntax highlighting tokenizer
const tokenize = (code, language) => {
  if (!code) return [{ text: '', type: 'plain' }];

  const lines = code.split('\n');
  return lines.map((line) => tokenizeLine(line, language));
};

const tokenizeLine = (line, language) => {
  const tokens = [];

  if (language === 'javascript' || language === 'typescript') {
    return tokenizeJS(line);
  } else if (language === 'json') {
    return tokenizeJSON(line);
  } else if (language === 'markdown') {
    return tokenizeMarkdown(line);
  } else {
    return [{ text: line, type: 'plain' }];
  }
};

const tokenizeJS = (line) => {
  const tokens = [];
  let remaining = line;
  let pos = 0;

  const keywords = [
    'import', 'export', 'default', 'from', 'const', 'let', 'var', 'function',
    'return', 'if', 'else', 'for', 'while', 'do', 'break', 'continue',
    'class', 'extends', 'new', 'this', 'super', 'typeof', 'instanceof',
    'try', 'catch', 'finally', 'throw', 'async', 'await', 'of', 'in',
    'null', 'undefined', 'true', 'false', 'switch', 'case', 'void',
    'static', 'get', 'set', 'yield', 'delete',
  ];

  const patterns = [
    // Single-line comments
    { regex: /^(\/\/.*)/, type: 'comment' },
    // Multi-line comment start
    { regex: /^(\/\*.*?\*\/)/, type: 'comment' },
    // Template literals
    { regex: /^(`(?:[^`\\]|\\.)*`)/, type: 'string' },
    // Double-quoted strings
    { regex: /^("(?:[^"\\]|\\.)*")/, type: 'string' },
    // Single-quoted strings
    { regex: /^('(?:[^'\\]|\\.)*')/, type: 'string' },
    // Numbers
    { regex: /^(\b\d+\.?\d*\b)/, type: 'number' },
    // JSX tags
    { regex: /^(<\/?[A-Z][a-zA-Z]*)/, type: 'type' },
    { regex: /^(<\/?[a-z][a-zA-Z]*)/, type: 'keyword' },
    // Keywords
    { regex: new RegExp(`^(${keywords.join('|')})\\b`), type: 'keyword' },
    // Function calls
    { regex: /^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/, type: 'function' },
    // Decorators
    { regex: /^(@[a-zA-Z_$][a-zA-Z0-9_$]*)/, type: 'decorator' },
    // Properties after dot
    { regex: /^(\.[a-zA-Z_$][a-zA-Z0-9_$]*)/, type: 'property' },
    // Operators
    { regex: /^([=><!&|+\-*/%^~?:]+)/, type: 'operator' },
    // Punctuation
    { regex: /^([{}()[\],;])/, type: 'punctuation' },
    // Identifiers
    { regex: /^([a-zA-Z_$][a-zA-Z0-9_$]*)/, type: 'variable' },
    // Whitespace
    { regex: /^(\s+)/, type: 'plain' },
    // Any other character
    { regex: /^(.)/, type: 'plain' },
  ];

  while (remaining.length > 0) {
    let matched = false;
    for (const { regex, type } of patterns) {
      const match = remaining.match(regex);
      if (match) {
        tokens.push({ text: match[1], type });
        remaining = remaining.slice(match[1].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      tokens.push({ text: remaining[0], type: 'plain' });
      remaining = remaining.slice(1);
    }
  }

  return tokens;
};

const tokenizeJSON = (line) => {
  const tokens = [];
  let remaining = line;

  const patterns = [
    { regex: /^("(?:[^"\\]|\\.)*")\s*:/, type: 'property', includeColon: true },
    { regex: /^("(?:[^"\\]|\\.)*")/, type: 'string' },
    { regex: /^(\b\d+\.?\d*\b)/, type: 'number' },
    { regex: /^(true|false|null)\b/, type: 'keyword' },
    { regex: /^([{}[\],])/, type: 'punctuation' },
    { regex: /^(\s+)/, type: 'plain' },
    { regex: /^(.)/, type: 'plain' },
  ];

  while (remaining.length > 0) {
    let matched = false;

    // Check for property key (string followed by colon)
    const propMatch = remaining.match(/^("(?:[^"\\]|\\.)*")(\s*:)/);
    if (propMatch) {
      tokens.push({ text: propMatch[1], type: 'property' });
      tokens.push({ text: propMatch[2], type: 'plain' });
      remaining = remaining.slice(propMatch[0].length);
      matched = true;
    }

    if (!matched) {
      for (const { regex, type } of patterns) {
        const match = remaining.match(regex);
        if (match) {
          tokens.push({ text: match[1], type });
          remaining = remaining.slice(match[1].length);
          matched = true;
          break;
        }
      }
    }
    if (!matched) {
      tokens.push({ text: remaining[0], type: 'plain' });
      remaining = remaining.slice(1);
    }
  }

  return tokens;
};

const tokenizeMarkdown = (line) => {
  const trimmed = line.trimStart();

  if (trimmed.startsWith('# ') || trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
    return [{ text: line, type: 'keyword' }];
  }
  if (trimmed.startsWith('```')) {
    return [{ text: line, type: 'string' }];
  }
  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
    return [
      { text: line.substring(0, line.indexOf(trimmed[0]) + 2), type: 'keyword' },
      { text: line.substring(line.indexOf(trimmed[0]) + 2), type: 'plain' },
    ];
  }
  if (trimmed.startsWith('> ')) {
    return [{ text: line, type: 'comment' }];
  }
  if (trimmed.startsWith('`') && trimmed.endsWith('`')) {
    return [{ text: line, type: 'string' }];
  }

  // Handle inline code, bold, italic
  const tokens = [];
  let remaining = line;
  const patterns = [
    { regex: /^(`[^`]+`)/, type: 'string' },
    { regex: /^(\*\*[^*]+\*\*)/, type: 'keyword' },
    { regex: /^(\*[^*]+\*)/, type: 'variable' },
    { regex: /^(\[[^\]]+\]\([^)]+\))/, type: 'link' },
    { regex: /^([^`*[\]]+)/, type: 'plain' },
    { regex: /^(.)/, type: 'plain' },
  ];

  while (remaining.length > 0) {
    let matched = false;
    for (const { regex, type } of patterns) {
      const match = remaining.match(regex);
      if (match) {
        tokens.push({ text: match[1], type });
        remaining = remaining.slice(match[1].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      tokens.push({ text: remaining[0], type: 'plain' });
      remaining = remaining.slice(1);
    }
  }

  return tokens;
};

const TOKEN_COLORS = {
  keyword: colors.keyword,
  string: colors.string,
  comment: colors.comment,
  function: colors.function,
  variable: colors.variable,
  type: colors.type,
  number: colors.number,
  operator: colors.operator,
  punctuation: colors.punctuation,
  property: colors.property,
  parameter: colors.parameter,
  decorator: colors.decorator,
  constant: colors.constant,
  plain: colors.foreground,
  link: colors.link,
};

const CodeLine = React.memo(({ tokens, lineNumber, isActive }) => {
  return (
    <View style={[styles.codeLine, isActive && styles.activeLine]}>
      <Text style={styles.lineNumber}>{lineNumber}</Text>
      <View style={styles.lineContent}>
        {tokens.map((token, i) => (
          <Text
            key={i}
            style={[
              styles.token,
              { color: TOKEN_COLORS[token.type] || colors.foreground },
            ]}
          >
            {token.text}
          </Text>
        ))}
      </View>
    </View>
  );
});

const WelcomeScreen = () => (
  <View style={styles.welcomeContainer}>
    <View style={styles.welcomeContent}>
      <Text style={styles.welcomeLogo}>{'</>'}</Text>
      <Text style={styles.welcomeTitle}>VS Code Android</Text>
      <Text style={styles.welcomeSubtitle}>
        Code. Anywhere. Anytime.
      </Text>

      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeSectionTitle}>Start</Text>
        <TouchableOpacity style={styles.welcomeItem}>
          <Ionicons name="document-outline" size={16} color={colors.link} />
          <Text style={styles.welcomeItemText}>New File</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.welcomeItem}>
          <Ionicons name="folder-open-outline" size={16} color={colors.link} />
          <Text style={styles.welcomeItemText}>Open Folder...</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.welcomeItem}>
          <Ionicons name="git-branch-outline" size={16} color={colors.link} />
          <Text style={styles.welcomeItemText}>Clone Git Repository...</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeSectionTitle}>Recent</Text>
        <Text style={styles.welcomeRecentItem}>my-project</Text>
        <Text style={styles.welcomeRecentItem}>react-native-app</Text>
        <Text style={styles.welcomeRecentItem}>portfolio-website</Text>
      </View>
    </View>
  </View>
);

const CodeEditor = ({ file, onContentChange }) => {
  const [activeLine, setActiveLine] = useState(0);
  const scrollRef = useRef(null);

  if (!file) {
    return <WelcomeScreen />;
  }

  const lines = (file.content || '').split('\n');
  const tokenizedLines = lines.map((line) =>
    tokenizeLine(line, file.language || 'text')
  );

  const lineCount = lines.length;
  const lineNumberWidth = Math.max(String(lineCount).length * 9 + 16, 40);

  return (
    <View style={styles.editorContainer}>
      {/* Breadcrumb */}
      <View style={styles.breadcrumb}>
        <Text style={styles.breadcrumbText}>my-project</Text>
        <Ionicons name="chevron-forward" size={12} color={colors.breadcrumbText} />
        <Text style={styles.breadcrumbText}>src</Text>
        <Ionicons name="chevron-forward" size={12} color={colors.breadcrumbText} />
        <Text style={[styles.breadcrumbText, styles.breadcrumbActive]}>
          {file.name}
        </Text>
      </View>

      {/* Editor with line numbers */}
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        horizontal={false}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View>
            {tokenizedLines.map((tokens, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={1}
                onPress={() => setActiveLine(idx)}
              >
                <CodeLine
                  tokens={tokens}
                  lineNumber={idx + 1}
                  isActive={activeLine === idx}
                />
              </TouchableOpacity>
            ))}
            {/* Empty lines for scrolling */}
            <View style={{ height: 200 }} />
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  editorContainer: {
    flex: 1,
    backgroundColor: colors.editorBackground,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.breadcrumb,
    borderBottomWidth: 1,
    borderBottomColor: colors.editorGroupBorder,
  },
  breadcrumbText: {
    color: colors.breadcrumbText,
    fontSize: 12,
    marginHorizontal: 2,
  },
  breadcrumbActive: {
    color: colors.foreground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  codeLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 20,
  },
  activeLine: {
    backgroundColor: colors.currentLine,
  },
  lineNumber: {
    width: 40,
    color: colors.editorLineNumber,
    fontSize: 13,
    fontFamily: fontFamily.mono,
    textAlign: 'right',
    paddingRight: 16,
    lineHeight: 20,
    userSelect: 'none',
  },
  lineContent: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingLeft: 8,
    flex: 1,
    flexShrink: 0,
  },
  token: {
    fontSize: 13,
    fontFamily: fontFamily.mono,
    lineHeight: 20,
  },

  // Welcome screen
  welcomeContainer: {
    flex: 1,
    backgroundColor: colors.editorBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeContent: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 32,
  },
  welcomeLogo: {
    fontSize: 48,
    color: colors.link,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: fontFamily.mono,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.foreground,
    textAlign: 'center',
    marginTop: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.dimForeground,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 32,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeSectionTitle: {
    color: colors.foreground,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.editorGroupBorder,
    paddingBottom: 4,
  },
  welcomeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  welcomeItemText: {
    color: colors.link,
    fontSize: 14,
    marginLeft: 8,
  },
  welcomeRecentItem: {
    color: colors.foreground,
    fontSize: 13,
    paddingVertical: 4,
    paddingLeft: 8,
  },
});

export default CodeEditor;
