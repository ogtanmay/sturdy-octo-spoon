import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, fontFamily } from '../theme/vsCodeTheme';

const PANEL_TABS = ['TERMINAL', 'PROBLEMS', 'OUTPUT', 'DEBUG CONSOLE'];

const Terminal = ({ isVisible, onClose }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'output', text: 'Welcome to VS Code Android Terminal' },
    { type: 'output', text: 'Type a command to get started...' },
    { type: 'prompt', text: '$ ' },
  ]);
  const [activeTab, setActiveTab] = useState('TERMINAL');
  const scrollRef = useRef(null);

  const handleCommand = () => {
    if (!input.trim()) return;

    const cmd = input.trim();
    const newHistory = [...history];

    // Remove last prompt
    newHistory[newHistory.length - 1] = { type: 'input', text: `$ ${cmd}` };

    // Simulate command output
    const output = simulateCommand(cmd);
    if (output) {
      newHistory.push({ type: 'output', text: output });
    }

    newHistory.push({ type: 'prompt', text: '$ ' });
    setHistory(newHistory);
    setInput('');

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const simulateCommand = (cmd) => {
    const commands = {
      'ls': 'src/  node_modules/  package.json  app.json  README.md',
      'pwd': '/workspace/my-project',
      'node --version': 'v18.19.0',
      'npm --version': '10.2.4',
      'git status': 'On branch main\nnothing to commit, working tree clean',
      'git log --oneline': 'a1b2c3d (HEAD -> main) Initial commit',
      'npm start': '> my-project@1.0.0 start\nStarting Metro Bundler...',
      'clear': null,
      'help': 'Available commands: ls, pwd, node, npm, git, clear',
    };

    if (cmd === 'clear') {
      setTimeout(() => {
        setHistory([{ type: 'prompt', text: '$ ' }]);
      }, 0);
      return null;
    }

    return commands[cmd] || `command not found: ${cmd}`;
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      {/* Panel Tab Bar */}
      <View style={styles.tabBar}>
        {PANEL_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={styles.tabActions}>
          <TouchableOpacity style={styles.tabAction}>
            <Ionicons name="add" size={14} color={colors.dimForeground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabAction}>
            <Ionicons name="chevron-down" size={14} color={colors.dimForeground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabAction}>
            <Ionicons name="chevron-up" size={14} color={colors.dimForeground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabAction} onPress={onClose}>
            <Ionicons name="close" size={14} color={colors.dimForeground} />
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'TERMINAL' && (
        <KeyboardAvoidingView
          style={styles.terminal}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            ref={scrollRef}
            style={styles.output}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              scrollRef.current?.scrollToEnd({ animated: false })
            }
          >
            {history.map((item, idx) => (
              <View key={idx} style={styles.outputLine}>
                {item.type === 'prompt' ? (
                  <View style={styles.promptLine}>
                    <Text style={styles.promptText}>{item.text}</Text>
                    {idx === history.length - 1 && (
                      <TextInput
                        style={styles.input}
                        value={input}
                        onChangeText={setInput}
                        onSubmitEditing={handleCommand}
                        returnKeyType="done"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="off"
                        blurOnSubmit={false}
                        cursorColor={colors.terminalCursor}
                        selectionColor={colors.selectionBackground}
                      />
                    )}
                  </View>
                ) : (
                  <Text
                    style={[
                      styles.outputText,
                      item.type === 'input' && styles.inputText,
                    ]}
                  >
                    {item.text}
                  </Text>
                )}
              </View>
            ))}
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {activeTab === 'PROBLEMS' && (
        <View style={styles.emptyPanel}>
          <Ionicons name="checkmark-circle-outline" size={32} color={colors.dimForeground} />
          <Text style={styles.emptyText}>No problems have been detected in the workspace.</Text>
        </View>
      )}

      {activeTab === 'OUTPUT' && (
        <View style={styles.emptyPanel}>
          <Text style={styles.outputText}>Output will appear here...</Text>
        </View>
      )}

      {activeTab === 'DEBUG CONSOLE' && (
        <View style={styles.emptyPanel}>
          <Text style={styles.emptyText}>Debug console output will appear here.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    backgroundColor: colors.panelBackground,
    borderTopWidth: 1,
    borderTopColor: colors.panelBorder,
  },
  tabBar: {
    height: 35,
    backgroundColor: colors.panelHeader,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.panelBorder,
  },
  tab: {
    paddingHorizontal: 12,
    height: '100%',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'transparent',
  },
  activeTab: {
    backgroundColor: colors.panelBackground,
    borderTopColor: colors.tabActiveBorder,
  },
  tabText: {
    color: colors.dimForeground,
    fontSize: 11,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.foreground,
  },
  tabActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 8,
  },
  tabAction: {
    padding: 6,
  },
  terminal: {
    flex: 1,
    padding: 8,
  },
  output: {
    flex: 1,
  },
  outputLine: {
    marginBottom: 2,
  },
  promptLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promptText: {
    color: colors.terminalGreen,
    fontSize: 13,
    fontFamily: fontFamily.mono,
  },
  outputText: {
    color: colors.terminalForeground,
    fontSize: 13,
    fontFamily: fontFamily.mono,
  },
  inputText: {
    color: colors.terminalForeground,
  },
  input: {
    flex: 1,
    color: colors.terminalForeground,
    fontSize: 13,
    fontFamily: fontFamily.mono,
    padding: 0,
    margin: 0,
  },
  emptyPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  emptyText: {
    color: colors.dimForeground,
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default Terminal;
