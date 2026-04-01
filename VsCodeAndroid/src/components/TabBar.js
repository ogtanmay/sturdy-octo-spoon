import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../theme/vsCodeTheme';

const FILE_ICON_COLORS = {
  js: '#f7df1e',
  jsx: '#61dafb',
  ts: '#3178c6',
  tsx: '#3178c6',
  json: '#f7b731',
  md: '#ffffff',
  css: '#2965f1',
  html: '#e34f26',
  py: '#3572A5',
  gitignore: '#f05133',
};

const getTabIconColor = (name) => {
  const ext = name.split('.').pop()?.toLowerCase();
  return FILE_ICON_COLORS[ext] || colors.fileIcon;
};

const TabBar = ({ openFiles, activeFileId, onTabSelect, onTabClose }) => {
  const scrollRef = useRef(null);

  if (openFiles.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabList}
        contentContainerStyle={styles.tabListContent}
      >
        {openFiles.map((file) => {
          const isActive = file.id === activeFileId;
          return (
            <TouchableOpacity
              key={file.id}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => onTabSelect(file)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.tabColorDot,
                  { backgroundColor: getTabIconColor(file.name) },
                ]}
              />
              <Text
                style={[styles.tabName, isActive && styles.activeTabName]}
                numberOfLines={1}
              >
                {file.name}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => onTabClose(file.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name="close"
                  size={14}
                  color={isActive ? colors.foreground : colors.dimForeground}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 35,
    backgroundColor: colors.tabInactiveBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.tabBorder,
  },
  tabList: {
    flex: 1,
  },
  tabListContent: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.tabInactiveBackground,
    borderRightWidth: 1,
    borderRightColor: colors.tabBorder,
    minWidth: 100,
    maxWidth: 200,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: colors.tabActiveBackground,
    borderTopWidth: 1,
    borderTopColor: colors.tabActiveBorder,
  },
  tabColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  tabName: {
    color: colors.dimForeground,
    fontSize: 13,
    flex: 1,
  },
  activeTabName: {
    color: colors.activeForeground,
  },
  closeButton: {
    marginLeft: 6,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
});

export default TabBar;
