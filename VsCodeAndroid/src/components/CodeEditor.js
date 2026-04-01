import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
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

  const keywords = [
    'import', 'export', 'default', 'from', 'const', 'let', 'var', 'function',
    'return', 'if', 'else', 'for', 'while', 'do', 'break', 'continue',
    'class', 'extends', 'new', 'this', 'super', 'typeof', 'instanceof',
    'try', 'catch', 'finally', 'throw', 'async', 'await', 'of', 'in',
    'null', 'undefined', 'true', 'false', 'switch', 'case', 'void',
    'static', 'get', 'set', 'yield', 'delete',
  ];

  const patterns = [
    { regex: /^(\/\/.*)/, type: 'comment' },
    { regex: /^(\/\*.*?\*\/)/, type: 'comment' },
    { regex: /^(`(?:[^`\\]|\\.)*`)/, type: 'string' },
    { regex: /^("(?:[^"\\]|\\.)*")/, type: 'string' },
    { regex: /^('(?:[^'\\]|\\.)*')/, type: 'string' },
    { regex: /^(\b\d+\.?\d*\b)/, type: 'number' },
    { regex: /^(<\/?[A-Z][a-zA-Z]*)/, type: 'type' },
    { regex: /^(<\/?[a-z][a-zA-Z]*)/, type: 'keyword' },
    { regex: new RegExp(`^(${keywords.join('|')})\\b`), type: 'keyword' },
    { regex: /^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/, type: 'function' },
    { regex: /^(@[a-zA-Z_$][a-zA-Z0-9_$]*)/, type: 'decorator' },
    { regex: /^(\.[a-zA-Z_$][a-zA-Z0-9_$]*)/, type: 'property' },
    { regex: /^([=><!&|+\-*/%^~?:]+)/, type: 'operator' },
    { regex: /^([{}()[\],;])/, type: 'punctuation' },
    { regex: /^([a-zA-Z_$][a-zA-Z0-9_$]*)/, type: 'variable' },
    { regex: /^(\s+)/, type: 'plain' },
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
    { regex: /^("(?:[^"\\]|\\.)*")/, type: 'string' },
    { regex: /^(\b\d+\.?\d*\b)/, type: 'number' },
    { regex: /^(true|false|null)\b/, type: 'keyword' },
    { regex: /^([{}[\],])/, type: 'punctuation' },
    { regex: /^(\s+)/, type: 'plain' },
    { regex: /^(.)/, type: 'plain' },
  ];

  while (remaining.length > 0) {
    let matched = false;

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

const CodeLine = React.memo(({ tokens, lineNumber, isActive }) => (
  <View style={[styles.codeLine, isActive && styles.activeLine]}>
    <Text style={styles.lineNumber}>{lineNumber}</Text>
    <View style={styles.lineContent}>
      {tokens.map((token, i) => (
        <Text
          key={i}
          style={[styles.token, { color: TOKEN_COLORS[token.type] || colors.foreground }]}
        >
          {token.text}
        </Text>
      ))}
    </View>
  </View>
));

const WelcomeScreen = () => (
  <View style={styles.welcomeContainer}>
    <View style={styles.welcomeContent}>
      <Text style={styles.welcomeLogo}>{'</>'}</Text>
      <Text style={styles.welcomeTitle}>VS Code Android</Text>
      <Text style={styles.welcomeSubtitle}>Code. Anywhere. Anytime.</Text>

      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeSectionTitle}>Start</Text>
        <View style={styles.welcomeItem}>
          <Ionicons name="document-outline" size={16} color={colors.link} />
          <Text style={styles.welcomeItemText}>
            New File — tap the + icon in the Explorer
          </Text>
        </View>
        <View style={styles.welcomeItem}>
          <Ionicons name="folder-open-outline" size={16} color={colors.link} />
          <Text style={styles.welcomeItemText}>
            Open File — tap the folder icon in the Explorer
          </Text>
        </View>
      </View>

      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeSectionTitle}>Tips</Text>
        <Text style={styles.welcomeRecentItem}>• Tap ✏️ in a file to start editing</Text>
        <Text style={styles.welcomeRecentItem}>• Tap 💾 in the toolbar to save</Text>
        <Text style={styles.welcomeRecentItem}>• All files are saved on your device</Text>
      </View>
    </View>
  </View>
);

const CodeEditor = ({ file, onContentChange, isDirty }) => {
  const [activeLine, setActiveLine] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Sync edit buffer when a different file is opened
  React.useEffect(() => {
    if (file) {
      setEditText(file.content || '');
      setIsEditing(false);
      setActiveLine(0);
    }
  }, [file?.id]);

  if (!file) {
    return <WelcomeScreen />;
  }

  const lines = (file.content || '').split('\n');
  const tokenizedLines = lines.map((line) =>
    tokenizeLine(line, file.language || 'text')
  );

  const handleStartEdit = () => {
    setEditText(file.content || '');
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleEditChange = (text) => {
    setEditText(text);
    if (onContentChange) {
      onContentChange(text);
    }
  };

  const handleStopEdit = () => {
    setIsEditing(false);
  };

  return (
    <View style={styles.editorContainer}>
      {/* Breadcrumb / toolbar */}
      <View style={styles.breadcrumb}>
        <Text style={styles.breadcrumbActive} numberOfLines={1}>
          {file.name}
        </Text>
        {isDirty && <Text style={styles.dirtyDot}>●</Text>}
        <TouchableOpacity
          style={styles.editToggle}
          onPress={isEditing ? handleStopEdit : handleStartEdit}
        >
          <Ionicons
            name={isEditing ? 'checkmark-outline' : 'create-outline'}
            size={16}
            color={isEditing ? colors.link : colors.dimForeground}
          />
        </TouchableOpacity>
      </View>

      {isEditing ? (
        /* ── Edit mode: plain TextInput ── */
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
            <View style={styles.editRow}>
              {/* Line numbers alongside the TextInput */}
              <View style={styles.lineNumberCol}>
                {editText.split('\n').map((_, idx) => (
                  <Text key={idx} style={styles.lineNumber}>
                    {idx + 1}
                  </Text>
                ))}
              </View>
              <TextInput
                ref={inputRef}
                style={styles.editInput}
                value={editText}
                onChangeText={handleEditChange}
                multiline
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                spellCheck={false}
                scrollEnabled={false}
                textAlignVertical="top"
                cursorColor={colors.link}
                selectionColor={colors.selectionBackground}
                onBlur={handleStopEdit}
              />
            </View>
            <View style={{ height: 200 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        /* ── View mode: syntax-highlighted ── */
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              {tokenizedLines.map((tokens, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={1}
                  onPress={() => {
                    setActiveLine(idx);
                    handleStartEdit();
                  }}
                >
                  <CodeLine
                    tokens={tokens}
                    lineNumber={idx + 1}
                    isActive={activeLine === idx}
                  />
                </TouchableOpacity>
              ))}
              <View style={{ height: 200 }} />
            </View>
          </ScrollView>
        </ScrollView>
      )}
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
  breadcrumbActive: {
    color: colors.foreground,
    fontSize: 12,
    flex: 1,
  },
  dirtyDot: {
    color: colors.link,
    fontSize: 14,
    marginLeft: 4,
    marginRight: 4,
  },
  editToggle: {
    padding: 4,
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

  // Edit mode
  editRow: {
    flexDirection: 'row',
    flex: 1,
  },
  lineNumberCol: {
    width: 40,
    paddingTop: 0,
  },
  editInput: {
    flex: 1,
    color: colors.foreground,
    fontSize: 13,
    fontFamily: fontFamily.mono,
    lineHeight: 20,
    paddingLeft: 8,
    paddingTop: 0,
    paddingBottom: 0,
    margin: 0,
    backgroundColor: colors.editorBackground,
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
    flexShrink: 1,
  },
  welcomeRecentItem: {
    color: colors.foreground,
    fontSize: 13,
    paddingVertical: 4,
    paddingLeft: 8,
  },
});

export default CodeEditor;
