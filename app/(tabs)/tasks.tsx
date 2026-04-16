import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useHome } from '@/hooks/useHome';
import { theme } from '@/constants/theme';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Task } from '@/types';
import { useAlert } from '@/template';

const CATEGORIES: { key: Task['category']; label: string; icon: keyof typeof MaterialIcons.glyphMap; color: string }[] = [
  { key: 'cleaning', label: 'Cleaning', icon: 'cleaning-services', color: '#00C9A7' },
  { key: 'maintenance', label: 'Maintenance', icon: 'build', color: '#F59E0B' },
  { key: 'shopping', label: 'Shopping', icon: 'shopping-cart', color: '#7C3AED' },
  { key: 'cooking', label: 'Cooking', icon: 'restaurant', color: '#EF4444' },
  { key: 'other', label: 'Other', icon: 'more-horiz', color: '#64748B' },
];

const PRIORITIES: { key: Task['priority']; label: string; color: string }[] = [
  { key: 'low', label: 'Low', color: '#10B981' },
  { key: 'medium', label: 'Medium', color: '#F59E0B' },
  { key: 'high', label: 'High', color: '#EF4444' },
];

export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const { tasks, addTask, updateTask, deleteTask, user } = useHome();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'cleaning' as Task['category'],
    priority: 'medium' as Task['priority'],
    dueDate: '',
  });

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.isCompleted;
    if (filter === 'completed') return t.isCompleted;
    return true;
  });

  const completed = tasks.filter(t => t.isCompleted).length;
  const pending = tasks.filter(t => !t.isCompleted).length;
  const rate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate) {
      showAlert('Missing Information', 'Please fill title and due date');
      return;
    }
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      category: newTask.category,
      priority: newTask.priority,
      assignedTo: user?.name || 'Unassigned',
      dueDate: newTask.dueDate,
      isCompleted: false,
    };
    addTask(task);
    setModalVisible(false);
    setNewTask({ title: '', description: '', category: 'cleaning', priority: 'medium', dueDate: '' });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <LinearGradient colors={['#7C3AED', '#12143A']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.headerDecor} />
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Tasks</Text>
            <Text style={styles.headerSub}>Manage your chores</Text>
          </View>
          <Pressable onPress={() => setModalVisible(true)}>
            <LinearGradient colors={['#C026D3', '#00C9A7']} style={styles.addBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <MaterialIcons name="add" size={24} color="#FFF" />
            </LinearGradient>
          </Pressable>
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Completion Rate</Text>
            <Text style={styles.progressVal}>{rate}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <LinearGradient colors={['#00C9A7', '#7C3AED']} style={[styles.progressFill, { width: `${rate}%` as any }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
          </View>
          <View style={styles.progressStats}>
            <Text style={styles.progressStat}>{completed} Done</Text>
            <Text style={styles.progressStat}>{pending} Pending</Text>
            <Text style={styles.progressStat}>{tasks.length} Total</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Filter */}
      <View style={styles.filterRow}>
        {[{ key: 'all', label: 'All' }, { key: 'active', label: 'Active' }, { key: 'completed', label: 'Done' }].map(f => (
          <Pressable key={f.key} style={[styles.pill, filter === f.key && styles.pillActive]} onPress={() => setFilter(f.key as any)}>
            {filter === f.key ? (
              <LinearGradient colors={['#7C3AED', '#C026D3']} style={styles.pillGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
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
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={() => updateTask(task.id, { isCompleted: !task.isCompleted, completedDate: !task.isCompleted ? new Date().toISOString() : undefined })}
              onPress={() => showAlert('Task Actions', `Manage "${task.title}"`, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteTask(task.id) },
              ])}
            />
          ))}
        </View>
        {filteredTasks.length === 0 && (
          <View style={styles.empty}>
            <LinearGradient colors={['#EDE9FE', '#E0FFF8']} style={styles.emptyIconBg}>
              <MaterialIcons name="task-alt" size={40} color={theme.colors.secondary} />
            </LinearGradient>
            <Text style={styles.emptyText}>No tasks found</Text>
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <LinearGradient colors={['#7C3AED', '#C026D3']} style={styles.modalBar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
            <View style={styles.modalHead}>
              <Text style={styles.modalTitle}>Add New Task</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={theme.colors.textSecondary} />
              </Pressable>
            </View>

            <TextInput style={styles.inp} placeholder="Task title" placeholderTextColor={theme.colors.textTertiary} value={newTask.title} onChangeText={t => setNewTask({ ...newTask, title: t })} />
            <TextInput style={[styles.inp, { minHeight: 60 }]} placeholder="Description (optional)" placeholderTextColor={theme.colors.textTertiary} value={newTask.description} onChangeText={t => setNewTask({ ...newTask, description: t })} multiline />

            <Text style={styles.fieldLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {CATEGORIES.map(cat => (
                <Pressable
                  key={cat.key}
                  style={[styles.catChip, newTask.category === cat.key && { backgroundColor: `${cat.color}20`, borderColor: cat.color }]}
                  onPress={() => setNewTask({ ...newTask, category: cat.key })}
                >
                  <MaterialIcons name={cat.icon} size={16} color={newTask.category === cat.key ? cat.color : theme.colors.textTertiary} />
                  <Text style={[styles.catLabel, newTask.category === cat.key && { color: cat.color }]}>{cat.label}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={styles.fieldLabel}>Priority</Text>
            <View style={styles.priorityRow}>
              {PRIORITIES.map(p => (
                <Pressable
                  key={p.key}
                  style={[styles.priorityChip, newTask.priority === p.key && { backgroundColor: `${p.color}20`, borderColor: p.color }]}
                  onPress={() => setNewTask({ ...newTask, priority: p.key })}
                >
                  <View style={[styles.priorityDot, { backgroundColor: p.color }]} />
                  <Text style={[styles.catLabel, newTask.priority === p.key && { color: p.color }]}>{p.label}</Text>
                </Pressable>
              ))}
            </View>

            <TextInput style={styles.inp} placeholder="Due Date (YYYY-MM-DD)" placeholderTextColor={theme.colors.textTertiary} value={newTask.dueDate} onChangeText={t => setNewTask({ ...newTask, dueDate: t })} />

            <Pressable onPress={handleAddTask}>
              <LinearGradient colors={['#7C3AED', '#C026D3']} style={styles.submitBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.submitText}>Add Task</Text>
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
  header: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md, paddingBottom: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden' },
  headerDecor: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(192,38,211,0.12)', top: -60, right: -30 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg },
  headerTitle: { fontSize: theme.fontSize.xxl, fontWeight: theme.fontWeight.heavy, color: '#FFF' },
  headerSub: { fontSize: theme.fontSize.sm, color: 'rgba(255,255,255,0.6)' },
  addBtn: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', ...theme.shadows.violet },
  progressCard: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: theme.borderRadius.lg, padding: theme.spacing.md, gap: 10 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { fontSize: theme.fontSize.sm, color: 'rgba(255,255,255,0.7)', fontWeight: theme.fontWeight.medium },
  progressVal: { fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: '#FFF' },
  progressTrack: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4 },
  progressStats: { flexDirection: 'row', justifyContent: 'space-between' },
  progressStat: { fontSize: theme.fontSize.xs, color: 'rgba(255,255,255,0.6)' },
  filterRow: { flexDirection: 'row', paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, gap: theme.spacing.sm },
  pill: { borderRadius: theme.borderRadius.full, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, overflow: 'hidden' },
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
  modalCard: { backgroundColor: theme.colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: theme.spacing.lg, gap: theme.spacing.md, paddingBottom: 32 },
  modalBar: { height: 4, width: 40, borderRadius: 2, alignSelf: 'center', marginBottom: 8 },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
  inp: { backgroundColor: theme.colors.surfaceTinted, borderWidth: 1.5, borderColor: theme.colors.border, borderRadius: theme.borderRadius.lg, padding: theme.spacing.md, fontSize: theme.fontSize.base, color: theme.colors.text },
  fieldLabel: { fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, color: theme.colors.textSecondary },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: theme.borderRadius.full, backgroundColor: theme.colors.surfaceTinted, borderWidth: 1.5, borderColor: theme.colors.border, marginRight: 8 },
  catLabel: { fontSize: theme.fontSize.sm, color: theme.colors.textTertiary, fontWeight: theme.fontWeight.medium },
  priorityRow: { flexDirection: 'row', gap: theme.spacing.sm },
  priorityChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: theme.borderRadius.lg, backgroundColor: theme.colors.surfaceTinted, borderWidth: 1.5, borderColor: theme.colors.border },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  submitBtn: { padding: 16, borderRadius: theme.borderRadius.lg, alignItems: 'center', ...theme.shadows.violet },
  submitText: { color: '#FFF', fontSize: theme.fontSize.base, fontWeight: theme.fontWeight.bold },
});
