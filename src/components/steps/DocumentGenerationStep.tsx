import React, { useState } from 'react';
import { EventMenu } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CalendarDays, CheckCircle, Coffee, Download, FileText, Globe2, MapPin, Palette, Utensils, ClipboardList } from 'lucide-react';
import { generateEventMenuPDF, generateChefKitchenPDF } from '@/services/pdfExportService';
import { generateEventMenuDOCX } from '@/services/docxExportService';
import { saveEventMenu } from '@/services/localAdminService';

type DocumentType = 'pdf-en' | 'pdf-ta' | 'pdf-chef-ta' | 'docx-en' | 'docx-ta';

interface DocumentGenerationStepProps {
  menu: EventMenu;
  onPrevious: () => void;
  onStartNewEvent?: () => void;
}

export const DocumentGenerationStep: React.FC<DocumentGenerationStepProps> = ({ menu, onPrevious, onStartNewEvent }) => {
  const [generating, setGenerating] = useState<DocumentType | null>(null);
  const [generated, setGenerated] = useState<DocumentType[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async (type: DocumentType) => {
    setGenerating(type);
    setErrorMessage(null);

    try {
      saveEventMenu(menu);
      if (type === 'pdf-en') {
        await generateEventMenuPDF(menu, 'en');
      } else if (type === 'pdf-ta') {
        await generateEventMenuPDF(menu, 'ta');
      } else if (type === 'pdf-chef-ta') {
        await generateChefKitchenPDF(menu);
      } else if (type === 'docx-en') {
        await generateEventMenuDOCX(menu, 'en');
      } else if (type === 'docx-ta') {
        await generateEventMenuDOCX(menu, 'ta');
      }

      setGenerated([...generated, type]);
    } catch (error) {
      console.error('Error generating document:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setGenerating(null);
    }
  };

  const documents = [
    {
      id: 'pdf-chef-ta' as DocumentType,
      label: "Chef's Kitchen Sheet (Tamil PDF)",
      labelTa: "சமையல் தயாரிப்பு பட்டியல் (விலை விவரங்கள் இன்றி)",
      description: "Dedicated preparation sheet in authentic Tamil for cooks & kitchen staff with exact headcounts & timings. Completely excludes pricing.",
      icon: Utensils,
      gradient: 'from-amber-600 via-orange-600 to-amber-700',
      badge: "Chef Special · Zero Pricing",
    },
    {
      id: 'pdf-ta' as DocumentType,
      label: 'Tamil PDF Client Menu',
      labelTa: 'தமிழ் PDF மேற்கோள்',
      description: "Formal catering quotation in Tamil with rates, counts and financial summary.",
      icon: FileText,
      gradient: 'from-rose-500 to-pink-600',
      badge: "Client Quotation",
    },
    {
      id: 'pdf-en' as DocumentType,
      label: 'English PDF Client Menu',
      labelTa: 'ஆங்கில PDF மேற்கோள்',
      description: "Formal catering quotation in English with rates and terms.",
      icon: FileText,
      gradient: 'from-pink-500 to-rose-500',
      badge: "Client Quotation",
    },
    {
      id: 'docx-ta' as DocumentType,
      label: 'Tamil Word Document',
      labelTa: 'தமிழ் Word ஆவணம்',
      description: "Fully editable Word document with authentic Latha Tamil font.",
      icon: FileText,
      gradient: 'from-rose-400 to-pink-500',
      badge: "Editable DOCX",
    },
    {
      id: 'docx-en' as DocumentType,
      label: 'English Word Document',
      labelTa: 'ஆங்கில Word ஆவணம்',
      description: "Fully editable Word document with standard BKR layout.",
      icon: FileText,
      gradient: 'from-pink-400 to-rose-400',
      badge: "Editable DOCX",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="planner-step-panel bg-white rounded-xl shadow-lg border border-pink-200 overflow-hidden">
        <div className="planner-step-banner p-6 text-white">
          <h2 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <Download className="h-7 w-7" aria-hidden="true" />
            Generate Documents | ஆவணங்களை உருவாக்கவும்
          </h2>
          <p className="text-pink-100 text-lg">Download your event menu in multiple formats</p>
        </div>
      </div>

      {errorMessage && (
        <div role="alert" className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Document could not be generated</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Live Counter & Custom Service Announcement Pill */}
      {menu.customMention && (
        <div className="p-4 rounded-xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 shadow-sm flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-amber-600 text-white shrink-0 shadow-sm">
            <Coffee className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Live Counter & Service Notice / நேரடி கவுண்டர் அறிவிப்பு
              </span>
              <Badge className="bg-amber-200 text-amber-900 border-amber-300 text-[10px] px-1.5 py-0 font-bold">
                Printed on Top of All Menus & Chef Sheet
              </Badge>
            </div>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              &ldquo;{menu.customMention}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* Document Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc) => {
          const isGenerated = generated.includes(doc.id);
          const isGenerating = generating === doc.id;

          return (
            <div key={doc.id} className="planner-document-card bg-white rounded-xl shadow-lg border-2 border-pink-200 overflow-hidden hover:border-pink-400 transition-all flex flex-col justify-between">
              <div className={`bg-gradient-to-r ${doc.gradient} p-5 text-white`}>
                <div className="flex items-start gap-3">
                  <div className="planner-document-icon p-2 bg-white/10 rounded-lg shrink-0">
                    <doc.icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-xl font-bold leading-tight">{doc.label}</h3>
                      {doc.badge && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                          {doc.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm opacity-95 font-medium">{doc.labelTa}</p>
                    <p className="text-xs opacity-85 mt-1.5 leading-relaxed">{doc.description}</p>
                  </div>
                  {isGenerated && (
                    <div className="planner-generated-mark bg-white/20 backdrop-blur-sm rounded-full p-2 shrink-0">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5">
                <Button
                  onClick={() => handleGenerate(doc.id)}
                  disabled={isGenerating}
                  className={`w-full h-12 text-base font-semibold rounded-lg shadow-md transition-all ${
                    isGenerated
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                      : `bg-gradient-to-r ${doc.gradient} hover:opacity-90 text-white`
                  }`}
                >
                  <Download className="h-5 w-5 mr-2" />
                  {isGenerating ? 'Generating...' : isGenerated ? 'Download Again' : 'Generate & Download'}
                </Button>

                {isGenerated && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg border-2 border-green-200">
                    <p className="text-green-700 font-semibold flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4" />
                      Successfully generated!
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Features Info */}
      <div className="planner-step-panel bg-white rounded-xl shadow-lg border border-pink-200 overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-5 text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <ClipboardList className="h-5 w-5" aria-hidden="true" />
            Document Features
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg">
              <Palette className="planner-feature-icon h-5 w-5" aria-hidden="true" />
              <div>
                <p className="font-bold text-gray-800 text-sm">Professional Design</p>
                <p className="text-xs text-gray-600">BKR branded header with logo</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg">
              <ClipboardList className="planner-feature-icon h-5 w-5" aria-hidden="true" />
              <div>
                <p className="font-bold text-gray-800 text-sm">Complete Details</p>
                <p className="text-xs text-gray-600">Client, venue & event information</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg">
              <CalendarDays className="planner-feature-icon h-5 w-5" aria-hidden="true" />
              <div>
                <p className="font-bold text-gray-800 text-sm">Day-wise Sessions</p>
                <p className="text-xs text-gray-600">Organized by day and time slots</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg">
              <Globe2 className="planner-feature-icon h-5 w-5" aria-hidden="true" />
              <div>
                <p className="font-bold text-gray-800 text-sm">Bilingual Support</p>
                <p className="text-xs text-gray-600">Word menus follow the BKR reference template with Latha Tamil text; rates and counts stay in English</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg">
              <Utensils className="planner-feature-icon h-5 w-5" aria-hidden="true" />
              <div>
                <p className="font-bold text-gray-800 text-sm">Menu Items</p>
                <p className="text-xs text-gray-600">All selected dishes with names</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg">
              <MapPin className="planner-feature-icon h-5 w-5" aria-hidden="true" />
              <div>
                <p className="font-bold text-gray-800 text-sm">Location Details</p>
                <p className="text-xs text-gray-600">Address & Google Maps link</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-5 border border-pink-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onPrevious}
            className="flex-1 h-12 text-base font-semibold rounded-lg border-2 border-pink-300 hover:bg-pink-50"
          >
            ← Back to Review
          </Button>
          {onStartNewEvent && (
            <Button
              onClick={onStartNewEvent}
              className="flex-1 h-12 text-base font-semibold rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              ✨ Create Another Event | புதிய நிகழ்வு
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
