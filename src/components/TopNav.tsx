import React from 'react';
import { Eye, Edit3, Download, HelpCircle, Laptop, Tablet, Smartphone } from 'lucide-react';

interface TopNavProps {
  authorName: string;
  activeTab: 'preview' | 'editor';
  onTabChange: (tab: 'preview' | 'editor') => void;
  viewportMode: 'desktop' | 'tablet' | 'mobile';
  onViewportChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  onOpenExportModal: () => void;
  onOpenGuideModal: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  authorName,
  activeTab,
  onTabChange,
  viewportMode,
  onViewportChange,
  onOpenExportModal,
  onOpenGuideModal,
}) => {
  return (
    <header className="sticky top-0 z-50 h-14 bg-[#FDFDFC]/95 backdrop-blur-md border-b border-[#E3DFD7] px-4 md:px-8 flex items-center justify-between transition-colors">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onTabChange('preview');
          }}
          className="text-base font-semibold tracking-tight text-[#141314] hover:text-[#C15A38] transition-colors"
        >
          {authorName}
        </a>
        <span className="hidden sm:inline-block text-xs font-serif-display italic text-[#8a857e]">
          Portfolio Studio
        </span>
      </div>

      {/* Zone 2: Navigation & Viewport Segmented Controls */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Main Tab Switcher */}
        <div className="flex items-center p-0.5 bg-[#EDEAE4] rounded-lg">
          <button
            type="button"
            onClick={() => onTabChange('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeTab === 'preview'
                ? 'bg-white text-[#141314] shadow-xs'
                : 'text-[#4a4642] hover:text-[#141314]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Site</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeTab === 'editor'
                ? 'bg-white text-[#141314] shadow-xs'
                : 'text-[#4a4642] hover:text-[#141314]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Projects</span>
          </button>
        </div>

        {/* Viewport switcher (when in preview mode) */}
        {activeTab === 'preview' && (
          <div className="hidden lg:flex items-center p-0.5 bg-[#EDEAE4] rounded-lg">
            <button
              type="button"
              onClick={() => onViewportChange('desktop')}
              title="Desktop View (1440px)"
              aria-label="Desktop View"
              className={`p-1.5 rounded-md transition-all ${
                viewportMode === 'desktop'
                  ? 'bg-white text-[#141314] shadow-xs'
                  : 'text-[#8a857e] hover:text-[#141314]'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewportChange('tablet')}
              title="Tablet View (768px)"
              aria-label="Tablet View"
              className={`p-1.5 rounded-md transition-all ${
                viewportMode === 'tablet'
                  ? 'bg-white text-[#141314] shadow-xs'
                  : 'text-[#8a857e] hover:text-[#141314]'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewportChange('mobile')}
              title="Mobile View (390px)"
              aria-label="Mobile View"
              className={`p-1.5 rounded-md transition-all ${
                viewportMode === 'mobile'
                  ? 'bg-white text-[#141314] shadow-xs'
                  : 'text-[#8a857e] hover:text-[#141314]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Format & Sizing Guide Button */}
        <button
          type="button"
          onClick={onOpenGuideModal}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#4a4642] hover:text-[#141314] hover:bg-[#EDEAE4]/50 rounded-lg transition-colors whitespace-nowrap"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#C15A38]" />
          <span>Format & Size Guide</span>
        </button>
      </div>

      {/* Zone 3: Primary Action (GitHub Export Hub) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenExportModal}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-white bg-[#141314] hover:bg-[#2b292b] rounded-lg transition-colors shadow-xs whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export for GitHub</span>
        </button>
      </div>
    </header>
  );
};
