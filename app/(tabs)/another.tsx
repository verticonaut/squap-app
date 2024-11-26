import { StyleSheet, FlatList } from 'react-native';
import { useEffect, useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface PersonRole {
  id: number;
  type: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface Member {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string | null;
  date_of_birth: string;
  gender_code: string;
  street: string;
  city: string;
  zip_code: string;
  created_at: string;
  updated_at: string;
  person_roles: PersonRole[];
}

export default function AnotherScreen() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Error: {error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Members List</ThemedText>
      <FlatList
        data={members}
        renderItem={renderMemberItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContainer: {
    gap: 16,
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