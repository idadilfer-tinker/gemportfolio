import React, { useState, useEffect } from 'react';
import { initialPortfolioData } from './data/initialData';
import { PortfolioData } from './types/portfolio';
import { TopNav } from './components/TopNav';
import { HomeView } from './components/HomeView';
import { CaseStudyView } from './components/CaseStudyView';
import { ProjectEditor } from './components/Editor/ProjectEditor';
import { GeneralSettings } from './components/Editor/GeneralSettings';
import { FormatGuideModal } from './components/FormatGuideModal';
import { GitHubExportModal } from './components/GitHubExportModal';
import { Settings, Sliders, Eye, Sparkles, HelpCircle, Download } from 'lucide-react';

const STORAGE_KEY = 'ida_dilfer_portfolio_data_v1';

export default function App() {
  // Load data from localStorage or fallback to initial portfolio data
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }
    return initialPortfolioData;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not write to localStorage:', e);
    }
  }, [data]);

  // App state
  const [activeTab, setActiveTab] = useState<'preview' | 'editor'>('preview');
  const [previewView, setPreviewView] = useState<'home' | 'case-study'>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(data.projects[0]?.id || 'proj-01-oia');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [editorSubTab, setEditorSubTab] = useState<'projects' | 'settings'>('projects');

  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Active project for case study
  const currentProject = data.projects.find((p) => p.id === selectedProjectId) || data.projects[0];

  const handleSelectProjectForCaseStudy = (projectId: string) => {
    setSelectedProjectId(projectId);
    setPreviewView('case-study');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditProjectFromCard = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveTab('editor');
    setEditorSubTab('projects');
  };

  const handlePreviewCaseStudy = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveTab('preview');
    setPreviewView('case-study');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-[#141314] flex flex-col antialiased selection:bg-[#C15A38]/20 selection:text-[#141314]">
      {/* Top Bar Contract (3 zones, single wordmark, clean controls) */}
      <TopNav
        authorName={data.author.name}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'preview') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        viewportMode={viewportMode}
        onViewportChange={setViewportMode}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'preview' ? (
          /* ========================================================
             PREVIEW MODE (Live Home Reel or Isaac Blankensmith Case Study)
             ======================================================== */
          <div className="w-full flex justify-center bg-[#F7F6F3] min-h-[calc(100vh-56px)]">
            <div
              className={`w-full transition-all duration-300 ${
                viewportMode === 'mobile'
                  ? 'max-w-[400px] my-6 rounded-2xl shadow-xl border border-[#E3DFD7] overflow-hidden bg-[#FDFDFC]'
                  : viewportMode === 'tablet'
                  ? 'max-w-[780px] my-6 rounded-2xl shadow-xl border border-[#E3DFD7] overflow-hidden bg-[#FDFDFC]'
                  : 'max-w-full bg-[#FDFDFC]'
              }`}
            >
              {previewView === 'home' ? (
                <HomeView
                  data={data}
                  onSelectProject={handleSelectProjectForCaseStudy}
                  onEditProject={handleEditProjectFromCard}
                />
              ) : (
                <CaseStudyView
                  project={currentProject}
                  data={data}
                  onBackToPortfolio={() => {
                    setPreviewView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onEditProject={handleEditProjectFromCard}
                />
              )}
            </div>
          </div>
        ) : (
          /* ========================================================
             EDITOR / STUDIO MODE (Media upload, format validation, copy editing)
             ======================================================== */
          <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-8 space-y-6">
            {/* Editor Sub-Navigation Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DFD7]">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-[#141314]">
                  Portfolio Content & Asset Studio
                </h1>
                <p className="text-xs text-[#8a857e] mt-0.5">
                  Freely upload video, audio, visual, and text files with real-time format & size recommendations for GitHub.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center p-1 bg-[#EDEAE4] rounded-lg">
                  <button
                    type="button"
                    onClick={() => setEditorSubTab('projects')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      editorSubTab === 'projects'
                        ? 'bg-white text-[#141314] shadow-xs'
                        : 'text-[#4a4642] hover:text-[#141314]'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Projects & Case Studies</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorSubTab('settings')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      editorSubTab === 'settings'
                        ? 'bg-white text-[#141314] shadow-xs'
                        : 'text-[#4a4642] hover:text-[#141314]'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>General Settings</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsGuideModalOpen(true)}
                  className="p-2 text-[#4a4642] hover:text-[#141314] bg-white border border-[#E3DFD7] rounded-lg hover:border-[#141314] transition-colors"
                  title="View format & size guide"
                >
                  <HelpCircle className="w-4 h-4 text-[#C15A38]" />
                </button>
              </div>
            </div>

            {/* Active Editor Panel */}
            {editorSubTab === 'projects' ? (
              <ProjectEditor
                projects={data.projects}
                selectedProjectId={selectedProjectId}
                onSelectProject={setSelectedProjectId}
                onUpdateProjects={(updated) => setData({ ...data, projects: updated })}
                onPreviewProject={handlePreviewCaseStudy}
              />
            ) : (
              <GeneralSettings
                author={data.author}
                onChange={(updatedAuthor) => setData({ ...data, author: updatedAuthor })}
              />
            )}
          </div>
        )}
      </main>

      {/* Format & Sizing Guide Modal */}
      <FormatGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* GitHub Pages Exporter & Deployment Hub Modal */}
      <GitHubExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={data}
        onImportData={(imported) => {
          setData(imported);
          setSelectedProjectId(imported.projects[0]?.id || '');
        }}
        onResetData={() => {
          setData(initialPortfolioData);
          setSelectedProjectId(initialPortfolioData.projects[0]?.id || '');
        }}
      />
    </div>
  );
}
