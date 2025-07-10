import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { showSuccessBanner, showErrorBanner } from '@/hooks/use-bottom-banner';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Shield,
  Clock,
  Camera,
  Image,
  X,
  Check,
  Info
} from 'lucide-react';

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

type VerificationStep = 'info' | 'questionnaire' | 'documents' | 'review';

export default function DesktopVerification() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState<VerificationStep>('info');
  const [verificationData, setVerificationData] = useState<VerificationData>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch current KYC status
  const { data: kycStatus } = useQuery({
    queryKey: ['/api/verification/status'],
    enabled: !!user,
  });

  // Submit verification mutation
  const submitVerificationMutation = useMutation({
    mutationFn: async (data: VerificationData) => {
      const formData = new FormData();
      
      // Add non-file data
      Object.keys(data).forEach(key => {
        if (key !== 'documents' && data[key as keyof VerificationData] !== undefined) {
          const value = data[key as keyof VerificationData];
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      // Add document files
      if (data.documents) {
        Object.keys(data.documents).forEach(docKey => {
          const file = data.documents![docKey as keyof typeof data.documents];
          if (file) {
            formData.append(`documents[${docKey}]`, file);
          }
        });
      }

      const response = await fetch('/api/verification/submit', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit verification');
      }

      return response.json();
    },
    onSuccess: () => {
      showSuccessBanner(
        'Verification Submitted',
        'Your verification has been submitted successfully and is under review'
      );
      queryClient.invalidateQueries({ queryKey: ['/api/verification/status'] });
      navigate('/mobile/verification-submitted');
    },
    onError: (error: any) => {
      showErrorBanner(
        'Submission Failed',
        error.message || 'Failed to submit verification'
      );
    }
  });

  const updateVerificationData = (key: keyof VerificationData, value: any) => {
    setVerificationData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validateStep = (step: VerificationStep): boolean => {
    const newErrors: { [key: string]: string } = {};

    switch (step) {
      case 'info':
        if (!verificationData.hearAboutUs) {
          newErrors.hearAboutUs = 'Please select how you heard about us';
        }
        if (!verificationData.dateOfBirth) {
          newErrors.dateOfBirth = 'Please enter your date of birth';
        }
        break;
      case 'questionnaire':
        if (!verificationData.sourceOfIncome) {
          newErrors.sourceOfIncome = 'Please select your source of income';
        }
        if (!verificationData.annualIncome) {
          newErrors.annualIncome = 'Please select your annual income range';
        }
        if (!verificationData.investmentExperience) {
          newErrors.investmentExperience = 'Please select your investment experience';
        }
        break;
      case 'documents':
        if (!verificationData.documentType) {
          newErrors.documentType = 'Please select a document type';
        }
        if (!verificationData.documents || Object.keys(verificationData.documents).length === 0) {
          newErrors.documents = 'Please upload required documents';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      switch (currentStep) {
        case 'info':
          setCurrentStep('questionnaire');
          break;
        case 'questionnaire':
          setCurrentStep('documents');
          break;
        case 'documents':
          setCurrentStep('review');
          break;
        case 'review':
          submitVerificationMutation.mutate(verificationData);
          break;
      }
    }
  };

  const handlePrevious = () => {
    switch (currentStep) {
      case 'questionnaire':
        setCurrentStep('info');
        break;
      case 'documents':
        setCurrentStep('questionnaire');
        break;
      case 'review':
        setCurrentStep('documents');
        break;
    }
  };

  const handleFileUpload = (files: FileList | null, type: 'front' | 'back' | 'single') => {
    if (files && files[0]) {
      const file = files[0];
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, documents: 'File size must be less than 10MB' }));
        return;
      }

      updateVerificationData('documents', {
        ...verificationData.documents,
        [type]: file
      });
    }
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case 'info': return 25;
      case 'questionnaire': return 50;
      case 'documents': return 75;
      case 'review': return 100;
      default: return 0;
    }
  };

  const currentKycStatus = kycStatus?.data?.kycStatus;
  const isAlreadyVerified = currentKycStatus === 'verified';
  const isPending = currentKycStatus === 'pending';

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mobile/profile')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Account Verification</h1>
            <p className="text-gray-400">Complete your identity verification to unlock all features</p>
          </div>
        </div>
        
        <Card className="bg-black/20 border-gray-700/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-400">Verification Status</p>
                <Badge variant={isAlreadyVerified ? 'default' : isPending ? 'secondary' : 'outline'}>
                  {isAlreadyVerified ? 'Verified' : isPending ? 'Under Review' : 'Not Started'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="bg-black/20 border-gray-700/50">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Verification Progress</span>
              <span className="text-white">{getStepProgress()}%</span>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
            <div className="flex justify-between text-xs text-gray-400">
              <span className={currentStep === 'info' ? 'text-orange-500' : ''}>Personal Info</span>
              <span className={currentStep === 'questionnaire' ? 'text-orange-500' : ''}>Questionnaire</span>
              <span className={currentStep === 'documents' ? 'text-orange-500' : ''}>Documents</span>
              <span className={currentStep === 'review' ? 'text-orange-500' : ''}>Review</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Already Verified Message */}
      {isAlreadyVerified && (
        <Card className="bg-green-900/20 border-green-700/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="text-white font-semibold text-lg">Account Verified</h3>
                <p className="text-gray-300">Your account has been successfully verified. You have access to all platform features.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Review Message */}
      {isPending && (
        <Card className="bg-blue-900/20 border-blue-700/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="text-white font-semibold text-lg">Verification Under Review</h3>
                <p className="text-gray-300">Your verification documents are currently being reviewed. This process typically takes 1-2 business days.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification Form */}
      {!isAlreadyVerified && !isPending && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Form Content */}
          <div className="md:col-span-2">
            <Card className="bg-black/20 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white">
                  {currentStep === 'info' && 'Personal Information'}
                  {currentStep === 'questionnaire' && 'Investment Profile'}
                  {currentStep === 'documents' && 'Identity Verification'}
                  {currentStep === 'review' && 'Review & Submit'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information Step */}
                {currentStep === 'info' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">How did you hear about us?</Label>
                      <Select
                        value={verificationData.hearAboutUs || ''}
                        onValueChange={(value) => updateVerificationData('hearAboutUs', value)}
                      >
                        <SelectTrigger className="bg-black/20 border-gray-700/50 text-white">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="search">Search Engine</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                          <SelectItem value="friend">Friend Referral</SelectItem>
                          <SelectItem value="ad">Advertisement</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.hearAboutUs && (
                        <p className="text-red-400 text-sm">{errors.hearAboutUs}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Date of Birth</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Select
                          value={verificationData.dateOfBirth?.day?.toString() || ''}
                          onValueChange={(value) => updateVerificationData('dateOfBirth', {
                            ...verificationData.dateOfBirth,
                            day: parseInt(value)
                          })}
                        >
                          <SelectTrigger className="bg-black/20 border-gray-700/50 text-white">
                            <SelectValue placeholder="Day" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={verificationData.dateOfBirth?.month?.toString() || ''}
                          onValueChange={(value) => updateVerificationData('dateOfBirth', {
                            ...verificationData.dateOfBirth,
                            month: parseInt(value)
                          })}
                        >
                          <SelectTrigger className="bg-black/20 border-gray-700/50 text-white">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {new Date(0, i).toLocaleString('en', { month: 'long' })}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={verificationData.dateOfBirth?.year?.toString() || ''}
                          onValueChange={(value) => updateVerificationData('dateOfBirth', {
                            ...verificationData.dateOfBirth,
                            year: parseInt(value)
                          })}
                        >
                          <SelectTrigger className="bg-black/20 border-gray-700/50 text-white">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 100 }, (_, i) => {
                              const year = new Date().getFullYear() - i - 18;
                              return (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      {errors.dateOfBirth && (
                        <p className="text-red-400 text-sm">{errors.dateOfBirth}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Questionnaire Step */}
                {currentStep === 'questionnaire' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Source of Income</Label>
                      <Select
                        value={verificationData.sourceOfIncome || ''}
                        onValueChange={(value) => updateVerificationData('sourceOfIncome', value)}
                      >
                        <SelectTrigger className="bg-black/20 border-gray-700/50 text-white">
                          <SelectValue placeholder="Select source of income" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employment">Employment</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="investments">Investments</SelectItem>
                          <SelectItem value="retirement">Retirement</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Annual Income</Label>
                      <Select
                        value={verificationData.annualIncome || ''}
                        onValueChange={(value) => updateVerificationData('annualIncome', value)}
                      >
                        <SelectTrigger className="bg-black/20 border-gray-700/50 text-white">
                          <SelectValue placeholder="Select income range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-25k">Under $25,000</SelectItem>
                          <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                          <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                          <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                          <SelectItem value="over-250k">Over $250,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Investment Experience</Label>
                      <Select
                        value={verificationData.investmentExperience || ''}
                        onValueChange={(value) => updateVerificationData('investmentExperience', value)}
                      >
                        <SelectTrigger className="bg-black/20 border-gray-700/50 text-white">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Documents Step */}
                {currentStep === 'documents' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-white">Document Type</Label>
                      <Select
                        value={verificationData.documentType || ''}
                        onValueChange={(value) => updateVerificationData('documentType', value)}
                      >
                        <SelectTrigger className="bg-black/20 border-gray-700/50 text-white">
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="drivers_license">Driver's License</SelectItem>
                          <SelectItem value="national_id">National ID Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {verificationData.documentType && (
                      <div className="space-y-4">
                        {verificationData.documentType === 'passport' ? (
                          <div className="space-y-2">
                            <Label className="text-white">Passport Photo</Label>
                            <div className="border-2 border-dashed border-gray-700/50 rounded-lg p-6 text-center">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e.target.files, 'single')}
                                className="hidden"
                                id="passport-upload"
                              />
                              <label htmlFor="passport-upload" className="cursor-pointer">
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-white">Upload Passport Photo</p>
                                <p className="text-gray-400 text-sm">Click to select file</p>
                              </label>
                              {verificationData.documents?.single && (
                                <p className="text-green-400 text-sm mt-2">
                                  ✓ {verificationData.documents.single.name}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-white">Front Side</Label>
                              <div className="border-2 border-dashed border-gray-700/50 rounded-lg p-6 text-center">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e.target.files, 'front')}
                                  className="hidden"
                                  id="front-upload"
                                />
                                <label htmlFor="front-upload" className="cursor-pointer">
                                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-white text-sm">Front Side</p>
                                </label>
                                {verificationData.documents?.front && (
                                  <p className="text-green-400 text-xs mt-1">
                                    ✓ Uploaded
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-white">Back Side</Label>
                              <div className="border-2 border-dashed border-gray-700/50 rounded-lg p-6 text-center">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e.target.files, 'back')}
                                  className="hidden"
                                  id="back-upload"
                                />
                                <label htmlFor="back-upload" className="cursor-pointer">
                                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-white text-sm">Back Side</p>
                                </label>
                                {verificationData.documents?.back && (
                                  <p className="text-green-400 text-xs mt-1">
                                    ✓ Uploaded
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {errors.documents && (
                      <p className="text-red-400 text-sm">{errors.documents}</p>
                    )}
                  </div>
                )}

                {/* Review Step */}
                {currentStep === 'review' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold">Please review your information</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">How you heard about us:</span>
                          <span className="text-white">{verificationData.hearAboutUs}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Date of Birth:</span>
                          <span className="text-white">
                            {verificationData.dateOfBirth?.day}/{verificationData.dateOfBirth?.month}/{verificationData.dateOfBirth?.year}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Source of Income:</span>
                          <span className="text-white">{verificationData.sourceOfIncome}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Annual Income:</span>
                          <span className="text-white">{verificationData.annualIncome}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Investment Experience:</span>
                          <span className="text-white">{verificationData.investmentExperience}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Document Type:</span>
                          <span className="text-white">{verificationData.documentType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Documents:</span>
                          <span className="text-green-400">
                            {Object.keys(verificationData.documents || {}).length} file(s) uploaded
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 'info'}
                    className="border-gray-700/50"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={submitVerificationMutation.isPending}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    {submitVerificationMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Submitting...
                      </>
                    ) : currentStep === 'review' ? (
                      'Submit Verification'
                    ) : (
                      'Next'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <Card className="bg-black/20 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white text-sm">Verification Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-gray-300 text-sm">Higher trading limits</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-gray-300 text-sm">Unlimited withdrawals</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-gray-300 text-sm">Priority support</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-gray-300 text-sm">Enhanced security</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-900/20 border-blue-700/50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-blue-300 text-sm font-medium">Secure Process</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Your documents are encrypted and processed securely. Verification typically takes 1-2 business days.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}