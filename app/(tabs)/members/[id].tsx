import ENV from '@/config/env';

export const unstable_settings = {
  initialRouteName: 'index',
};

import { useEffect, useState } from 'react';
import { StyleSheet, Modal, TouchableOpacity, Pressable, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Member } from '@/types/member';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MemberAvatar } from '@/components/MemberAvatar';

export default function MemberDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchMemberDetails();
  }, [id]);

  const fetchMemberDetails = async () => {
    try {
      const response = await fetch(`${ENV.API_URL}/people/${id}`);
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

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
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
          title: member ? `${member.first_name} ${member.last_name}` : 'Loading...',
          headerShown: true,
        }}
      />
      <View style={styles.container}>
        <View style={styles.detailCard}>
          <View style={styles.headerSection}>
            <TouchableOpacity onPress={toggleModal}>
              <MemberAvatar member={member} size={60} />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <TouchableOpacity onPress={toggleModal}>
                <ThemedText style={styles.subtitle}>{`${member.first_name} ${member.last_name}`}</ThemedText>
              </TouchableOpacity>
              <ThemedText>{member.email}</ThemedText>
            </View>
          </View>

          <ThemedText style={[styles.subtitle, styles.sectionTitle]}>Contact Information</ThemedText>
          {member.mobile && <ThemedText>Mobile: {member.mobile}</ThemedText>}

          <ThemedText style={[styles.subtitle, styles.sectionTitle]}>Address</ThemedText>
          <ThemedText>{member.street}</ThemedText>
          <ThemedText>{`${member.zip_code} ${member.city}`}</ThemedText>

          <ThemedText style={[styles.subtitle, styles.sectionTitle]}>Roles</ThemedText>
          <View style={styles.rolesContainer}>
            {member.person_roles.map((role) => (
              <ThemedText key={role.id} style={styles.roleTag}>
                {role.type}
              </ThemedText>
            ))}
          </View>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={toggleModal}>
          <Pressable style={styles.modalOverlay} onPress={toggleModal}>
            <ThemedView style={styles.modalContent}>
              <MemberAvatar member={member} size={300} />
              <ThemedText style={styles.modalName}>
                {`${member.first_name} ${member.last_name}`}
              </ThemedText>
            </ThemedView>
          </Pressable>
        </Modal>
      </View>
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
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 16,
  },
  modalName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});