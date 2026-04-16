import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useHome } from '@/hooks/useHome';
import { theme } from '@/constants/theme';
import { MaintenanceCard } from '@/components/maintenance/MaintenanceCard';
import { MaintenanceRecord, ServiceHistoryEntry } from '@/types';
import { useAlert } from '@/template';

export default function MaintenanceScreen() {
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const { maintenance, addMaintenanceRecord, updateMaintenanceRecord, deleteMaintenanceRecord } = useHome();
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [newRecord, setNewRecord] = useState({
    item: '',
    type: 'appliance' as MaintenanceRecord['type'],
    lastService: '',
    nextService: '',
    cost: '',
    notes: '',
    isRecurring: false,
    recurringInterval: 'monthly' as MaintenanceRecord['recurringInterval'],
  });
  const [photos, setPhotos] = useState<string[]>([]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map(asset => asset.uri);
      setPhotos([...photos, ...uris]);
    }
  };

  const handleAddRecord = () => {
    if (!newRecord.item || !newRecord.lastService || !newRecord.nextService) {
      showAlert('Missing Information', 'Please fill all required fields');
      return;
    }

    const record: MaintenanceRecord = {
      id: Date.now().toString(),
      item: newRecord.item,
      type: newRecord.type,
      lastService: newRecord.lastService,
      nextService: newRecord.nextService,
      cost: newRecord.cost ? parseFloat(newRecord.cost) : undefined,
      notes: newRecord.notes || undefined,
      isRecurring: newRecord.isRecurring,
      recurringInterval: newRecord.isRecurring ? newRecord.recurringInterval : undefined,
      photos: photos.length > 0 ? photos : undefined,
      serviceHistory: [],
    };

    addMaintenanceRecord(record);
    setModalVisible(false);
    setPhotos([]);
    setNewRecord({
      item: '',
      type: 'appliance',
      lastService: '',
      nextService: '',
      cost: '',
      notes: '',
      isRecurring: false,
      recurringInterval: 'monthly',
    });
  };

  const handleAddServiceHistory = () => {
    if (!selectedRecord) return;

    showAlert('Add Service Entry', 'Feature coming soon - add service history entry');
  };

  const upcomingMaintenance = maintenance.filter(
    m => new Date(m.nextService) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );
  const overdueMaintenance = maintenance.filter(m => new Date(m.nextService) < new Date());

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Maintenance</Text>
        <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
          <MaterialIcons name="add" size={24} color="#FFF" />
        </Pressable>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{overdueMaintenance.length}</Text>
          <Text style={styles.statLabel}>Overdue</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{upcomingMaintenance.length}</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{maintenance.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Maintenance List */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {overdueMaintenance.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>⚠️ Overdue</Text>
              {overdueMaintenance.map(record => (
                <MaintenanceCard
                  key={record.id}
                  record={record}
                  onPress={() => {
                    setSelectedRecord(record);
                    setDetailModalVisible(true);
                  }}
                />
              ))}
            </>
          )}

          {upcomingMaintenance.filter(m => new Date(m.nextService) >= new Date()).length > 0 && (
            <>
              <Text style={styles.sectionTitle}>📅 Upcoming</Text>
              {upcomingMaintenance
                .filter(m => new Date(m.nextService) >= new Date())
                .map(record => (
                  <MaintenanceCard
                    key={record.id}
                    record={record}
                    onPress={() => {
                      setSelectedRecord(record);
                      setDetailModalVisible(true);
                    }}
                  />
                ))}
            </>
          )}

          {maintenance.filter(
            m => new Date(m.nextService) > new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          ).length > 0 && (
            <>
              <Text style={styles.sectionTitle}>✓ Scheduled</Text>
              {maintenance
                .filter(m => new Date(m.nextService) > new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
                .map(record => (
                  <MaintenanceCard
                    key={record.id}
                    record={record}
                    onPress={() => {
                      setSelectedRecord(record);
                      setDetailModalVisible(true);
                    }}
                  />
                ))}
            </>
          )}
        </View>

        {maintenance.length === 0 && (
          <View style={styles.empty}>
            <MaterialIcons name="build" size={64} color={theme.colors.textTertiary} />
            <Text style={styles.emptyText}>No maintenance records yet</Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Add Record Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalScroll}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Maintenance Record</Text>
                <Pressable onPress={() => setModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color={theme.colors.text} />
                </Pressable>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Item Name (e.g., Air Conditioner)"
                value={newRecord.item}
                onChangeText={text => setNewRecord({ ...newRecord, item: text })}
              />

              <View style={styles.typeSelector}>
                {['appliance', 'hvac', 'plumbing', 'electrical', 'other'].map(type => (
                  <Pressable
                    key={type}
                    style={[
                      styles.typeChip,
                      newRecord.type === type && styles.typeChipActive,
                    ]}
                    onPress={() => setNewRecord({ ...newRecord, type: type as any })}
                  >
                    <Text
                      style={[
                        styles.typeChipText,
                        newRecord.type === type && styles.typeChipTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <TextInput
                style={styles.input}
                placeholder="Last Service Date (YYYY-MM-DD)"
                value={newRecord.lastService}
                onChangeText={text => setNewRecord({ ...newRecord, lastService: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Next Service Date (YYYY-MM-DD)"
                value={newRecord.nextService}
                onChangeText={text => setNewRecord({ ...newRecord, nextService: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Cost (optional)"
                value={newRecord.cost}
                onChangeText={text => setNewRecord({ ...newRecord, cost: text })}
                keyboardType="decimal-pad"
              />

              <TextInput
                style={styles.input}
                placeholder="Notes (optional)"
                value={newRecord.notes}
                onChangeText={text => setNewRecord({ ...newRecord, notes: text })}
                multiline
              />

              <Pressable
                style={styles.checkboxRow}
                onPress={() => setNewRecord({ ...newRecord, isRecurring: !newRecord.isRecurring })}
              >
                <MaterialIcons
                  name={newRecord.isRecurring ? 'check-box' : 'check-box-outline-blank'}
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.checkboxLabel}>Recurring Maintenance</Text>
              </Pressable>

              {newRecord.isRecurring && (
                <View style={styles.intervalSelector}>
                  {['weekly', 'monthly', 'quarterly', 'yearly'].map(interval => (
                    <Pressable
                      key={interval}
                      style={[
                        styles.intervalChip,
                        newRecord.recurringInterval === interval && styles.intervalChipActive,
                      ]}
                      onPress={() => setNewRecord({ ...newRecord, recurringInterval: interval as any })}
                    >
                      <Text
                        style={[
                          styles.intervalChipText,
                          newRecord.recurringInterval === interval && styles.intervalChipTextActive,
                        ]}
                      >
                        {interval}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}

              <Pressable style={styles.photoButton} onPress={handlePickImage}>
                <MaterialIcons name="add-photo-alternate" size={24} color={theme.colors.primary} />
                <Text style={styles.photoButtonText}>Add Photos ({photos.length})</Text>
              </Pressable>

              {photos.length > 0 && (
                <ScrollView horizontal style={styles.photoPreview}>
                  {photos.map((uri, index) => (
                    <View key={index} style={styles.photoItem}>
                      <Image source={{ uri }} style={styles.photoImage} contentFit="cover" />
                      <Pressable
                        style={styles.removePhoto}
                        onPress={() => setPhotos(photos.filter((_, i) => i !== index))}
                      >
                        <MaterialIcons name="close" size={16} color="#FFF" />
                      </Pressable>
                    </View>
                  ))}
                </ScrollView>
              )}

              <Pressable style={styles.submitButton} onPress={handleAddRecord}>
                <Text style={styles.submitButtonText}>Add Record</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Detail Modal */}
      <Modal visible={detailModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalScroll}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedRecord?.item}</Text>
                <Pressable onPress={() => setDetailModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color={theme.colors.text} />
                </Pressable>
              </View>

              {selectedRecord && (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Type:</Text>
                    <Text style={styles.detailValue}>{selectedRecord.type}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Last Service:</Text>
                    <Text style={styles.detailValue}>
                      {new Date(selectedRecord.lastService).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Next Service:</Text>
                    <Text style={styles.detailValue}>
                      {new Date(selectedRecord.nextService).toLocaleDateString()}
                    </Text>
                  </View>
                  {selectedRecord.cost !== undefined && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Last Cost:</Text>
                      <Text style={styles.detailValue}>₹{selectedRecord.cost.toFixed(2)}</Text>
                    </View>
                  )}
                  {selectedRecord.notes && (
                    <View style={styles.detailSection}>
                      <Text style={styles.detailLabel}>Notes:</Text>
                      <Text style={styles.detailText}>{selectedRecord.notes}</Text>
                    </View>
                  )}

                  {selectedRecord.photos && selectedRecord.photos.length > 0 && (
                    <View style={styles.detailSection}>
                      <Text style={styles.detailLabel}>Photos:</Text>
                      <ScrollView horizontal style={styles.photoGallery}>
                        {selectedRecord.photos.map((uri, index) => (
                          <Image key={index} source={{ uri }} style={styles.galleryImage} contentFit="cover" />
                        ))}
                      </ScrollView>
                    </View>
                  )}

                  <View style={styles.detailSection}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.detailLabel}>Service History</Text>
                      <Pressable onPress={handleAddServiceHistory}>
                        <MaterialIcons name="add" size={24} color={theme.colors.primary} />
                      </Pressable>
                    </View>
                    {selectedRecord.serviceHistory && selectedRecord.serviceHistory.length > 0 ? (
                      selectedRecord.serviceHistory.map(entry => (
                        <View key={entry.id} style={styles.historyEntry}>
                          <Text style={styles.historyDate}>
                            {new Date(entry.date).toLocaleDateString()}
                          </Text>
                          <Text style={styles.historyDescription}>{entry.description}</Text>
                          <Text style={styles.historyCost}>₹{entry.cost.toFixed(2)}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.emptyHistory}>No service history yet</Text>
                    )}
                  </View>

                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => {
                      showAlert('Delete Record', `Remove ${selectedRecord.item}?`, [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: () => {
                            deleteMaintenanceRecord(selectedRecord.id);
                            setDetailModalVisible(false);
                          },
                        },
                      ]);
                    }}
                  >
                    <MaterialIcons name="delete" size={20} color="#FFF" />
                    <Text style={styles.deleteButtonText}>Delete Record</Text>
                  </Pressable>
                </>
              )}
            </View>
          </ScrollView>
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  statValue: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  list: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
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
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    marginTop: 60,
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
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  typeChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  typeChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  typeChipText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },
  typeChipTextActive: {
    color: '#FFF',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  checkboxLabel: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
  },
  intervalSelector: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  intervalChip: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  intervalChipActive: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },
  intervalChipText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },
  intervalChipTextActive: {
    color: '#FFF',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    borderStyle: 'dashed',
  },
  photoButtonText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
  photoPreview: {
    flexDirection: 'row',
  },
  photoItem: {
    position: 'relative',
    marginRight: theme.spacing.sm,
  },
  photoImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
  },
  removePhoto: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  detailLabel: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  detailValue: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },
  detailSection: {
    marginTop: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  detailText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  photoGallery: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
  },
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
  },
  historyEntry: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  historyDate: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  historyDescription: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  historyCost: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold,
    marginTop: 4,
  },
  emptyHistory: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: theme.spacing.lg,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.danger,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
  },
});
