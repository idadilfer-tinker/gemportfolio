import React, { useState } from 'react';
import { Project } from '../../types/portfolio';
import { MediaUploader } from './MediaUploader';
import { AudioUploader } from './AudioUploader';
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Layers,
  FileText,
  Sliders,
  Sparkles,
  Upload,
} from 'lucide-react';

interface ProjectEditorProps {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  onUpdateProjects: (updated: Project[]) => void;
  onPreviewProject: (id: string) => void;
}

export const ProjectEditor: React.FC<ProjectEditorProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onUpdateProjects,
  onPreviewProject,
}) => {
  const currentProjectIndex = projects.findIndex((p) => p.id === selectedProjectId);
  const activeProject = projects[currentProjectIndex] || projects[0];

  const [activeSectionTab, setActiveSectionTab] = useState<
    'home-card' | 'case-study-hero' | 'challenge' | 'approach' | 'built' | 'outcome' | 'audio'
  >('home-card');

  // Helpers to update active project
  const updateActiveProject = (updater: (prev: Project) => Project) => {
    const updated = projects.map((p) => (p.id === activeProject.id ? updater(p) : p));
    onUpdateProjects(updated);
  };

  const handleAddProject = () => {
    const newId = `proj-${Date.now()}`;
    const newSlug = `new-project-${projects.length + 1}`;
    const newProj: Project = {
      id: newId,
      slug: newSlug,
      title: 'New Case Study',
      meta: 'Product Design · Web · 2026 · Lead Designer',
      description1:
        'A concise summary of the product challenge and target users in two conversational sentences.',
      description2:
        'One sentence detailing your exact role, execution, and the primary technical or design bottleneck solved.',
      homeMedia: {
        type: 'image',
        url: '/src/assets/images/candid_mobile_in_hand_1790349802556.jpg',
        alt: 'Editorial preview of the project',
        label: `assets/home/${newSlug}.jpg  ·  4:3`,
        aspectRatio: '4:3',
      },
      hasCaseStudy: true,
      caseStudy: {
        eyebrow: 'Design Leadership · 2026',
        title: 'New Case Study',
        dek: 'One or two sentences summarizing what you were brought in to do and the shipped commercial outcome.',
        meta: {
          role: 'Lead Product Designer',
          year: '2026',
          type: '0→1 Shipped',
          status: 'Live',
        },
        audio: {
          enabled: false,
          url: '',
          label: 'Audio description',
          transcript: {
            challenge: 'Summary of the initial discovery research and clinical or user problem.',
            approach: 'Methodology, key architectural decisions, and principles applied.',
            built: 'Concrete shipped output across web and mobile platforms.',
          },
        },
        challenge: {
          label: 'The challenge',
          headline: 'A short italic framing line summarizing the central conflict.',
          body: 'The problem, the research finding, and why it mattered. <b>Bold the primary finding or metric</b> to anchor the reader.',
          media: {
            type: 'image',
            url: '/src/assets/images/candid_mobile_in_hand_1790349802556.jpg',
            alt: 'Screen demonstration of the challenge',
            screenName: 'Problem State & Audit',
            caption: 'Initial usability friction and architectural drop-off points before redesign.',
            aspectRatio: '4:3',
          },
        },
        approach: {
          label: 'My approach',
          headline: 'A short italic framing line explaining the strategic intervention.',
          body: 'Process and methodology: how it was solved, key user testing insights, and design system decisions applied.',
          media: {
            type: 'image',
            url: '/src/assets/images/candid_mobile_in_hand_1790349802556.jpg',
            alt: 'Screen demonstration of the approach',
            screenName: 'Design Architecture Flow',
            caption: 'Iterative prototypes tested across 30+ participant user interviews.',
            aspectRatio: '4:3',
          },
        },
        built: {
          label: 'What I built',
          headline: 'A short italic framing line describing the final shipped surface.',
          body: 'The concrete shipped output: features, screens, responsive breakpoints, and current live status.',
          media: {
            type: 'image',
            url: '/src/assets/images/candid_mobile_in_hand_1790349802556.jpg',
            alt: 'Screen demonstration of final product',
            screenName: 'Final Shipped Interface',
            caption: 'High-contrast production screens built with accessible design tokens.',
            aspectRatio: '4:3',
          },
        },
        outcome: {
          metrics: [
            { num: 'Live', label: 'Shipped to production' },
            { num: '+45%', label: 'Key conversion or satisfaction metric' },
            { num: '0→1', label: 'End-to-end design and architecture' },
          ],
          callout:
            'A compelling one-line pull quote that encapsulates the transformative business outcome.',
        },
      },
    };

    onUpdateProjects([...projects, newProj]);
    onSelectProject(newId);
  };

  const handleDuplicateProject = (proj: Project) => {
    const dup: Project = {
      ...JSON.parse(JSON.stringify(proj)),
      id: `proj-${Date.now()}`,
      slug: `${proj.slug}-copy`,
      title: `${proj.title} (Copy)`,
    };
    onUpdateProjects([...projects, dup]);
    onSelectProject(dup.id);
  };

  const handleDeleteProject = (projId: string) => {
    if (projects.length <= 1) {
      alert('You must keep at least one project in your portfolio.');
      return;
    }
    if (confirm('Are you sure you want to remove this project?')) {
      const remaining = projects.filter((p) => p.id !== projId);
      onUpdateProjects(remaining);
      onSelectProject(remaining[0].id);
    }
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;
    const reordered = [...projects];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    onUpdateProjects(reordered);
  };

  // Import text/markdown file directly into the current case study
  const handleImportTextFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (!content) return;

      // Extract lines or sections
      updateActiveProject((prev) => ({
        ...prev,
        description1: content.slice(0, 240),
        caseStudy: {
          ...prev.caseStudy,
          challenge: {
            ...prev.caseStudy.challenge,
            body: content.slice(0, 400),
          },
        },
      }));
      alert(`Imported ${file.name} successfully into case study draft.`);
    };
    reader.readAsText(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
      {/* Sidebar: Project Navigation & Reordering */}
      <aside className="bg-white rounded-2xl border border-[#E3DFD7] p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#C15A38]" />
            <h3 className="text-xs font-semibold text-[#141314] uppercase tracking-wider">
              Projects ({projects.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={handleAddProject}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#141314] hover:bg-[#2b292b] text-white text-xs font-medium rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Project List */}
        <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
          {projects.map((proj, idx) => {
            const isSelected = proj.id === activeProject.id;
            return (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj.id)}
                className={`group flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#F5F2EC] border-[#C15A38] text-[#141314] font-medium'
                    : 'bg-white border-[#EDEAE4] hover:border-[#E3DFD7] text-[#4a4642]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="font-mono text-[10px] text-[#8a857e]">
                    0{idx + 1}
                  </span>
                  <span className="truncate">{proj.title}</span>
                </div>

                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    title="Move Up"
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveProject(idx, 'up');
                    }}
                    className="p-0.5 hover:text-[#C15A38] disabled:opacity-20"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Move Down"
                    disabled={idx === projects.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveProject(idx, 'down');
                    }}
                    className="p-0.5 hover:text-[#C15A38] disabled:opacity-20"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions for Selected Project */}
        <div className="pt-3 border-t border-[#EDEAE4] space-y-2">
          <div className="text-[11px] font-medium text-[#8a857e]">
            Selected: <span className="text-[#141314]">{activeProject.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPreviewProject(activeProject.id)}
              className="flex-1 py-1.5 px-2 bg-[#F5F2EC] hover:bg-[#EDEAE4] text-xs font-medium text-[#141314] rounded-lg transition-colors text-center"
            >
              Preview Case Study
            </button>
            <button
              type="button"
              title="Duplicate Project"
              onClick={() => handleDuplicateProject(activeProject)}
              className="p-2 border border-[#E3DFD7] hover:bg-[#F5F2EC] rounded-lg text-[#4a4642] transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              title="Delete Project"
              onClick={() => handleDeleteProject(activeProject.id)}
              className="p-2 border border-[#E3DFD7] hover:bg-red-50 hover:border-red-200 text-red-600 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Text/Markdown File Importer */}
          <div className="pt-2">
            <label className="flex items-center justify-center gap-1.5 p-2 border border-dashed border-[#E3DFD7] hover:border-[#C15A38] rounded-lg text-[11px] text-[#4a4642] cursor-pointer bg-white transition-colors">
              <Upload className="w-3 h-3 text-[#C15A38]" />
              <span>Import Draft (.txt/.md)</span>
              <input
                type="file"
                accept=".txt,.md,.markdown"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImportTextFile(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
        </div>
      </aside>

      {/* Main Form: Active Project Deep Dive Editor */}
      <main className="bg-white rounded-2xl border border-[#E3DFD7] p-5 sm:p-7 space-y-6">
        {/* Editor Section Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#F5F2EC] rounded-xl overflow-x-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveSectionTab('home-card')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeSectionTab === 'home-card'
                ? 'bg-white text-[#141314] shadow-xs font-semibold'
                : 'text-[#4a4642] hover:text-[#141314]'
            }`}
          >
            Home Reel Card
          </button>
          <button
            type="button"
            onClick={() => setActiveSectionTab('case-study-hero')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeSectionTab === 'case-study-hero'
                ? 'bg-white text-[#141314] shadow-xs font-semibold'
                : 'text-[#4a4642] hover:text-[#141314]'
            }`}
          >
            Case Study Hero
          </button>
          <button
            type="button"
            onClick={() => setActiveSectionTab('audio')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeSectionTab === 'audio'
                ? 'bg-white text-[#141314] shadow-xs font-semibold'
                : 'text-[#4a4642] hover:text-[#141314]'
            }`}
          >
            Audio Narration
          </button>
          <button
            type="button"
            onClick={() => setActiveSectionTab('challenge')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeSectionTab === 'challenge'
                ? 'bg-white text-[#141314] shadow-xs font-semibold'
                : 'text-[#4a4642] hover:text-[#141314]'
            }`}
          >
            1. Challenge
          </button>
          <button
            type="button"
            onClick={() => setActiveSectionTab('approach')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeSectionTab === 'approach'
                ? 'bg-white text-[#141314] shadow-xs font-semibold'
                : 'text-[#4a4642] hover:text-[#141314]'
            }`}
          >
            2. Approach
          </button>
          <button
            type="button"
            onClick={() => setActiveSectionTab('built')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeSectionTab === 'built'
                ? 'bg-white text-[#141314] shadow-xs font-semibold'
                : 'text-[#4a4642] hover:text-[#141314]'
            }`}
          >
            3. What I Built
          </button>
          <button
            type="button"
            onClick={() => setActiveSectionTab('outcome')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeSectionTab === 'outcome'
                ? 'bg-white text-[#141314] shadow-xs font-semibold'
                : 'text-[#4a4642] hover:text-[#141314]'
            }`}
          >
            Outcome
          </button>
        </div>

        {/* TAB 1: Home Reel Card */}
        {activeSectionTab === 'home-card' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                  Project Title
                </label>
                <input
                  type="text"
                  value={activeProject.title}
                  onChange={(e) =>
                    updateActiveProject((p) => ({
                      ...p,
                      title: e.target.value,
                      caseStudy: { ...p.caseStudy, title: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                  URL Slug (GitHub HTML filename)
                </label>
                <input
                  type="text"
                  value={activeProject.slug}
                  onChange={(e) =>
                    updateActiveProject((p) => ({
                      ...p,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
                    }))
                  }
                  placeholder="e.g. oia, vccp, connectd"
                  className="w-full px-3.5 py-2 text-sm font-mono bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
                />
                <div className="text-[10.5px] text-[#8a857e] mt-1">
                  Will generate: <code>projects/{activeProject.slug}.html</code>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                Meta Line (Category · Platforms · Year · Role)
              </label>
              <input
                type="text"
                value={activeProject.meta}
                onChange={(e) =>
                  updateActiveProject((p) => ({ ...p, meta: e.target.value }))
                }
                placeholder="e.g. AI surgery planner · Web and WhatsApp · 2026 · Founder"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
              />
            </div>

            {/* Home Media Uploader (4:3 ratio guidelines) */}
            <div className="pt-2 border-t border-[#EDEAE4]">
              <MediaUploader
                label="Home Reel Card Visual"
                recommendedSlot="home"
                allowVideo={true}
                asset={activeProject.homeMedia}
                onChange={(updated) =>
                  updateActiveProject((p) => ({ ...p, homeMedia: updated }))
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                Description Paragraph 1 (What this is and who it is for)
              </label>
              <textarea
                rows={3}
                value={activeProject.description1}
                onChange={(e) =>
                  updateActiveProject((p) => ({ ...p, description1: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38] leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                Description Paragraph 2 (Role and hardest thing solved)
              </label>
              <textarea
                rows={2}
                value={activeProject.description2}
                onChange={(e) =>
                  updateActiveProject((p) => ({ ...p, description2: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38] leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                  External Live Website URL (Optional)
                </label>
                <input
                  type="text"
                  value={activeProject.externalWebsiteUrl || ''}
                  onChange={(e) =>
                    updateActiveProject((p) => ({
                      ...p,
                      externalWebsiteUrl: e.target.value,
                    }))
                  }
                  placeholder="https://heyoia.com"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                  Press or Coverage Link (Optional)
                </label>
                <input
                  type="text"
                  value={activeProject.pressUrl || ''}
                  onChange={(e) =>
                    updateActiveProject((p) => ({
                      ...p,
                      pressUrl: e.target.value,
                    }))
                  }
                  placeholder="https://techcrunch.com/..."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Case Study Hero & 4-Column Metadata */}
        {activeSectionTab === 'case-study-hero' && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                Category Eyebrow
              </label>
              <input
                type="text"
                value={activeProject.caseStudy.eyebrow}
                onChange={(e) =>
                  updateActiveProject((p) => ({
                    ...p,
                    caseStudy: { ...p.caseStudy, eyebrow: e.target.value },
                  }))
                }
                placeholder="e.g. AI Concierge · Health-tech · 2026"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                Case Study Dek / Summary
              </label>
              <textarea
                rows={3}
                value={activeProject.caseStudy.dek}
                onChange={(e) =>
                  updateActiveProject((p) => ({
                    ...p,
                    caseStudy: { ...p.caseStudy, dek: e.target.value },
                  }))
                }
                placeholder="One or two sentences: what you were brought in to do and the outcome. No em dashes."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
              />
            </div>

            <div className="border-t border-[#EDEAE4] pt-4">
              <h4 className="text-xs font-semibold text-[#141314] uppercase tracking-wider mb-3">
                4-Column Meta Bar
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#8a857e] mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value={activeProject.caseStudy.meta.role}
                    onChange={(e) =>
                      updateActiveProject((p) => ({
                        ...p,
                        caseStudy: {
                          ...p.caseStudy,
                          meta: { ...p.caseStudy.meta, role: e.target.value },
                        },
                      }))
                    }
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#8a857e] mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    value={activeProject.caseStudy.meta.year}
                    onChange={(e) =>
                      updateActiveProject((p) => ({
                        ...p,
                        caseStudy: {
                          ...p.caseStudy,
                          meta: { ...p.caseStudy.meta, year: e.target.value },
                        },
                      }))
                    }
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#8a857e] mb-1">
                    Type
                  </label>
                  <input
                    type="text"
                    value={activeProject.caseStudy.meta.type}
                    onChange={(e) =>
                      updateActiveProject((p) => ({
                        ...p,
                        caseStudy: {
                          ...p.caseStudy,
                          meta: { ...p.caseStudy.meta, type: e.target.value },
                        },
                      }))
                    }
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#8a857e] mb-1">
                    Status
                  </label>
                  <input
                    type="text"
                    value={activeProject.caseStudy.meta.status}
                    onChange={(e) =>
                      updateActiveProject((p) => ({
                        ...p,
                        caseStudy: {
                          ...p.caseStudy,
                          meta: { ...p.caseStudy.meta, status: e.target.value },
                        },
                      }))
                    }
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Audio Narration & Synchronized Transcript */}
        {activeSectionTab === 'audio' && (
          <AudioUploader
            audio={activeProject.caseStudy.audio}
            projectSlug={activeProject.slug}
            onChange={(updatedAudio) =>
              updateActiveProject((p) => ({
                ...p,
                caseStudy: { ...p.caseStudy, audio: updatedAudio },
              }))
            }
          />
        )}

        {/* TAB 4: Section 1 — The Challenge */}
        {activeSectionTab === 'challenge' && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                Section Label
              </label>
              <input
                type="text"
                value={activeProject.caseStudy.challenge.label}
                onChange={(e) =>
                  updateActiveProject((p) => ({
                    ...p,
                    caseStudy: {
                      ...p.caseStudy,
                      challenge: {
                        ...p.caseStudy.challenge,
                        label: e.target.value,
                      },
                    },
                  }))
                }
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                Framing Italic Headline
              </label>
              <input
                type="text"
                value={activeProject.caseStudy.challenge.headline}
                onChange={(e) =>
                  updateActiveProject((p) => ({
                    ...p,
                    caseStudy: {
                      ...p.caseStudy,
                      challenge: {
                        ...p.caseStudy.challenge,
                        headline: e.target.value,
                      },
                    },
                  }))
                }
                placeholder="Short italic framing line"
                className="w-full px-3.5 py-2 text-sm font-serif-display italic bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                Narrative Body (HTML or Bold lead-ins supported)
              </label>
              <textarea
                rows={4}
                value={activeProject.caseStudy.challenge.body}
                onChange={(e) =>
                  updateActiveProject((p) => ({
                    ...p,
                    caseStudy: {
                      ...p.caseStudy,
                      challenge: {
                        ...p.caseStudy.challenge,
                        body: e.target.value,
                      },
                    },
                  }))
                }
                placeholder="The problem, the research finding, why it mattered. Use <b>bold</b> for the key phrase."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38] leading-relaxed"
              />
            </div>

            {/* Proof Figure Media Uploader */}
            <div className="pt-2 border-t border-[#EDEAE4]">
              <MediaUploader
                label="Proof Media 1 (Single Full-Bleed Figure)"
                recommendedSlot="case-study"
                allowVideo={true}
                asset={activeProject.caseStudy.challenge.media}
                onChange={(updatedMedia) =>
                  updateActiveProject((p) => ({
                    ...p,
                    caseStudy: {
                      ...p.caseStudy,
                      challenge: {
                        ...p.caseStudy.challenge,
                        media: updatedMedia,
                      },
                    },
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                  Screen / Figure Name (Bold Prefix)
                </label>
                <input
                  type="text"
                  value={activeProject.caseStudy.challenge.media.screenName || ''}
                  onChange={(e) =>
                    updateActiveProject((p) => ({
                      ...p,
                      caseStudy: {
                        ...p.caseStudy,
                        challenge: {
                          ...p.caseStudy.challenge,
                          media: {
                            ...p.caseStudy.challenge.media,
                            screenName: e.target.value,
                          },
                        },
                      },
                    }))
                  }
                  placeholder="e.g. Conversational Intake Flow"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                  Caption Description
                </label>
                <input
                  type="text"
                  value={activeProject.caseStudy.challenge.media.caption || ''}
                  onChange={(e) =>
                    updateActiveProject((p) => ({
                      ...p,
                      caseStudy: {
                        ...p.caseStudy,
                        challenge: {
                          ...p.caseStudy.challenge,
                          media: {
                            ...p.caseStudy.challenge.media,
                            caption: e.target.value,
                          },
                        },
                      },
                    }))
                  }
                  placeholder="One line explaining what the screen demonstrates."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Section 2 — My Approach */}
        {activeSectionTab === 'approach' && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                Section Label
              </label>
              <input
                type="text"
                value={activeProject.caseStudy.approach.label}
                onChange={(e) =>
                  updateActiveProject((p) => ({
                    ...p,
                    caseStudy: {
                      ...p.caseStudy,
                      approach: {
                        ...p.caseStudy.approach,
                        label: e.target.value,
                      },
                    },
                  }))
                }
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                Framing Italic Headline
              </label>
              <input
                type="text"
                value={activeProject.caseStudy.approach.headline}
                onChange={(e) =>
                  updateActiveProject((p) => ({
                    ...p,
                    caseStudy: {
                      ...p.caseStudy,
                      approach: {
                        ...p.caseStudy.approach,
                        headline: e.target.value,
                      },
                    },
                  }))
                }
                placeholder="Short italic framing line"
                className="w-full px-3.5 py-2 text-sm font-serif-display italic bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                Narrative Body (Process, key decisions, brand and behaviour)
              </label>
              <textarea
                rows={4}
                value={activeProject.caseStudy.approach.body}
                onChange={(e) =>
                  updateActiveProject((p) => ({
                    ...p,
                    caseStudy: {
                      ...p.caseStudy,
                      approach: {
                        ...p.caseStudy.approach,
                        body: e.target.value,
                      },
                    },
                  }))
                }
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38] leading-relaxed"
              />
            </div>

            {/* Proof Figure Media Uploader */}
            <div className="pt-2 border-t border-[#EDEAE4]">
              <MediaUploader
                label="Proof Media 2 (Single Full-Bleed Figure)"
                recommendedSlot="case-study"
                allowVideo={true}
                asset={activeProject.caseStudy.approach.media}
                onChange={(updatedMedia) =>
                  updateActiveProject((p) => ({
                    ...p,
                    caseStudy: {
                      ...p.caseStudy,
                      approach: {
                        ...p.caseStudy.approach,
                        media: updatedMedia,
                      },
                    },
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                  Screen / Figure Name (Bold Prefix)
                </label>
                <input
                  type="text"
                  value={activeProject.caseStudy.approach.media.screenName || ''}
                  onChange={(e) =>
                    updateActiveProject((p) => ({
                      ...p,
                      caseStudy: {
                        ...p.caseStudy,
                        approach: {
                          ...p.caseStudy.approach,
                          media: {
                            ...p.caseStudy.approach.media,
                            screenName: e.target.value,
                          },
                        },
                      },
                    }))
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                  Caption Description
                </label>
                <input
                  type="text"
                  value={activeProject.caseStudy.approach.media.caption || ''}
                  onChange={(e) =>
                    updateActiveProject((p) => ({
                      ...p,
                      caseStudy: {
                        ...p.caseStudy,
                        approach: {
                          ...p.caseStudy.approach,
                          media: {
                            ...p.caseStudy.approach.media,
                            caption: e.target.value,
                          },
                        },
                      },
                    }))
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Section 3 — What I Built */}
        {activeSectionTab === 'built' && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                Section Label
              </label>
              <input
                type="text"
                value={activeProject.caseStudy.built.label}
                onChange={(e) =>
                  updateActiveProject((p) => ({
                    ...p,
                    caseStudy: {
                      ...p.caseStudy,
                      built: {
                        ...p.caseStudy.built,
                        label: e.target.value,
                      },
                    },
                  }))
                }
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                Framing Italic Headline
              </label>
              <input
                type="text"
                value={activeProject.caseStudy.built.headline}
                onChange={(e) =>
                  updateActiveProject((p) => ({
                    ...p,
                    caseStudy: {
                      ...p.caseStudy,
                      built: {
                        ...p.caseStudy.built,
                        headline: e.target.value,
                      },
                    },
                  }))
                }
                placeholder="Short italic framing line"
                className="w-full px-3.5 py-2 text-sm font-serif-display italic bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                Narrative Body (The concrete shipped output: features, screens, live status)
              </label>
              <textarea
                rows={4}
                value={activeProject.caseStudy.built.body}
                onChange={(e) =>
                  updateActiveProject((p) => ({
                    ...p,
                    caseStudy: {
                      ...p.caseStudy,
                      built: {
                        ...p.caseStudy.built,
                        body: e.target.value,
                      },
                    },
                  }))
                }
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38] leading-relaxed"
              />
            </div>

            {/* Proof Figure Media Uploader */}
            <div className="pt-2 border-t border-[#EDEAE4]">
              <MediaUploader
                label="Proof Media 3 (Single Full-Bleed Figure)"
                recommendedSlot="case-study"
                allowVideo={true}
                asset={activeProject.caseStudy.built.media}
                onChange={(updatedMedia) =>
                  updateActiveProject((p) => ({
                    ...p,
                    caseStudy: {
                      ...p.caseStudy,
                      built: {
                        ...p.caseStudy.built,
                        media: updatedMedia,
                      },
                    },
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                  Screen / Figure Name (Bold Prefix)
                </label>
                <input
                  type="text"
                  value={activeProject.caseStudy.built.media.screenName || ''}
                  onChange={(e) =>
                    updateActiveProject((p) => ({
                      ...p,
                      caseStudy: {
                        ...p.caseStudy,
                        built: {
                          ...p.caseStudy.built,
                          media: {
                            ...p.caseStudy.built.media,
                            screenName: e.target.value,
                          },
                        },
                      },
                    }))
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                  Caption Description
                </label>
                <input
                  type="text"
                  value={activeProject.caseStudy.built.media.caption || ''}
                  onChange={(e) =>
                    updateActiveProject((p) => ({
                      ...p,
                      caseStudy: {
                        ...p.caseStudy,
                        built: {
                          ...p.caseStudy.built,
                          media: {
                            ...p.caseStudy.built.media,
                            caption: e.target.value,
                          },
                        },
                      },
                    }))
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: Outcome & Metrics */}
        {activeSectionTab === 'outcome' && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#4a4642]">
                  Outcome Metrics (Up to 3-4 key numbers)
                </label>
                <button
                  type="button"
                  onClick={() =>
                    updateActiveProject((p) => ({
                      ...p,
                      caseStudy: {
                        ...p.caseStudy,
                        outcome: {
                          ...p.caseStudy.outcome,
                          metrics: [
                            ...p.caseStudy.outcome.metrics,
                            { num: 'Metric', label: 'Description' },
                          ],
                        },
                      },
                    }))
                  }
                  className="text-xs text-[#C15A38] hover:text-[#a8461f] font-medium"
                >
                  + Add Metric
                </button>
              </div>

              <div className="space-y-2.5">
                {activeProject.caseStudy.outcome.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-[#F5F2EC] rounded-xl border border-[#EDEAE4]"
                  >
                    <div className="w-1/3">
                      <label className="block text-[10px] text-[#8a857e] uppercase mb-0.5">
                        Stat / Value
                      </label>
                      <input
                        type="text"
                        value={m.num}
                        onChange={(e) => {
                          const updatedMetrics = [...activeProject.caseStudy.outcome.metrics];
                          updatedMetrics[idx].num = e.target.value;
                          updateActiveProject((p) => ({
                            ...p,
                            caseStudy: {
                              ...p.caseStudy,
                              outcome: {
                                ...p.caseStudy.outcome,
                                metrics: updatedMetrics,
                              },
                            },
                          }));
                        }}
                        placeholder="e.g. Live, 30+, -40%"
                        className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-[#E3DFD7] rounded-lg focus:outline-none"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block text-[10px] text-[#8a857e] uppercase mb-0.5">
                        Label / Context
                      </label>
                      <input
                        type="text"
                        value={m.label}
                        onChange={(e) => {
                          const updatedMetrics = [...activeProject.caseStudy.outcome.metrics];
                          updatedMetrics[idx].label = e.target.value;
                          updateActiveProject((p) => ({
                            ...p,
                            caseStudy: {
                              ...p.caseStudy,
                              outcome: {
                                ...p.caseStudy.outcome,
                                metrics: updatedMetrics,
                              },
                            },
                          }));
                        }}
                        placeholder="What this number represents"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E3DFD7] rounded-lg focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const updatedMetrics = activeProject.caseStudy.outcome.metrics.filter(
                          (_, i) => i !== idx
                        );
                        updateActiveProject((p) => ({
                          ...p,
                          caseStudy: {
                            ...p.caseStudy,
                            outcome: {
                              ...p.caseStudy.outcome,
                              metrics: updatedMetrics,
                            },
                          },
                        }));
                      }}
                      className="p-1.5 text-[#8a857e] hover:text-red-600 rounded-md transition-colors"
                      title="Remove Metric"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
                Pull Quote Callout
              </label>
              <textarea
                rows={3}
                value={activeProject.caseStudy.outcome.callout}
                onChange={(e) =>
                  updateActiveProject((p) => ({
                    ...p,
                    caseStudy: {
                      ...p.caseStudy,
                      outcome: {
                        ...p.caseStudy.outcome,
                        callout: e.target.value,
                      },
                    },
                  }))
                }
                placeholder="One-line pull quote that sums up the outcome."
                className="w-full px-3.5 py-2.5 text-sm font-serif-display italic bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
