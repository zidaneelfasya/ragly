'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle2, Circle, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import BasicInfoStep from '@/components/wizard/basic-info-step';
import KnowledgeBaseStep from '@/components/wizard/knowledge-base-step';
import ChatConfigStep from '@/components/wizard/chat-config-step';
import PreviewPanel from '@/components/wizard/preview-panel';
import { Button } from '@/components/ui/button';
import { useChatbot } from '@/hooks/useChatbot';

export default function EditChatbotPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { updateChatbot, fetchChatbot } = useChatbot();
  
  const [formData, setFormData] = useState({
    name: '',
    model: 'gpt-4-turbo',
    language: 'en',
    isPublic: false,
    personality: '',
    files: [],
    manualKnowledge: '',
    knowledgeUrl: '',
    commands: [],
    welcomeMessage: 'Hello! How can I help you today?',
    fallbackMessage: 'I apologize, but I could not find an answer to your question.',
    tone: 'Friendly',
    temperature: 0.7,
  });

  const steps = [
    { title: 'Basic Info', icon: Circle },
    { title: 'Knowledge Base', icon: Circle },
    { title: 'Configuration', icon: Circle },
  ];

  useEffect(() => {
    loadChatbotData();
  }, [params.id]);

  const loadChatbotData = async () => {
    try {
      setIsLoading(true);
      const chatbot = await fetchChatbot(params.id as string);
      
      if (chatbot) {
        // Transform chatbot data to match form structure
        const commands = chatbot.chatbot_commands?.map((cmd: any) => ({
          command: cmd.command_name,
          description: cmd.command_description
        })) || [];

        const files = chatbot.chatbot_rag_files?.map((file: any) => ({
          id: file.id || Date.now(),
          name: file.original_name,
          size: '0 KB',
          status: 'completed'
        })) || [];

        setFormData({
          name: chatbot.name || '',
          model: chatbot.model || 'gpt-4-turbo',
          language: chatbot.language || 'en',
          isPublic: chatbot.is_public || false,
          personality: chatbot.personality || '',
          files: files,
          manualKnowledge: chatbot.manual_knowledge || '',
          knowledgeUrl: chatbot.knowledge_url || '',
          commands: commands.length > 0 ? commands : [{ command: '/help', description: 'Get help with common questions' }],
          welcomeMessage: chatbot.welcome_message || 'Hello! How can I help you today?',
          fallbackMessage: chatbot.fallback_message || 'I apologize, but I could not find an answer to your question.',
          tone: chatbot.tone || 'Friendly',
          temperature: chatbot.temperature || 0.7,
        });
      }
    } catch (error) {
      console.error('Error loading chatbot:', error);
      toast.error('Failed to load chatbot data');
      router.push('/dashboard/chatbots');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        if (!formData.name.trim()) {
          toast.error('Please enter a chatbot name');
          return false;
        }
        if (!formData.model) {
          toast.error('Please select an AI model');
          return false;
        }
        break;
      case 1:
        // Knowledge base is optional, so no validation needed
        break;
      case 2:
        // Configuration has defaults, so no validation needed
        break;
    }
    return true;
  };

  const handleUpdateChatbot = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    setIsUpdating(true);
    
    try {
      console.log('Form data being sent for update:', formData);
      console.log('Commands specifically:', formData.commands);
      
      const result = await updateChatbot(params.id as string, formData);
      
      if (result.success) {
        toast.success('Chatbot updated successfully!');
        router.push('/dashboard/chatbots');
      } else {
        toast.error(result.error || 'Failed to update chatbot');
      }
    } catch (error) {
      console.error('Error updating chatbot:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep data={formData} setData={setFormData} />;
      case 1:
        return <KnowledgeBaseStep data={formData} setData={setFormData} />;
      case 2:
        return <ChatConfigStep data={formData} setData={setFormData} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">Loading chatbot...</h3>
          <p className="text-muted-foreground">Please wait while we fetch your chatbot data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/chatbots">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft size={16} />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Edit Chatbot</h1>
              <p className="text-muted-foreground mt-1">Update your AI-powered chatbot configuration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Wizard */}
          <div className="lg:col-span-2">
            {/* Step Navigation */}
            <div className="mb-8 space-y-2">
              {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center pt-1">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all ${
                          isCompleted
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                            : isActive
                            ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 size={20} /> : index + 1}
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-1 h-12 mt-2 ${isCompleted ? 'bg-green-200 dark:bg-green-800' : 'bg-border'}`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${isActive ? 'text-primary' : isCompleted ? 'text-green-700 dark:text-green-200' : 'text-muted-foreground'}`}>
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {index === 0 && 'Update your chatbot basic information'}
                        {index === 1 && 'Manage your knowledge base'}
                        {index === 2 && 'Configure chatbot behavior'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step Content */}
            <div className="bg-card rounded-xl border border-border p-8 shadow-sm min-h-[500px] animate-in fade-in duration-300">
              {renderStepContent()}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center gap-4 mt-8">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                variant="outline"
                className="px-6"
              >
                Previous
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button 
                  onClick={handleNext} 
                  disabled={!validateCurrentStep()} 
                  className="px-6 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  Next <ChevronRight size={18} />
                </Button>
              ) : (
                <Button
                  onClick={handleUpdateChatbot}
                  disabled={isUpdating}
                  className="px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Chatbot'
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Right: Preview Panel (Sticky) */}
          <div className="lg:col-span-1">
            <PreviewPanel data={formData} />
          </div>
        </div>
      </div>
    </div>
  );
}
