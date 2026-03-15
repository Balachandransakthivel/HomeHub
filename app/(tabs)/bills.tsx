import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useHome } from '@/hooks/useHome';
import { theme } from '@/constants/theme';
import { BillCard } from '@/components/bills/BillCard';
import { Bill } from '@/types';
import { useAlert } from '@/template';

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
    setNewBill({
      name: '',
      category: 'electricity',
      amount: '',
      dueDate: '',
      isRecurring: false,
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bills</Text>
        <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
          <MaterialIcons name="add" size={24} color="#FFF" />
        </Pressable>
      </View>

      {/* Filter Pills */}
      <View style={styles.filterContainer}>
        {[
          { key: 'all', label: 'All' },
          { key: 'unpaid', label: 'Unpaid' },
          { key: 'paid', label: 'Paid' },
        ].map(item => (
          <Pressable
            key={item.key}
            style={[
              styles.filterPill,
              filter === item.key && styles.filterPillActive,
            ]}
            onPress={() => setFilter(item.key as any)}
          >
            <Text
              style={[
                styles.filterText,
                filter === item.key && styles.filterTextActive,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Bills List */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {filteredBills.map(bill => (
            <BillCard
              key={bill.id}
              bill={bill}
              onTogglePaid={() =>
                updateBill(bill.id, {
                  isPaid: !bill.isPaid,
                  paidDate: !bill.isPaid ? new Date().toISOString() : undefined,
                })
              }
              onPress={() =>
                showAlert('Bill Actions', `Manage ${bill.name}`, [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteBill(bill.id),
                  },
                ])
              }
            />
          ))}
        </View>

        {filteredBills.length === 0 && (
          <View style={styles.empty}>
            <MaterialIcons name="receipt-long" size={64} color={theme.colors.textTertiary} />
            <Text style={styles.emptyText}>No bills found</Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Add Bill Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Bill</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={theme.colors.text} />
              </Pressable>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Bill Name (e.g., Electricity)"
              value={newBill.name}
              onChangeText={text => setNewBill({ ...newBill, name: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={newBill.amount}
              onChangeText={text => setNewBill({ ...newBill, amount: text })}
              keyboardType="decimal-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="Due Date (YYYY-MM-DD)"
              value={newBill.dueDate}
              onChangeText={text => setNewBill({ ...newBill, dueDate: text })}
            />

            <Pressable
              style={styles.submitButton}
              onPress={handleAddBill}
            >
              <Text style={styles.submitButtonText}>Add Bill</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  filterPill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterPillActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
  filterTextActive: {
    color: '#FFF',
  },
  scroll: {
    flex: 1,
  },
  list: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  empty: {
    alignItems: 'center',
    padding: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
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
