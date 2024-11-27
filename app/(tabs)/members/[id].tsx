import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Member } from '@/types/member';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function MemberDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMemberDetails();
  }, [id]);

  const fetchMemberDetails = async () => {
    try {
      const response = await fetch(`http://0.0.0.0:8000/api/v1/people/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMember(data);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.container}>
          <ThemedText>Loading...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (error || !member) {
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
          title: `${member.first_name} ${member.last_name}`,
          headerShown: true,
        }}
      />
      <ThemedView style={styles.container}>
        <ThemedView style={styles.detailCard}>
          <ThemedText type="subtitle">Contact Information</ThemedText>
          <ThemedText>Email: {member.email}</ThemedText>
          {member.mobile && <ThemedText>Mobile: {member.mobile}</ThemedText>}

          <ThemedText type="subtitle" style={styles.sectionTitle}>Address</ThemedText>
          <ThemedText>{member.street}</ThemedText>
          <ThemedText>{`${member.zip_code} ${member.city}`}</ThemedText>

          <ThemedText type="subtitle" style={styles.sectionTitle}>Roles</ThemedText>
          <ThemedView style={styles.rolesContainer}>
            {member.person_roles.map((role) => (
              <ThemedText key={role.id} style={styles.roleTag}>
                {role.type}
              </ThemedText>
            ))}
          </ThemedView>
        </ThemedView>
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
  detailCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    gap: 8,
  },
  sectionTitle: {
    marginTop: 16,
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleTag: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
  },
});