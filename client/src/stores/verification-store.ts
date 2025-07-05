// Verification Progress Store for KYC flow
export interface VerificationProgress {
  currentStep: string;
  completedSteps: string[];
  formData: {
    hearAboutUs?: string;
    dateOfBirth?: { day: number; month: number; year: number };
    sourceOfIncome?: string;
    annualIncome?: string;
    investmentExperience?: string;
    plannedDeposit?: string;
    investmentGoal?: string;
    documentType?: string;
    documents?: {
      front?: File;
      back?: File;
      single?: File;
    };
  };
  isCompleted: boolean;
  submittedAt?: string;
}

const STORAGE_KEY = 'nedaxer_verification_progress';

export class VerificationStore {
  static saveProgress(progress: VerificationProgress): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save verification progress:', error);
    }
  }

  static getProgress(): VerificationProgress | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load verification progress:', error);
      return null;
    }
  }

  static clearProgress(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear verification progress:', error);
    }
  }

  static updateStep(step: string, data?: any): void {
    const current = this.getProgress() || {
      currentStep: 'start',
      completedSteps: [],
      formData: {},
      isCompleted: false
    };

    current.currentStep = step;
    
    if (!current.completedSteps.includes(step)) {
      current.completedSteps.push(step);
    }

    if (data) {
      current.formData = { ...current.formData, ...data };
    }

    this.saveProgress(current);
  }

  static markCompleted(): void {
    const current = this.getProgress();
    if (current) {
      current.isCompleted = true;
      current.submittedAt = new Date().toISOString();
      this.saveProgress(current);
    }
  }

  static canResume(): boolean {
    const progress = this.getProgress();
    return progress !== null && !progress.isCompleted && progress.completedSteps.length > 0;
  }

  static getResumeStep(): string {
    const progress = this.getProgress();
    if (!progress) return 'start';
    
    // Determine the next step based on completed steps
    const { completedSteps } = progress;
    
    if (!completedSteps.includes('hear-about')) return 'hear-about';
    if (!completedSteps.includes('date-of-birth')) return 'date-of-birth';
    if (!completedSteps.includes('questionnaire')) return 'questionnaire';
    if (!completedSteps.includes('document-selection')) return 'document-selection';
    if (!completedSteps.includes('document-upload')) return 'document-upload';
    
    return 'start';
  }
}