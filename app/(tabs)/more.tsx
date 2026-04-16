import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useHome } from '@/hooks/useHome';
import { theme } from '@/constants/theme';
import { RoleBadge } from '@/components/ui/Rolebadges';
import { useAlert } from '@/template';
import { EmergencyContact } from '@/types';

const MENU_ITEMS = [
  { icon: 'mic' as const, label: 'Voice Assistant', route: '/voice-assistant', color: '#7C3AED' },
  { icon: 'notifications' as const, label: 'Notifications', route: null, color: '#F59E0B' },
  { icon: 'lock' as const, label: 'Privacy', route: null, color: '#0EA5E9' },
  { icon: 'help' as const, label: 'Help & Support', route: null, color: '#10B981' },
];

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();
  const { user, inventory, maintenance, emergencyContacts, addEmergencyContact, deleteEmergencyContact, logout } = useHome();
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });

  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'HH';

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
      { text: 'Logout', style: 'destructive', onPress: () => { logout(); router.replace('/login'); } },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Profile header */}
        <LinearGradient colors={['#12143A', '#7C3AED']} style={styles.profileHeader} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.profileDecor} />
          <LinearGradient colors={['#00C9A7', '#7C3AED']} style={styles.avatar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.avatarText}>{initials}</Text>
          </LinearGradient>
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <View style={styles.badgeRow}>
            <RoleBadge role={user?.role || 'family'} />
          </View>
        </LinearGradient>

        {/* Stats strip */}
        <View style={styles.statsStrip}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{inventory?.length ?? 0}</Text>
            <Text style={styles.statLbl}>Items</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{maintenance.length}</Text>
            <Text style={styles.statLbl}>Maintenance</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{emergencyContacts.length}</Text>
            <Text style={styles.statLbl}>Contacts</Text>
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View style={styles.sectionTitleRow}>
              <LinearGradient colors={['#EF4444', '#F97316']} style={styles.sectionBar} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
              <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            </View>
            <Pressable onPress={() => setContactModalVisible(true)}>
              <LinearGradient colors={['#EF4444', '#F97316']} style={styles.addContactBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <MaterialIcons name="add" size={20} color="#FFF" />
              </LinearGradient>
            </Pressable>
          </View>

          {emergencyContacts.map(contact => (
            <View key={contact.id} style={styles.contactCard}>
              <LinearGradient colors={['#EF4444', '#F97316']} style={styles.contactIcon} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <MaterialIcons name="person" size={20} color="#FFF" />
              </LinearGradient>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
                {contact.relationship ? <Text style={styles.contactRel}>{contact.relationship}</Text> : null}
              </View>
              <Pressable onPress={() => showAlert('Delete Contact', `Remove ${contact.name}?`, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteEmergencyContact(contact.id) },
              ])} hitSlop={8}>
                <MaterialIcons name="delete-outline" size={22} color={theme.colors.danger} />
              </Pressable>
            </View>
          ))}

          {emergencyContacts.length === 0 && (
            <View style={styles.emptyBox}>
              <LinearGradient colors={['#FEE2E2', '#FEF3C7']} style={styles.emptyIconBg}>
                <MaterialIcons name="contacts" size={32} color={theme.colors.danger} />
              </LinearGradient>
              <Text style={styles.emptyText}>No emergency contacts yet</Text>
            </View>
          )}
        </View>

        {/* Settings menu */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <LinearGradient colors={['#00C9A7', '#7C3AED']} style={styles.sectionBar} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
            <Text style={styles.sectionTitle}>Settings</Text>
          </View>

          <View style={styles.menuGroup}>
            {MENU_ITEMS.map((item, idx) => (
              <Pressable
                key={item.label}
                style={[styles.menuItem, idx < MENU_ITEMS.length - 1 && styles.menuItemBorder]}
                onPress={() => item.route ? router.push(item.route as any) : null}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: `${item.color}18` }]}>
                  <MaterialIcons name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={styles.menuText}>{item.label}</Text>
                <MaterialIcons name="chevron-right" size={20} color={theme.colors.textTertiary} />
              </Pressable>
            ))}
          </View>

          {/* Logout */}
          <Pressable onPress={handleLogout}>
            <LinearGradient colors={['#FEE2E2', '#FFF0F0']} style={styles.logoutBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <MaterialIcons name="logout" size={20} color={theme.colors.danger} />
              <Text style={styles.logoutText}>Logout</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Contact Modal */}
      <Modal visible={contactModalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <LinearGradient colors={['#EF4444', '#F97316']} style={styles.modalBar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
            <View style={styles.modalHead}>
              <Text style={styles.modalTitle}>Add Emergency Contact</Text>
              <Pressable onPress={() => setContactModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={theme.colors.textSecondary} />
              </Pressable>
            </View>
            <TextInput style={styles.inp} placeholder="Full Name" placeholderTextColor={theme.colors.textTertiary} value={newContact.name} onChangeText={t => setNewContact({ ...newContact, name: t })} />
            <TextInput style={styles.inp} placeholder="Phone Number" placeholderTextColor={theme.colors.textTertiary} value={newContact.phone} onChangeText={t => setNewContact({ ...newContact, phone: t })} keyboardType="phone-pad" />
            <TextInput style={styles.inp} placeholder="Relationship (e.g. Mother)" placeholderTextColor={theme.colors.textTertiary} value={newContact.relationship} onChangeText={t => setNewContact({ ...newContact, relationship: t })} />
            <Pressable onPress={handleAddContact}>
              <LinearGradient colors={['#EF4444', '#F97316']} style={styles.submitBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.submitText}>Add Contact</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flex: 1 },

  profileHeader: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: theme.spacing.lg,
    gap: 6,
    overflow: 'hidden',
  },
  profileDecor: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(0,201,167,0.1)', top: -80, right: -60,
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#00C9A7', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  avatarText: { color: '#FFF', fontSize: theme.fontSize.xxl, fontWeight: theme.fontWeight.heavy },
  profileName: { fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: '#FFF' },
  profileEmail: { fontSize: theme.fontSize.sm, color: 'rgba(255,255,255,0.65)' },
  badgeRow: { marginTop: 6 },

  statsStrip: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginTop: -20,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.md,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
  statLbl: { fontSize: theme.fontSize.xs, color: theme.colors.textSecondary, marginTop: 2 },
  statDiv: { width: 1, backgroundColor: theme.colors.border, marginVertical: 4 },

  section: { padding: theme.spacing.lg, gap: theme.spacing.md },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionBar: { width: 4, height: 20, borderRadius: 2 },
  sectionTitle: { fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
  addContactBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', ...theme.shadows.sm },

  contactCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  contactIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  contactInfo: { flex: 1 },
  contactName: { fontSize: theme.fontSize.base, fontWeight: theme.fontWeight.semibold, color: theme.colors.text },
  contactPhone: { fontSize: theme.fontSize.sm, color: theme.colors.textSecondary },
  contactRel: { fontSize: theme.fontSize.xs, color: theme.colors.textTertiary },

  emptyBox: { alignItems: 'center', padding: theme.spacing.xl, gap: theme.spacing.md },
  emptyIconBg: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: theme.fontSize.sm, color: theme.colors.textSecondary },

  menuGroup: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md, gap: 12 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  menuIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuText: { flex: 1, fontSize: theme.fontSize.base, fontWeight: theme.fontWeight.medium, color: theme.colors.text },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: 14, borderRadius: theme.borderRadius.lg,
  },
  logoutText: { fontSize: theme.fontSize.base, fontWeight: theme.fontWeight.bold, color: theme.colors.danger },

  overlay: { flex: 1, backgroundColor: 'rgba(18,20,58,0.6)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: theme.colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: theme.spacing.lg, gap: theme.spacing.md, paddingBottom: 32 },
  modalBar: { height: 4, width: 40, borderRadius: 2, alignSelf: 'center', marginBottom: 8 },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
  inp: { backgroundColor: theme.colors.surfaceTinted, borderWidth: 1.5, borderColor: theme.colors.border, borderRadius: theme.borderRadius.lg, padding: theme.spacing.md, fontSize: theme.fontSize.base, color: theme.colors.text },
  submitBtn: { padding: 16, borderRadius: theme.borderRadius.lg, alignItems: 'center' },
  submitText: { color: '#FFF', fontSize: theme.fontSize.base, fontWeight: theme.fontWeight.bold },
});
