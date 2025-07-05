import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { VerificationStore } from '@/stores/verification-store';

// Import all verification components
import { VerificationStart } from './VerificationStart';
import { Step1HearAbout } from './Step1HearAbout';
import { Step2DateOfBirth } from './Step2DateOfBirth';
import { Step3Questionnaire } from './Step3Questionnaire';
import { Step4DocumentSelection } from './Step4DocumentSelection';
import { Step4DocumentUpload } from './Step4DocumentUpload';
import { VerificationComplete } from './VerificationComplete';

type VerificationStep = 
  | 'start' 
  | 'hear-about' 
  | 'date-of-birth' 
  | 'questionnaire' 
  | 'document-selection' 
  | 'document-upload' 
  | 'complete';

interface VerificationData {
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
}

export const VerificationFlow: React.FC = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState<VerificationStep>('start');
  const [verificationData, setVerificationData] = useState<VerificationData>({});

  // Initialize verification flow with resume capability
  useEffect(() => {
    const canResume = VerificationStore.canResume();
    if (canResume) {
      const progress = VerificationStore.getProgress();
      if (progress) {
        setCurrentStep(VerificationStore.getResumeStep() as VerificationStep);
        setVerificationData(progress.formData);
      }
    }
  }, []);

  // Submit verification mutation
  const submitVerificationMutation = useMutation({
    mutationFn: async (data: VerificationData) => {
      const formData = new FormData();
      
      // Add all the verification data
      formData.append('hearAboutUs', data.hearAboutUs || '');
      formData.append('dateOfBirth', JSON.stringify(data.dateOfBirth));
      formData.append('sourceOfIncome', data.sourceOfIncome || '');
      formData.append('annualIncome', data.annualIncome || '');
      formData.append('investmentExperience', data.investmentExperience || '');
      formData.append('plannedDeposit', data.plannedDeposit || '');
      formData.append('investmentGoal', data.investmentGoal || '');
      formData.append('documentType', data.documentType || '');
      
      // Add document files
      if (data.documents?.front) {
        formData.append('documentFront', data.documents.front);
      }
      if (data.documents?.back) {
        formData.append('documentBack', data.documents.back);
      }
      if (data.documents?.single) {
        formData.append('documentSingle', data.documents.single);
      }

      return fetch('/api/verification/submit', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      }).then(res => {
        if (!res.ok) throw new Error('Failed to submit verification');
        return res.json();
      });
    },
    onSuccess: () => {
      // Mark verification as completed and clear progress
      VerificationStore.markCompleted();
      VerificationStore.clearProgress();
      
      // Invalidate user data to refresh verification status
      queryClient.invalidateQueries({ queryKey: ['/api/user/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/verification/status'] });
      // Redirect to verification submitted page
      setLocation('/mobile/verification-submitted');
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit verification. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleClose = () => {
    setLocation('/mobile');
  };

  const handleStepNavigation = (step: VerificationStep, data?: any) => {
    if (data) {
      setVerificationData(prev => ({ ...prev, ...data }));
    }
    setCurrentStep(step);
    
    // Save progress to localStorage for resume functionality
    VerificationStore.updateStep(step, data);
  };

  const handleSubmit = (documents: any) => {
    const finalData = {
      ...verificationData,
      documents
    };
    
    setVerificationData(finalData);
    submitVerificationMutation.mutate(finalData);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'start':
        return (
          <VerificationStart
            onNext={() => handleStepNavigation('hear-about')}
            onClose={handleClose}
          />
        );

      case 'hear-about':
        return (
          <Step1HearAbout
            onNext={(value) => handleStepNavigation('date-of-birth', { hearAboutUs: value })}
            onBack={() => handleStepNavigation('start')}
            onClose={handleClose}
            initialValue={verificationData.hearAboutUs}
          />
        );

      case 'date-of-birth':
        return (
          <Step2DateOfBirth
            onNext={(value) => handleStepNavigation('questionnaire', { dateOfBirth: value })}
            onBack={() => handleStepNavigation('hear-about')}
            onClose={handleClose}
            initialValue={verificationData.dateOfBirth}
          />
        );

      case 'questionnaire':
        return (
          <Step3Questionnaire
            onNext={(value) => handleStepNavigation('document-selection', value)}
            onBack={() => handleStepNavigation('date-of-birth')}
            onClose={handleClose}
            initialValue={{
              sourceOfIncome: verificationData.sourceOfIncome,
              annualIncome: verificationData.annualIncome,
              investmentExperience: verificationData.investmentExperience,
              plannedDeposit: verificationData.plannedDeposit,
              investmentGoal: verificationData.investmentGoal
            }}
          />
        );

      case 'document-selection':
        return (
          <Step4DocumentSelection
            onNext={(value) => handleStepNavigation('document-upload', { documentType: value })}
            onBack={() => handleStepNavigation('questionnaire')}
            onClose={handleClose}
            initialValue={verificationData.documentType}
          />
        );

      case 'document-upload':
        return (
          <Step4DocumentUpload
            documentType={verificationData.documentType!}
            onNext={handleSubmit}
            onBack={() => handleStepNavigation('document-selection')}
            onClose={handleClose}
            initialFiles={verificationData.documents}
          />
        );

      case 'complete':
        return (
          <VerificationComplete
            onContinue={handleClose}
          />
        );

      default:
        return null;
    }
  };

  return renderCurrentStep();
};