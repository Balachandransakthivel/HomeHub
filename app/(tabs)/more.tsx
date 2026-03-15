import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useHome } from '@/hooks/useHome';
import { theme } from '@/constants/theme';
import { StatCard } from '@/components/ui/StatCard';
import { RoleBadge } from '@/components/ui/Rolebadges';
import { useAlert } from '@/template';
import { EmergencyContact } from '@/types';

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();
  const { user, inventory, maintenance, emergencyContacts, addEmergencyContact, deleteEmergencyContact, logout } = useHome();
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: '',
  });

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      showAlert('Missing Information', 'Please fill name and phone number');
      return;
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      name: newContact.name,
      phone: newContact.phone,
      relationship: newContact.relationship,
    };

    addEmergencyContact(contact);
    setContactModalVisible(false);
    setNewContact({ name: '', phone: '', relationship: '' });
  };

  const handleLogout = () => {
    showAlert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.section}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: user?.avatarColor }]}>
              <Text style={styles.avatarText}>
                {user?.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>
            <RoleBadge role={user?.role || 'family'} />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Home</Text>
          <StatCard
            icon="inventory"
            label="Inventory Items"
            value={inventory.length}
            color={theme.colors.primary}
          />
          <StatCard
            icon="build"
            label="Maintenance Records"
            value={maintenance.length}
            color={theme.colors.secondary}
          />
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            <Pressable
              style={styles.iconButton}
              onPress={() => setContactModalVisible(true)}
            >
              <MaterialIcons name="add" size={24} color={theme.colors.primary} />
            </Pressable>
          </View>

          {emergencyContacts.map(contact => (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.contactIcon}>
                <MaterialIcons name="person" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
                {contact.relationship && (
                  <Text style={styles.contactRelation}>{contact.relationship}</Text>
                )}
              </View>
              <Pressable
                onPress={() =>
                  showAlert('Delete Contact', `Remove ${contact.name}?`, [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => deleteEmergencyContact(contact.id),
                    },
                  ])
                }
              >
                <MaterialIcons name="delete" size={24} color={theme.colors.danger} />
              </Pressable>
            </View>
          ))}

          {emergencyContacts.length === 0 && (
            <View style={styles.emptyContacts}>
              <MaterialIcons name="contacts" size={48} color={theme.colors.textTertiary} />
              <Text style={styles.emptyText}>No emergency contacts yet</Text>
            </View>
          )}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <Pressable style={styles.menuItem} onPress={() => router.push('/voice-assistant')}>
            <MaterialIcons name="mic" size={24} color={theme.colors.text} />
            <Text style={styles.menuText}>Voice Assistant</Text>
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.textTertiary} />
          </Pressable>

          <Pressable style={styles.menuItem}>
            <MaterialIcons name="notifications" size={24} color={theme.colors.text} />
            <Text style={styles.menuText}>Notifications</Text>
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.textTertiary} />
          </Pressable>

          <Pressable style={styles.menuItem}>
            <MaterialIcons name="lock" size={24} color={theme.colors.text} />
            <Text style={styles.menuText}>Privacy</Text>
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.textTertiary} />
          </Pressable>

          <Pressable style={styles.menuItem}>
            <MaterialIcons name="help" size={24} color={theme.colors.text} />
            <Text style={styles.menuText}>Help & Support</Text>
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.textTertiary} />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color={theme.colors.danger} />
            <Text style={[styles.menuText, { color: theme.colors.danger }]}>Logout</Text>
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.danger} />
          </Pressable>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Add Contact Modal */}
      <Modal visible={contactModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Emergency Contact</Text>
              <Pressable onPress={() => setContactModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={theme.colors.text} />
              </Pressable>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newContact.name}
              onChangeText={text => setNewContact({ ...newContact, name: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={newContact.phone}
              onChangeText={text => setNewContact({ ...newContact, phone: text })}
              keyboardType="phone-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="Relationship (optional)"
              value={newContact.relationship}
              onChangeText={text => setNewContact({ ...newContact, relationship: text })}
            />

            <Pressable style={styles.submitButton} onPress={handleAddContact}>
              <Text style={styles.submitButtonText}>Add Contact</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  section: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  iconButton: {
    padding: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.md,
    ...theme.shadows.sm,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${theme.colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  contactRelation: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textTertiary,
  },
  emptyContacts: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.md,
    ...theme.shadows.sm,
  },
  menuText: {
    flex: 1,
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  bottomPadding: {
    height: theme.spacing.xxl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.base,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
  },
});
