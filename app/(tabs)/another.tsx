import { StyleSheet, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { Member } from '@/types/member';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

export default function AnotherScreen() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('http://0.0.0.0:8000/api/v1/people');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMembers(data);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMembers();
    setRefreshing(false);
  };

  const renderMemberItem = ({ item }: { item: Member }) => (
    <ThemedView style={styles.memberCard}>
      <ThemedText type="subtitle">{`${item.first_name} ${item.last_name}`}</ThemedText>
      <ThemedText>{item.email}</ThemedText>
      <ThemedText>{`${item.street}, ${item.zip_code} ${item.city}`}</ThemedText>
      <ThemedView style={styles.rolesContainer}>
        {item.person_roles.map((role) => (
          <ThemedText key={role.id} style={styles.roleTag}>
            {role.type}
          </ThemedText>
        ))}
      </ThemedView>
    </ThemedView>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.container}>
          <ThemedText>Loading...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.container}>
          <ThemedText>Error: {error}</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <Stack.Screen
        options={{
          title: "Members List",
          headerShown: true,
        }}
      />
      <ThemedView style={styles.container}>
        <FlatList
          data={members}
          renderItem={renderMemberItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    gap: 16,
    paddingBottom: 16,
  },
  memberCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    gap: 4,
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  roleTag: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
  },
});