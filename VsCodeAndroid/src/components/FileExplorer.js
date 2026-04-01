import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, fontFamily } from '../theme/vsCodeTheme';
import { sampleFiles } from '../data/sampleFiles';

const FILE_ICON_COLORS = {
  javascript: '#f7df1e',
  react: '#61dafb',
  typescript: '#3178c6',
  json: '#f7b731',
  markdown: '#ffffff',
  css: '#2965f1',
  html: '#e34f26',
  python: '#3572A5',
  ruby: '#cc342d',
  go: '#00add8',
  rust: '#dea584',
  java: '#b07219',
  kotlin: '#7f52ff',
  swift: '#fa7343',
  shell: '#89e051',
  git: '#f05133',
  folder: '#dcb67a',
  file: '#cccccc',
};

const FILE_ICON_NAMES = {
  javascript: 'logo-javascript',
  react: 'logo-react',
  typescript: 'code-slash',
  json: 'document-text',
  markdown: 'document-text',
  css: 'logo-css3',
  html: 'logo-html5',
  python: 'logo-python',
  folder: 'folder',
  file: 'document',
  git: 'logo-github',
};

const getFileIcon = (name, type) => {
  if (type === 'folder') return { icon: 'folder', color: colors.folderIcon };
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
  const type_ = iconMap[ext] || 'file';
  return {
    icon: FILE_ICON_NAMES[type_] || 'document',
    color: FILE_ICON_COLORS[type_] || colors.fileIcon,
  };
};

const FileTreeItem = ({ item, depth = 0, onFileOpen, openFiles, activeFileId }) => {
  const [isOpen, setIsOpen] = useState(item.isOpen || false);
  const isFolder = item.type === 'folder';
  const isActive = activeFileId === item.id;
  const isOpenTab = openFiles.some((f) => f.id === item.id);
  const { icon, color } = getFileIcon(item.name, item.type);

  const handlePress = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      onFileOpen(item);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.treeItem,
          { paddingLeft: 12 + depth * 12 },
          isActive && styles.activeTreeItem,
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {isFolder ? (
          <Ionicons
            name={isOpen ? 'chevron-down' : 'chevron-forward'}
            size={14}
            color={colors.dimForeground}
            style={styles.chevron}
          />
        ) : (
          <View style={styles.chevronPlaceholder} />
        )}

        <Ionicons
          name={isFolder ? (isOpen ? 'folder-open' : 'folder') : icon}
          size={16}
          color={isFolder ? colors.folderIcon : color}
          style={styles.fileIcon}
        />

        <Text
          style={[
            styles.fileName,
            isActive && styles.activeFileName,
            isOpenTab && !isActive && styles.openFileName,
          ]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </TouchableOpacity>

      {isFolder && isOpen && item.children && (
        <View>
          {item.children.map((child) => (
            <FileTreeItem
              key={child.id}
              item={child}
              depth={depth + 1}
              onFileOpen={onFileOpen}
              openFiles={openFiles}
              activeFileId={activeFileId}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const FileExplorer = ({ onFileOpen, openFiles, activeFileId }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>EXPLORER</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="add" size={16} color={colors.dimForeground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="folder-open-outline" size={16} color={colors.dimForeground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="refresh-outline" size={16} color={colors.dimForeground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="ellipsis-horizontal" size={16} color={colors.dimForeground} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Open Editors section */}
      <View style={styles.sectionHeader}>
        <Ionicons name="chevron-down" size={12} color={colors.dimForeground} />
        <Text style={styles.sectionTitle}>OPEN EDITORS</Text>
      </View>

      {openFiles.length > 0 && (
        <View>
          {openFiles.map((file) => (
            <TouchableOpacity
              key={file.id}
              style={[
                styles.openEditorItem,
                file.id === activeFileId && styles.activeTreeItem,
              ]}
              onPress={() => onFileOpen(file)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={getFileIcon(file.name, file.type).icon}
                size={14}
                color={getFileIcon(file.name, file.type).color}
                style={styles.fileIcon}
              />
              <Text
                style={[
                  styles.openEditorName,
                  file.id === activeFileId && styles.activeFileName,
                ]}
                numberOfLines={1}
              >
                {file.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Project section */}
      <View style={styles.sectionHeader}>
        <Ionicons name="chevron-down" size={12} color={colors.dimForeground} />
        <Text style={styles.sectionTitle}>MY-PROJECT</Text>
        <View style={styles.sectionActions}>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="document-outline" size={14} color={colors.dimForeground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="folder-outline" size={14} color={colors.dimForeground} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.fileTree} showsVerticalScrollIndicator={false}>
        {sampleFiles.children?.map((item) => (
          <FileTreeItem
            key={item.id}
            item={item}
            depth={0}
            onFileOpen={onFileOpen}
            openFiles={openFiles}
            activeFileId={activeFileId}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.sideBar,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.sideBarHeader,
  },
  headerText: {
    color: colors.dimForeground,
    fontSize: fontSize.small,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBtn: {
    padding: 4,
    marginLeft: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  sectionTitle: {
    color: colors.dimForeground,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginLeft: 4,
    flex: 1,
  },
  sectionActions: {
    flexDirection: 'row',
  },
  fileTree: {
    flex: 1,
  },
  treeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingRight: 8,
  },
  activeTreeItem: {
    backgroundColor: colors.fileSelected,
  },
  chevron: {
    marginRight: 2,
    width: 14,
  },
  chevronPlaceholder: {
    width: 14,
    marginRight: 2,
  },
  fileIcon: {
    marginRight: 6,
  },
  fileName: {
    color: colors.foreground,
    fontSize: 13,
    flex: 1,
  },
  activeFileName: {
    color: colors.activeForeground,
  },
  openFileName: {
    color: colors.foreground,
  },
  openEditorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 16,
  },
  openEditorName: {
    color: colors.foreground,
    fontSize: 12,
    flex: 1,
  },
});

export default FileExplorer;
