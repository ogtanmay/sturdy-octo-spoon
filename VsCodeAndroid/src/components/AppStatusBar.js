import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../theme/vsCodeTheme';

const AppStatusBar = ({ activeFile, cursorLine, cursorCol }) => {
  return (
    <View style={styles.container}>
      {/* Left side */}
      <View style={styles.leftSection}>
        <TouchableOpacity style={styles.statusItem}>
          <Ionicons name="git-branch-outline" size={13} color={colors.statusBarText} />
          <Text style={styles.statusText}> main</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statusItem}>
          <Ionicons name="sync-outline" size={13} color={colors.statusBarText} />
          <Text style={styles.statusText}> 0 ↓ 0 ↑</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statusItem}>
          <Ionicons name="warning-outline" size={13} color={colors.statusBarText} />
          <Text style={styles.statusText}> 0</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statusItem}>
          <Ionicons name="alert-circle-outline" size={13} color={colors.statusBarText} />
          <Text style={styles.statusText}> 0</Text>
        </TouchableOpacity>
      </View>

      {/* Right side */}
      <View style={styles.rightSection}>
        {activeFile && (
          <>
            <TouchableOpacity style={styles.statusItem}>
              <Text style={styles.statusText}>
                Ln {cursorLine || 1}, Col {cursorCol || 1}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statusItem}>
              <Text style={styles.statusText}>Spaces: 2</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statusItem}>
              <Text style={styles.statusText}>UTF-8</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statusItem}>
              <Text style={styles.statusText}>CRLF</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statusItem}>
              <Text style={styles.statusText}>
                {getLanguageLabel(activeFile?.language)}
              </Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.statusItem}>
          <Ionicons name="bell-outline" size={13} color={colors.statusBarText} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getLanguageLabel = (language) => {
  const labels = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    json: 'JSON',
    markdown: 'Markdown',
    css: 'CSS',
    html: 'HTML',
    python: 'Python',
    text: 'Plain Text',
  };
  return labels[language] || 'Plain Text';
};

const styles = StyleSheet.create({
  container: {
    height: 22,
    backgroundColor: colors.statusBar,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusText: {
    color: colors.statusBarText,
    fontSize: 11,
  },
});

export default AppStatusBar;
