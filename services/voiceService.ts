import Voice from '@react-native-voice/voice';

export interface VoiceCommand {
  type: 'task' | 'bill' | 'emergency' | 'query' | 'unknown';
  action?: string;
  data?: any;
}

class VoiceCommandService {
  private isListening = false;

  async initialize() {
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
  }

  async startListening(): Promise<void> {
    try {
      await Voice.start('en-US');
      this.isListening = true;
    } catch (error) {
      console.error('Voice start error:', error);
      throw error;
    }
  }

  async stopListening(): Promise<void> {
    try {
      await Voice.stop();
      this.isListening = false;
    } catch (error) {
      console.error('Voice stop error:', error);
    }
  }

  async destroy() {
    try {
      await Voice.destroy();
      Voice.removeAllListeners();
      this.isListening = false;
    } catch (error) {
      console.error('Voice destroy error:', error);
    }
  }

  parseCommand(text: string): VoiceCommand {
    const lowerText = text.toLowerCase().trim();

    // Emergency detection
    if (
      lowerText.includes('emergency') ||
      lowerText.includes('help') ||
      lowerText.includes('urgent') ||
      lowerText.includes('panic')
    ) {
      return { type: 'emergency' };
    }

    // Task creation
    if (
      lowerText.includes('add task') ||
      lowerText.includes('create task') ||
      lowerText.includes('new task')
    ) {
      const taskTitle = lowerText
        .replace(/add task/gi, '')
        .replace(/create task/gi, '')
        .replace(/new task/gi, '')
        .trim();
      return {
        type: 'task',
        action: 'create',
        data: { title: taskTitle },
      };
    }

    // Bill queries
    if (
      lowerText.includes('bill') ||
      lowerText.includes('payment') ||
      lowerText.includes('due')
    ) {
      if (lowerText.includes('unpaid') || lowerText.includes('pending')) {
        return { type: 'bill', action: 'query-unpaid' };
      }
      if (lowerText.includes('total') || lowerText.includes('how much')) {
        return { type: 'bill', action: 'query-total' };
      }
      if (lowerText.includes('overdue')) {
        return { type: 'bill', action: 'query-overdue' };
      }
      return { type: 'bill', action: 'query-all' };
    }

    // Task queries
    if (lowerText.includes('task') && !lowerText.includes('add')) {
      if (lowerText.includes('pending') || lowerText.includes('active')) {
        return { type: 'query', action: 'active-tasks' };
      }
      return { type: 'query', action: 'all-tasks' };
    }

    return { type: 'unknown' };
  }

  private onSpeechStart = (e: any) => {
    console.log('Speech started', e);
  };

  private onSpeechEnd = (e: any) => {
    console.log('Speech ended', e);
    this.isListening = false;
  };

  private onSpeechError = (e: any) => {
    console.log('Speech error', e);
    this.isListening = false;
  };

  private onSpeechResults = (e: any) => {
    console.log('Speech results', e);
  };
}

export const voiceService = new VoiceCommandService();
