import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Voice from '@react-native-voice/voice';
import { theme } from '@/constants/theme';
import { VoiceButton } from '@/components/voice/VoiceButton';
import { useHome } from '@/hooks/useHome';
import { voiceService, VoiceCommand } from '@/services/voiceService';
import { useAlert } from '@/template';
import { Task } from '@/types';

export default function VoiceAssistantScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();
  const { bills, tasks, addTask, triggerEmergency } = useHome();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [commandHistory, setCommandHistory] = useState<{ command: string; result: string }[]>([]);

  useEffect(() => {
    voiceService.initialize();

    Voice.onSpeechResults = (e: any) => {
      if (e.value && e.value[0]) {
        const spokenText = e.value[0];
        setTranscript(spokenText);
        handleCommand(spokenText);
      }
    };

    return () => {
      voiceService.destroy();
    };
  }, []);

  const toggleListening = async () => {
    if (isListening) {
      await voiceService.stopListening();
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        await voiceService.startListening();
        setIsListening(true);
      } catch (error) {
        showAlert('Voice Error', 'Could not start voice recognition. Please check permissions.');
      }
    }
  };

  const handleCommand = (text: string) => {
    const command = voiceService.parseCommand(text);
    let result = '';

    switch (command.type) {
      case 'emergency':
        triggerEmergency();
        result = '🚨 Emergency alert triggered! Notifying your emergency contacts.';
        showAlert('Emergency Alert', 'Emergency notification sent to all contacts');
        break;

      case 'task':
        if (command.action === 'create' && command.data?.title) {
          const newTask: Task = {
            id: Date.now().toString(),
            title: command.data.title,
            description: 'Created via voice command',
            category: 'other',
            assignedTo: 'You',
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            isCompleted: false,
            priority: 'medium',
          };
          addTask(newTask);
          result = `✅ Task created: "${command.data.title}"`;
        } else {
          result = '❌ Could not understand task details';
        }
        break;

      case 'bill':
        const unpaidBills = bills.filter(b => !b.isPaid);
        const overdueBills = unpaidBills.filter(b => new Date(b.dueDate) < new Date());
        const totalUnpaid = unpaidBills.reduce((sum, b) => sum + b.amount, 0);

        if (command.action === 'query-unpaid') {
          result = `💰 You have ${unpaidBills.length} unpaid bill${unpaidBills.length !== 1 ? 's' : ''} totaling $${totalUnpaid.toFixed(2)}`;
        } else if (command.action === 'query-overdue') {
          result = `⚠️ You have ${overdueBills.length} overdue bill${overdueBills.length !== 1 ? 's' : ''}`;
        } else if (command.action === 'query-total') {
          result = `💵 Total unpaid bills: $${totalUnpaid.toFixed(2)}`;
        } else {
          result = `📄 You have ${bills.length} total bill${bills.length !== 1 ? 's' : ''}, ${unpaidBills.length} unpaid`;
        }
        break;

      case 'query':
        if (command.action === 'active-tasks') {
          const activeTasks = tasks.filter(t => !t.isCompleted);
          result = `📋 You have ${activeTasks.length} active task${activeTasks.length !== 1 ? 's' : ''}`;
        } else {
          result = `📝 You have ${tasks.length} total task${tasks.length !== 1 ? 's' : ''}`;
        }
        break;

      default:
        result = '❓ Sorry, I did not understand that command. Try asking about bills, tasks, or say "emergency"';
    }

    setCommandHistory([{ command: text, result }, ...commandHistory].slice(0, 10));
  };

  const suggestions = [
    { text: 'Add task: Buy groceries', icon: 'add-task' },
    { text: 'Show unpaid bills', icon: 'receipt-long' },
    { text: 'Emergency', icon: 'warning' },
    { text: 'Show active tasks', icon: 'task' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
        </Pressable>
        <Text style={styles.title}>Voice Assistant</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Voice Button */}
        <View style={styles.voiceSection}>
          <VoiceButton isListening={isListening} onPress={toggleListening} />
          <Text style={styles.voiceStatus}>
            {isListening ? 'Listening...' : 'Tap to speak'}
          </Text>
          {transcript && (
            <View style={styles.transcriptBox}>
              <Text style={styles.transcriptText}>{transcript}</Text>
            </View>
          )}
        </View>

        {/* Suggestions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Try saying:</Text>
          <View style={styles.suggestionsGrid}>
            {suggestions.map((suggestion, index) => (
              <Pressable
                key={index}
                style={styles.suggestionCard}
                onPress={() => {
                  setTranscript(suggestion.text);
                  handleCommand(suggestion.text);
                }}
              >
                <MaterialIcons name={suggestion.icon as any} size={24} color={theme.colors.primary} />
                <Text style={styles.suggestionText}>{suggestion.text}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Command History */}
        {commandHistory.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Commands</Text>
            {commandHistory.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyCommand}>
                  <MaterialIcons name="mic" size={16} color={theme.colors.primary} />
                  <Text style={styles.historyCommandText}>{item.command}</Text>
                </View>
                <View style={styles.historyResult}>
                  <Text style={styles.historyResultText}>{item.result}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Help Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Supported Commands</Text>
          <View style={styles.helpCard}>
            <View style={styles.helpItem}>
              <MaterialIcons name="task" size={20} color={theme.colors.secondary} />
              <Text style={styles.helpText}>
                <Text style={styles.helpBold}>Tasks: </Text>
                "Add task [name]", "Show active tasks"
              </Text>
            </View>
            <View style={styles.helpItem}>
              <MaterialIcons name="receipt-long" size={20} color={theme.colors.primary} />
              <Text style={styles.helpText}>
                <Text style={styles.helpBold}>Bills: </Text>
                "Show unpaid bills", "Show overdue bills"
              </Text>
            </View>
            <View style={styles.helpItem}>
              <MaterialIcons name="warning" size={20} color={theme.colors.danger} />
              <Text style={styles.helpText}>
                <Text style={styles.helpBold}>Emergency: </Text>
                "Emergency", "Help", "Panic"
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
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
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  scroll: {
    flex: 1,
  },
  voiceSection: {
    alignItems: 'center',
    padding: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  voiceStatus: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  transcriptBox: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.md,
    width: '100%',
    ...theme.shadows.sm,
  },
  transcriptText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    textAlign: 'center',
  },
  section: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  suggestionsGrid: {
    gap: theme.spacing.sm,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.md,
    ...theme.shadows.sm,
  },
  suggestionText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
  },
  historyItem: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  historyCommand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  historyCommandText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  historyResult: {
    paddingLeft: theme.spacing.lg,
  },
  historyResultText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
  },
  helpCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.md,
    ...theme.shadows.sm,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  helpText: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  helpBold: {
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  bottomPadding: {
    height: theme.spacing.xxl,
  },
});
