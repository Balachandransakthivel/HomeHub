import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useHome } from '@/hooks/useHome';
import { theme } from '@/constants/theme';
import { BillCard } from '@/components/bills/BillCard';
import { Bill } from '@/types';
import { useAlert } from '@/template';

const CATEGORIES: { key: Bill['category']; label: string; icon: keyof typeof MaterialIcons.glyphMap; color: string }[] = [
  { key: 'electricity', label: 'Electricity', icon: 'bolt', color: '#F59E0B' },
  { key: 'water', label: 'Water', icon: 'water-drop', color: '#0EA5E9' },
  { key: 'gas', label: 'Gas', icon: 'local-fire-department', color: '#EF4444' },
  { key: 'internet', label: 'Internet', icon: 'wifi', color: '#8B5CF6' },
  { key: 'rent', label: 'Rent', icon: 'home', color: '#00C9A7' },
  { key: 'other', label: 'Other', icon: 'receipt', color: '#64748B' },
];

export default function BillsScreen() {
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const { bills, addBill, updateBill, deleteBill } = useHome();
  const [filter, setFilter] = useState<'all' | 'unpaid' | 'paid'>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [newBill, setNewBill] = useState({
    name: '',
    category: 'electricity' as Bill['category'],
    amount: '',
    dueDate: '',
    isRecurring: false,
  });

  const filteredBills = bills.filter(b => {
    if (filter === 'unpaid') return !b.isPaid;
    if (filter === 'paid') return b.isPaid;
    return true;
  });

  const totalUnpaid = bills.filter(b => !b.isPaid).reduce((s, b) => s + b.amount, 0);
  const totalPaid = bills.filter(b => b.isPaid).reduce((s, b) => s + b.amount, 0);

  const handleAddBill = () => {
    if (!newBill.name || !newBill.amount || !newBill.dueDate) {
      showAlert('Missing Information', 'Please fill all required fields');
      return;
    }
    const bill: Bill = {
      id: Date.now().toString(),
      name: newBill.name,
      category: newBill.category,
      amount: parseFloat(newBill.amount),
      dueDate: newBill.dueDate,
      isPaid: false,
      isRecurring: newBill.isRecurring,
    };
    addBill(bill);
    setModalVisible(false);
    setNewBill({ name: '', category: 'electricity', amount: '', dueDate: '', isRecurring: false });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <LinearGradient colors={['#12143A', '#1E1060']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.headerDecor} />
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Bills</Text>
            <Text style={styles.headerSub}>Track your payments</Text>
          </View>
          <Pressable onPress={() => setModalVisible(true)}>
            <LinearGradient colors={['#00C9A7', '#7C3AED']} style={styles.addBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <MaterialIcons name="add" size={24} color="#FFF" />
            </LinearGradient>
          </Pressable>
        </View>

        {/* Summary */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryVal}>₹{totalUnpaid.toFixed(0)}</Text>
            <Text style={styles.summaryLbl}>Unpaid</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryVal, { color: '#00C9A7' }]}>₹{totalPaid.toFixed(0)}</Text>
            <Text style={styles.summaryLbl}>Paid</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryCard}>
            <Text style={styles.summaryVal}>{bills.length}</Text>
            <Text style={styles.summaryLbl}>Total</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Filter pills */}
      <View style={styles.filterRow}>
        {[{ key: 'all', label: 'All Bills' }, { key: 'unpaid', label: 'Unpaid' }, { key: 'paid', label: 'Paid' }].map(f => (
          <Pressable
            key={f.key}
            style={[styles.pill, filter === f.key && styles.pillActive]}
            onPress={() => setFilter(f.key as any)}
          >
            {filter === f.key ? (
              <LinearGradient colors={['#00C9A7', '#7C3AED']} style={styles.pillGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.pillTextActive}>{f.label}</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.pillText}>{f.label}</Text>
            )}
          </Pressable>
        ))}
      </View>

      {/* List */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {filteredBills.map(bill => (
            <BillCard
              key={bill.id}
              bill={bill}
              onTogglePaid={() => updateBill(bill.id, { isPaid: !bill.isPaid, paidDate: !bill.isPaid ? new Date().toISOString() : undefined })}
              onPress={() => showAlert('Bill Actions', `Manage "${bill.name}"`, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteBill(bill.id) },
              ])}
            />
          ))}
        </View>
        {filteredBills.length === 0 && (
          <View style={styles.empty}>
            <LinearGradient colors={['#E0FFF8', '#EDE9FE']} style={styles.emptyIconBg}>
              <MaterialIcons name="receipt-long" size={40} color={theme.colors.primary} />
            </LinearGradient>
            <Text style={styles.emptyText}>No bills found</Text>
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <LinearGradient colors={['#00C9A7', '#7C3AED']} style={styles.modalBar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
            <View style={styles.modalHead}>
              <Text style={styles.modalTitle}>Add New Bill</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={theme.colors.textSecondary} />
              </Pressable>
            </View>

            <TextInput style={styles.inp} placeholder="Bill name (e.g. Electricity)" placeholderTextColor={theme.colors.textTertiary} value={newBill.name} onChangeText={t => setNewBill({ ...newBill, name: t })} />

            <Text style={styles.fieldLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
              {CATEGORIES.map(cat => (
                <Pressable
                  key={cat.key}
                  style={[styles.catChip, newBill.category === cat.key && { backgroundColor: `${cat.color}20`, borderColor: cat.color }]}
                  onPress={() => setNewBill({ ...newBill, category: cat.key })}
                >
                  <MaterialIcons name={cat.icon} size={18} color={newBill.category === cat.key ? cat.color : theme.colors.textTertiary} />
                  <Text style={[styles.catLabel, newBill.category === cat.key && { color: cat.color }]}>{cat.label}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <View style={styles.amtRow}>
              <View style={styles.amtPrefix}><Text style={styles.amtPrefixText}>₹</Text></View>
              <TextInput style={styles.amtInput} placeholder="0.00" placeholderTextColor={theme.colors.textTertiary} value={newBill.amount} onChangeText={t => setNewBill({ ...newBill, amount: t })} keyboardType="decimal-pad" />
            </View>

            <TextInput style={styles.inp} placeholder="Due Date (YYYY-MM-DD)" placeholderTextColor={theme.colors.textTertiary} value={newBill.dueDate} onChangeText={t => setNewBill({ ...newBill, dueDate: t })} />

            <Pressable style={styles.recurRow} onPress={() => setNewBill({ ...newBill, isRecurring: !newBill.isRecurring })}>
              <MaterialIcons name={newBill.isRecurring ? 'check-box' : 'check-box-outline-blank'} size={24} color={theme.colors.primary} />
              <Text style={styles.recurLabel}>Recurring monthly bill</Text>
            </Pressable>

            <Pressable onPress={handleAddBill}>
              <LinearGradient colors={['#00C9A7', '#7C3AED']} style={styles.submitBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.submitText}>Add Bill</Text>
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
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  headerDecor: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(0,201,167,0.1)', top: -60, right: -30,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg },
  headerTitle: { fontSize: theme.fontSize.xxl, fontWeight: theme.fontWeight.heavy, color: '#FFF' },
  headerSub: { fontSize: theme.fontSize.sm, color: 'rgba(255,255,255,0.6)' },
  addBtn: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', ...theme.shadows.teal },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  summaryCard: { flex: 1, alignItems: 'center' },
  summaryVal: { fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: '#FFF' },
  summaryLbl: { fontSize: theme.fontSize.xs, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  summaryDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.15)' },

  filterRow: { flexDirection: 'row', paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, gap: theme.spacing.sm },
  pill: {
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  pillActive: { borderWidth: 0 },
  pillGrad: { paddingHorizontal: 16, paddingVertical: 8 },
  pillText: { fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.medium, color: theme.colors.textSecondary, paddingHorizontal: 16, paddingVertical: 8 },
  pillTextActive: { fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, color: '#FFF' },

  scroll: { flex: 1 },
  list: { padding: theme.spacing.lg, gap: theme.spacing.md },
  empty: { alignItems: 'center', padding: theme.spacing.xxl, gap: theme.spacing.md },
  emptyIconBg: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: theme.fontSize.base, color: theme.colors.textSecondary },

  overlay: { flex: 1, backgroundColor: 'rgba(18,20,58,0.6)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: theme.spacing.lg, gap: theme.spacing.md,
    paddingBottom: 32,
  },
  modalBar: { height: 4, width: 40, borderRadius: 2, alignSelf: 'center', marginBottom: 8 },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
  inp: {
    backgroundColor: theme.colors.surfaceTinted,
    borderWidth: 1.5, borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md, fontSize: theme.fontSize.base, color: theme.colors.text,
  },
  fieldLabel: { fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, color: theme.colors.textSecondary },
  catScroll: { marginHorizontal: -4 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surfaceTinted,
    borderWidth: 1.5, borderColor: theme.colors.border,
    marginHorizontal: 4,
  },
  catLabel: { fontSize: theme.fontSize.sm, color: theme.colors.textTertiary, fontWeight: theme.fontWeight.medium },
  amtRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: theme.colors.border, borderRadius: theme.borderRadius.lg, overflow: 'hidden' },
  amtPrefix: { backgroundColor: theme.colors.primaryLight, paddingHorizontal: 14, paddingVertical: 14, borderRightWidth: 1, borderRightColor: theme.colors.border },
  amtPrefixText: { fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold, color: theme.colors.primary },
  amtInput: { flex: 1, padding: theme.spacing.md, fontSize: theme.fontSize.lg, color: theme.colors.text },
  recurRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  recurLabel: { fontSize: theme.fontSize.base, color: theme.colors.text },
  submitBtn: { padding: 16, borderRadius: theme.borderRadius.lg, alignItems: 'center', ...theme.shadows.teal },
  submitText: { color: '#FFF', fontSize: theme.fontSize.base, fontWeight: theme.fontWeight.bold },
});
