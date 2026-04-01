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
import { colors, fontSize } from '../theme/vsCodeTheme';

const SearchPanel = ({ files }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  const handleSearch = (text) => {
    setQuery(text);
    if (!text.trim()) {
      setResults([]);
      return;
    }

    const searchResults = [];
    const searchFn = (node) => {
      if (node.type === 'file' && node.content) {
        const lines = node.content.split('\n');
        const matches = [];
        lines.forEach((line, idx) => {
          let searchText = caseSensitive ? text : text.toLowerCase();
          let lineText = caseSensitive ? line : line.toLowerCase();
          if (lineText.includes(searchText)) {
            matches.push({
              lineNumber: idx + 1,
              lineContent: line,
              matchStart: lineText.indexOf(searchText),
              matchLength: searchText.length,
            });
          }
        });
        if (matches.length > 0) {
          searchResults.push({
            file: node,
            matches,
          });
        }
      }
      if (node.children) {
        node.children.forEach(searchFn);
      }
    };

    if (files) {
      searchFn(files);
    }
    setResults(searchResults);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SEARCH</Text>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={14} color={colors.dimForeground} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor={colors.dimForeground}
          value={query}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={styles.searchOptions}>
          <TouchableOpacity
            style={[styles.optionBtn, caseSensitive && styles.optionActive]}
            onPress={() => setCaseSensitive(!caseSensitive)}
          >
            <Text style={styles.optionText}>Aa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionBtn, wholeWord && styles.optionActive]}
            onPress={() => setWholeWord(!wholeWord)}
          >
            <Text style={styles.optionText}>W</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionBtn, useRegex && styles.optionActive]}
            onPress={() => setUseRegex(!useRegex)}
          >
            <Text style={styles.optionText}>.*</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.results}>
        {query.length > 0 && results.length === 0 && (
          <Text style={styles.noResults}>No results found.</Text>
        )}
        {results.map((result, idx) => (
          <View key={idx} style={styles.resultFile}>
            <View style={styles.resultFileHeader}>
              <Ionicons name="document" size={14} color={colors.fileIcon} />
              <Text style={styles.resultFileName}>{result.file.name}</Text>
              <View style={styles.matchCount}>
                <Text style={styles.matchCountText}>{result.matches.length}</Text>
              </View>
            </View>
            {result.matches.map((match, midx) => (
              <TouchableOpacity key={midx} style={styles.matchItem}>
                <Text style={styles.matchLineNum}>{match.lineNumber}</Text>
                <Text style={styles.matchLine} numberOfLines={1}>
                  {match.lineContent.trim()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
    backgroundColor: colors.editorBackground,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.editorGroupBorder,
    paddingLeft: 8,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    color: colors.foreground,
    fontSize: 13,
    paddingVertical: 6,
  },
  searchOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 4,
  },
  optionBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginLeft: 2,
  },
  optionActive: {
    backgroundColor: colors.buttonBackground,
  },
  optionText: {
    color: colors.dimForeground,
    fontSize: 11,
    fontWeight: '600',
  },
  results: {
    flex: 1,
  },
  noResults: {
    color: colors.dimForeground,
    fontSize: 13,
    padding: 12,
    textAlign: 'center',
  },
  resultFile: {
    marginBottom: 8,
  },
  resultFileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.sideBarHeader,
  },
  resultFileName: {
    color: colors.foreground,
    fontSize: 13,
    flex: 1,
    marginLeft: 6,
  },
  matchCount: {
    backgroundColor: colors.buttonBackground,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  matchCountText: {
    color: colors.statusBarText,
    fontSize: 11,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 12,
  },
  matchLineNum: {
    color: colors.dimForeground,
    fontSize: 11,
    width: 30,
    fontFamily: 'monospace',
  },
  matchLine: {
    color: colors.foreground,
    fontSize: 12,
    flex: 1,
    fontFamily: 'monospace',
  },
});

export default SearchPanel;
