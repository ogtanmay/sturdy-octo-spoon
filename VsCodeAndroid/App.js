import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ActivityBar from './src/components/ActivityBar';
import FileExplorer from './src/components/FileExplorer';
import SearchPanel from './src/components/SearchPanel';
import TabBar from './src/components/TabBar';
import CodeEditor from './src/components/CodeEditor';
import AppStatusBar from './src/components/AppStatusBar';
import Terminal from './src/components/Terminal';
import { colors } from './src/theme/vsCodeTheme';
import { sampleFiles } from './src/data/sampleFiles';

export default function App() {
  const [activePanel, setActivePanel] = useState('explorer');
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFileId, setActiveFileId] = useState(null);
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [cursorLine, setCursorLine] = useState(1);
  const [cursorCol, setCursorCol] = useState(1);

  const activeFile = openFiles.find((f) => f.id === activeFileId) || null;

  const handleFileOpen = useCallback((file) => {
    if (!openFiles.find((f) => f.id === file.id)) {
      setOpenFiles((prev) => [...prev, file]);
    }
    setActiveFileId(file.id);
  }, [openFiles]);

  const handleTabClose = useCallback((fileId) => {
    setOpenFiles((prev) => {
      const newFiles = prev.filter((f) => f.id !== fileId);
      if (activeFileId === fileId) {
        const closedIndex = prev.findIndex((f) => f.id === fileId);
        const newActive = newFiles[Math.min(closedIndex, newFiles.length - 1)];
        setActiveFileId(newActive?.id || null);
      }
      return newFiles;
    });
  }, [activeFileId]);

  const handleTabSelect = useCallback((file) => {
    setActiveFileId(file.id);
  }, []);

  const handlePanelChange = useCallback((panelId) => {
    setActivePanel(panelId);
    if (panelId) {
      setIsSidebarVisible(true);
    } else {
      setIsSidebarVisible(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.titleBar} barStyle="light-content" />

      {/* Title Bar */}
      <View style={styles.titleBar}>
        <TouchableOpacity
          style={styles.titleBarBtn}
          onPress={() => setIsSidebarVisible(!isSidebarVisible)}
        >
          <Ionicons name="menu" size={20} color={colors.titleBarText} />
        </TouchableOpacity>
        <Text style={styles.titleBarText} numberOfLines={1}>
          {activeFile ? activeFile.name : 'VS Code Android'}
        </Text>
        <View style={styles.titleBarActions}>
          <TouchableOpacity
            style={styles.titleBarBtn}
            onPress={() => setIsTerminalVisible(!isTerminalVisible)}
          >
            <Ionicons
              name="terminal-outline"
              size={18}
              color={isTerminalVisible ? colors.activeForeground : colors.titleBarText}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.titleBarBtn}>
            <Ionicons name="ellipsis-vertical" size={18} color={colors.titleBarText} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Layout */}
      <View style={styles.mainLayout}>
        {/* Activity Bar */}
        <ActivityBar
          activePanel={activePanel}
          onPanelChange={handlePanelChange}
        />

        {/* Sidebar */}
        {isSidebarVisible && activePanel && (
          <View style={styles.sidebar}>
            {activePanel === 'explorer' && (
              <FileExplorer
                onFileOpen={handleFileOpen}
                openFiles={openFiles}
                activeFileId={activeFileId}
              />
            )}
            {activePanel === 'search' && (
              <SearchPanel files={sampleFiles} />
            )}
            {activePanel === 'git' && (
              <View style={styles.emptyPanel}>
                <Ionicons name="git-branch-outline" size={48} color={colors.dimForeground} />
                <Text style={styles.emptyPanelText}>Source Control</Text>
                <Text style={styles.emptyPanelSubText}>
                  No changes in working directory.
                </Text>
              </View>
            )}
            {activePanel === 'debug' && (
              <View style={styles.emptyPanel}>
                <Ionicons name="play-circle-outline" size={48} color={colors.dimForeground} />
                <Text style={styles.emptyPanelText}>Run and Debug</Text>
                <Text style={styles.emptyPanelSubText}>
                  To customize Run and Debug create a launch.json file.
                </Text>
              </View>
            )}
            {activePanel === 'extensions' && (
              <View style={styles.emptyPanel}>
                <Ionicons name="puzzle-outline" size={48} color={colors.dimForeground} />
                <Text style={styles.emptyPanelText}>Extensions</Text>
                <Text style={styles.emptyPanelSubText}>
                  Search for extensions in the Marketplace.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Editor Area */}
        <View style={styles.editorArea}>
          <TabBar
            openFiles={openFiles}
            activeFileId={activeFileId}
            onTabSelect={handleTabSelect}
            onTabClose={handleTabClose}
          />
          <CodeEditor
            file={activeFile}
            onCursorChange={(line, col) => {
              setCursorLine(line);
              setCursorCol(col);
            }}
          />
          <Terminal
            isVisible={isTerminalVisible}
            onClose={() => setIsTerminalVisible(false)}
          />
        </View>
      </View>

      {/* Status Bar */}
      <AppStatusBar
        activeFile={activeFile}
        cursorLine={cursorLine}
        cursorCol={cursorCol}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.titleBar,
  },
  titleBar: {
    height: 44,
    backgroundColor: colors.titleBar,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.menuBorder,
  },
  titleBarBtn: {
    padding: 10,
  },
  titleBarText: {
    flex: 1,
    color: colors.titleBarText,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  titleBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  sidebar: {
    width: 240,
    borderRightWidth: 1,
    borderRightColor: colors.editorGroupBorder,
    backgroundColor: colors.sideBar,
  },
  editorArea: {
    flex: 1,
    backgroundColor: colors.editorBackground,
    flexDirection: 'column',
  },
  emptyPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyPanelText: {
    color: colors.foreground,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyPanelSubText: {
    color: colors.dimForeground,
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
});
