import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/vsCodeTheme';

const ACTIVITY_ICONS = [
  { id: 'explorer', icon: 'copy-outline', activeIcon: 'copy', label: 'Explorer' },
  { id: 'search', icon: 'search-outline', activeIcon: 'search', label: 'Search' },
  { id: 'git', icon: 'git-branch-outline', activeIcon: 'git-branch', label: 'Source Control' },
  { id: 'debug', icon: 'play-circle-outline', activeIcon: 'play-circle', label: 'Run & Debug' },
  { id: 'extensions', icon: 'puzzle-outline', activeIcon: 'puzzle', label: 'Extensions' },
];

const BOTTOM_ICONS = [
  { id: 'account', icon: 'person-circle-outline', label: 'Account' },
  { id: 'settings', icon: 'settings-outline', label: 'Settings' },
];

const ActivityBar = ({ activePanel, onPanelChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topIcons}>
        {ACTIVITY_ICONS.map((item) => {
          const isActive = activePanel === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.iconButton, isActive && styles.activeIconButton]}
              onPress={() => onPanelChange(isActive ? null : item.id)}
              activeOpacity={0.7}
            >
              {isActive && <View style={styles.activeBorder} />}
              <Ionicons
                name={isActive ? item.activeIcon : item.icon}
                size={24}
                color={isActive ? colors.activityBarActiveIcon : colors.activityBarIcon}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.bottomIcons}>
        {BOTTOM_ICONS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={colors.activityBarIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 48,
    backgroundColor: colors.activityBar,
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRightWidth: 1,
    borderRightColor: colors.activityBarBorder,
  },
  topIcons: {
    flexDirection: 'column',
  },
  bottomIcons: {
    flexDirection: 'column',
    paddingBottom: 8,
  },
  iconButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeIconButton: {
    opacity: 1,
  },
  activeBorder: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 2,
    backgroundColor: colors.activityBarActiveBorder,
  },
});

export default ActivityBar;
