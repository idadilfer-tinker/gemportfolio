import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { PortfolioData } from '../types/portfolio';
import {
  generateHomeHtml,
  generateCaseStudyHtml,
  generateStylesCss,
  generateCvHtml,
  generateReadme,
  generateGitHubActionsWorkflow,
} from '../utils/htmlGenerator';
import {
  testGitHubAccess,
  publishPortfolioToGitHub,
  GitHubSyncConfig,
} from '../utils/githubPublisher';
import {
  X,
  Download,
  Copy,
  Check,
  Code,
  FileCode,
  BookOpen,
  Upload,
  RefreshCw,
  FolderArchive,
  Terminal,
  Globe,
  Key,
  Send,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  ClipboardPaste,
} from 'lucide-react';

const GH_CONFIG_STORAGE_KEY = 'ida_portfolio_github_config_v1';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
  onImportData: (data: PortfolioData) => void;
  onResetData: () => void;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({
  isOpen,
  onClose,
  data,
  onImportData,
  onResetData,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<
    'direct-publish' | 'download' | 'instructions' | 'code-preview' | 'backup'
  >('direct-publish');

  const [selectedFileForPreview, setSelectedFileForPreview] = useState<string>('index.html');
  const [isCopied, setIsCopied] = useState(false);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);

  // GitHub direct publish state
  const [ghConfig, setGhConfig] = useState<GitHubSyncConfig>(() => {
    try {
      const saved = localStorage.getItem(GH_CONFIG_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      owner: 'idadilfer',
      repo: 'idadilfer.github.io',
      branch: 'main',
      token: '',
    };
  });

  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [publishProgress, setPublishProgress] = useState<{
    message: string;
    step: number;
    total: number;
    success?: boolean;
    error?: string;
  } | null>(null);

  // Save GH config locally
  useEffect(() => {
    try {
      localStorage.setItem(GH_CONFIG_STORAGE_KEY, JSON.stringify(ghConfig));
    } catch {
      // ignore
    }
  }, [ghConfig]);

  // Generate file contents
  const homeHtml = generateHomeHtml(data);
  const stylesCss = generateStylesCss();
  const cvHtml = generateCvHtml(data);
  const readmeMd = generateReadme(data);
  const jsonBackup = JSON.stringify(data, null, 2);
  const githubWorkflow = generateGitHubActionsWorkflow();

  // Map of project case study HTMLs
  const projectHtmlMap: Record<string, string> = {};
  data.projects.forEach((p) => {
    projectHtmlMap[`projects/${p.slug}.html`] = generateCaseStudyHtml(p, data);
  });

  const getAllFilesToPublish = () => {
    const files = [
      { path: 'index.html', content: homeHtml },
      { path: 'styles.css', content: stylesCss },
      { path: 'cv.html', content: cvHtml },
      { path: 'README.md', content: readmeMd },
      { path: 'portfolio-data.json', content: jsonBackup },
      { path: '.github/workflows/deploy.yml', content: githubWorkflow },
    ];

    data.projects.forEach((p) => {
      files.push({
        path: `projects/${p.slug}.html`,
        content: generateCaseStudyHtml(p, data),
      });
    });

    return files;
  };

  const getActiveCode = (): string => {
    if (selectedFileForPreview === 'index.html') return homeHtml;
    if (selectedFileForPreview === 'styles.css') return stylesCss;
    if (selectedFileForPreview === 'cv.html') return cvHtml;
    if (selectedFileForPreview === 'README.md') return readmeMd;
    if (selectedFileForPreview === 'portfolio-data.json') return jsonBackup;
    if (selectedFileForPreview === '.github/workflows/deploy.yml') return githubWorkflow;
    if (projectHtmlMap[selectedFileForPreview]) return projectHtmlMap[selectedFileForPreview];
    return homeHtml;
  };

  const handleCopyCode = () => {
    const code = getActiveCode();
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleTestConnection = async () => {
    if (!ghConfig.token.trim()) {
      setTestResult({ success: false, message: 'Please enter a GitHub Personal Access Token.' });
      return;
    }
    setIsTestingConnection(true);
    setTestResult(null);

    const res = await testGitHubAccess(ghConfig);
    setIsTestingConnection(false);
    if (res.success) {
      setTestResult({
        success: true,
        message: `Connected successfully to https://github.com/${ghConfig.owner}/${ghConfig.repo}!`,
      });
    } else {
      setTestResult({
        success: false,
        message: res.error || 'Connection failed.',
      });
    }
  };

  const handleDirectPublish = async () => {
    if (!ghConfig.token.trim()) {
      alert('Please enter your GitHub Personal Access Token first.');
      return;
    }

    try {
      setIsPublishing(true);
      setPublishProgress({ message: 'Connecting to repository...', step: 0, total: 1 });

      const files = getAllFilesToPublish();
      await publishPortfolioToGitHub(ghConfig, files, (p) => {
        setPublishProgress(p);
      });
    } catch (err: any) {
      setPublishProgress({
        message: 'Publish failed',
        step: 0,
        total: 1,
        success: false,
        error: err.message || 'Unknown network error.',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDownloadZip = async () => {
    try {
      setIsGeneratingZip(true);
      const zip = new JSZip();

      // Root files
      zip.file('index.html', homeHtml);
      zip.file('styles.css', stylesCss);
      zip.file('cv.html', cvHtml);
      zip.file('README.md', readmeMd);
      zip.file('portfolio-data.json', jsonBackup);

      // GitHub Actions workflow
      const githubFolder = zip.folder('.github');
      githubFolder?.folder('workflows')?.file('deploy.yml', githubWorkflow);

      // Projects folder
      const projectsFolder = zip.folder('projects');
      if (projectsFolder) {
        data.projects.forEach((p) => {
          projectsFolder.file(`${p.slug}.html`, generateCaseStudyHtml(p, data));
        });
      }

      // Assets folders placeholder
      const assetsFolder = zip.folder('assets');
      if (assetsFolder) {
        assetsFolder
          .folder('home')
          ?.file('README.txt', 'Place your 4:3 home project images here.\nExample: oia.jpg, vccp.jpg');
        assetsFolder
          .folder('projects')
          ?.file('README.txt', 'Place your case study proof figures or videos here.');
        assetsFolder
          .folder('audio')
          ?.file('README.txt', 'Place your voiceover narration MP3 files here.');
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ida-dilfer-portfolio-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('ZIP generation failed:', err);
      alert('Could not generate ZIP archive.');
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.author && parsed.projects) {
            onImportData(parsed);
            alert('Portfolio backup loaded successfully!');
            onClose();
          } else {
            alert('Invalid portfolio JSON format.');
          }
        } catch {
          alert('Could not parse JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141314]/50 backdrop-blur-xs">
      <div className="bg-[#FDFDFC] border border-[#E3DFD7] rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E3DFD7] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-[#C15A38]" />
            <div>
              <h2 className="text-base font-semibold text-[#141314]">
                Online GitHub Deployment & Export Hub
              </h2>
              <p className="text-xs text-[#8a857e]">
                100% Free on GitHub Pages · Zero Vercel · Zero Netlify
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#8a857e] hover:text-[#141314] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-[#EDEAE4] bg-[#F5F2EC] flex items-center gap-1 sm:gap-2 text-xs font-medium overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('direct-publish')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'direct-publish'
                ? 'border-[#C15A38] text-[#141314] font-semibold'
                : 'border-transparent text-[#4a4642] hover:text-[#141314]'
            }`}
          >
            ⚡ Publish Directly from Browser
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('download')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'download'
                ? 'border-[#C15A38] text-[#141314] font-semibold'
                : 'border-transparent text-[#4a4642] hover:text-[#141314]'
            }`}
          >
            Download ZIP Archive
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('instructions')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'instructions'
                ? 'border-[#C15A38] text-[#141314] font-semibold'
                : 'border-transparent text-[#4a4642] hover:text-[#141314]'
            }`}
          >
            GitHub Pages Setup Guide
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code-preview')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'code-preview'
                ? 'border-[#C15A38] text-[#141314] font-semibold'
                : 'border-transparent text-[#4a4642] hover:text-[#141314]'
            }`}
          >
            Code Inspector
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'backup'
                ? 'border-[#C15A38] text-[#141314] font-semibold'
                : 'border-transparent text-[#4a4642] hover:text-[#141314]'
            }`}
          >
            Backup JSON
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB: Direct Browser Publishing */}
          {activeTab === 'direct-publish' && (
            <div className="space-y-5">
              <div className="p-4 bg-white border border-[#EDEAE4] rounded-2xl space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-[#141314] flex items-center gap-2">
                      <Send className="w-4 h-4 text-[#C15A38]" />
                      <span>Publish Live to GitHub from this Online Interface</span>
                    </h3>
                    <p className="text-xs text-[#4a4642] mt-1 leading-relaxed">
                      You can push your edits directly to your GitHub repository right from this browser tab without downloading a zip or running terminal commands.
                    </p>
                  </div>

                  <a
                    href="https://github.com/settings/tokens?type=beta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#C15A38] hover:underline font-medium whitespace-nowrap flex-shrink-0"
                  >
                    <span>Create GitHub Token</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#4a4642] mb-1">
                      GitHub Username / Org
                    </label>
                    <input
                      type="text"
                      value={ghConfig.owner}
                      onChange={(e) => setGhConfig({ ...ghConfig, owner: e.target.value })}
                      placeholder="e.g. idadilfer"
                      className="w-full px-3 py-2 text-xs bg-[#FDFDFC] border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#4a4642] mb-1">
                      Repository Name
                    </label>
                    <input
                      type="text"
                      value={ghConfig.repo}
                      onChange={(e) => setGhConfig({ ...ghConfig, repo: e.target.value })}
                      placeholder="e.g. idadilfer.github.io"
                      className="w-full px-3 py-2 text-xs bg-[#FDFDFC] border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#4a4642] mb-1">
                      Branch
                    </label>
                    <input
                      type="text"
                      value={ghConfig.branch}
                      onChange={(e) => setGhConfig({ ...ghConfig, branch: e.target.value })}
                      placeholder="main"
                      className="w-full px-3 py-2 text-xs bg-[#FDFDFC] border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-[#FAF8F5] border border-[#E3DFD7] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase text-[#141314] flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-[#C15A38]" />
                      <span>Paste Your GitHub Personal Access Token (PAT) Here</span>
                    </label>
                    <span className="text-[10.5px] text-[#8a857e]">
                      Kept private in your local browser only
                    </span>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type={showToken ? 'text' : 'password'}
                      value={ghConfig.token}
                      onChange={(e) => setGhConfig({ ...ghConfig, token: e.target.value.trim() })}
                      placeholder="Paste token here (e.g. github_pat_... or ghp_...)"
                      className="w-full pl-3.5 pr-20 py-2.5 text-xs font-mono bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38] shadow-xs"
                    />
                    <div className="absolute right-1.5 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            if (text) {
                              setGhConfig({ ...ghConfig, token: text.trim() });
                            }
                          } catch {
                            // If clipboard API blocked by permissions, user can paste manually
                          }
                        }}
                        title="Paste from clipboard"
                        className="px-2 py-1 text-[11px] font-medium text-[#4a4642] hover:text-[#141314] hover:bg-[#EDEAE4] rounded transition-colors flex items-center gap-1"
                      >
                        <ClipboardPaste className="w-3 h-3 text-[#C15A38]" />
                        <span>Paste</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowToken(!showToken)}
                        title={showToken ? 'Hide token' : 'Show token'}
                        className="p-1 text-[#8a857e] hover:text-[#141314] hover:bg-[#EDEAE4] rounded transition-colors"
                      >
                        {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#8a857e]">
                    Requires GitHub permission: <b>Repository &gt; Contents &gt; Read and write</b>.
                  </p>
                </div>

                {/* Connection Test & Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTestingConnection}
                    className="px-3.5 py-2 text-xs font-medium text-[#141314] bg-[#F5F2EC] hover:bg-[#EDEAE4] rounded-lg transition-colors border border-[#E3DFD7]"
                  >
                    {isTestingConnection ? 'Testing...' : 'Test Connection'}
                  </button>

                  <button
                    type="button"
                    onClick={handleDirectPublish}
                    disabled={isPublishing}
                    className="px-5 py-2 text-xs font-medium text-white bg-[#141314] hover:bg-[#2b292b] rounded-lg transition-colors shadow-xs flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5 text-[#C15A38]" />
                    <span>
                      {isPublishing
                        ? 'Publishing to GitHub...'
                        : 'Commit & Publish Live to GitHub Pages'}
                    </span>
                  </button>
                </div>

                {/* Test Result Message */}
                {testResult && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                      testResult.success
                        ? 'bg-[#F2F8F4] border-[#C8E4D3] text-[#1E5631]'
                        : 'bg-[#FDF2F2] border-[#F4C7C7] text-[#9E2A2B]'
                    }`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span>{testResult.message}</span>
                  </div>
                )}

                {/* Live Publishing Progress Indicator */}
                {publishProgress && (
                  <div
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      publishProgress.success
                        ? 'bg-[#F2F8F4] border-[#C8E4D3] text-[#1E5631]'
                        : publishProgress.error
                        ? 'bg-[#FDF2F2] border-[#F4C7C7] text-[#9E2A2B]'
                        : 'bg-[#FEF8ED] border-[#F2DEB9] text-[#7A4B00]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span>{publishProgress.message}</span>
                      <span>
                        {publishProgress.step} / {publishProgress.total} files
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-current transition-all"
                        style={{
                          width: `${(publishProgress.step / publishProgress.total) * 100}%`,
                        }}
                      />
                    </div>

                    {publishProgress.success && (
                      <div className="pt-1 flex items-center justify-between text-[11.5px]">
                        <span>
                          Success! GitHub Pages will refresh automatically within ~30-60s.
                        </span>
                        <a
                          href={`https://${ghConfig.owner}.github.io/${
                            ghConfig.repo === `${ghConfig.owner}.github.io` ? '' : ghConfig.repo
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-semibold flex items-center gap-1"
                        >
                          <span>Visit Live Site</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {publishProgress.error && (
                      <div className="text-[11px] font-mono opacity-90">
                        Error: {publishProgress.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: 1-Click ZIP Download */}
          {activeTab === 'download' && (
            <div className="space-y-6">
              <div className="p-6 bg-white border border-[#EDEAE4] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <h3 className="text-base font-semibold text-[#141314]">
                    Download All Files for GitHub
                  </h3>
                  <p className="text-xs text-[#4a4642] mt-1 max-w-lg leading-relaxed">
                    Downloads an all-in-one ZIP archive containing <code>index.html</code>, clean <code>styles.css</code>, all <code>projects/*.html</code> case studies, automated <code>.github/workflows/deploy.yml</code>, and <code>README.md</code>.
                  </p>
                  <div className="flex flex-wrap gap-2 text-[11px] text-[#8a857e] mt-3 font-mono">
                    <span className="px-2 py-0.5 bg-[#F5F2EC] rounded">index.html</span>
                    <span className="px-2 py-0.5 bg-[#F5F2EC] rounded">styles.css</span>
                    <span className="px-2 py-0.5 bg-[#F5F2EC] rounded">{data.projects.length} Case Studies</span>
                    <span className="px-2 py-0.5 bg-[#F5F2EC] rounded">Zero Vercel/Netlify</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadZip}
                  disabled={isGeneratingZip}
                  className="px-5 py-3 text-xs font-semibold text-white bg-[#141314] hover:bg-[#2b292b] rounded-xl shadow-sm transition-all flex items-center gap-2 whitespace-nowrap self-stretch sm:self-auto justify-center"
                >
                  <Download className="w-4 h-4 text-[#C15A38]" />
                  <span>
                    {isGeneratingZip ? 'Compiling ZIP...' : 'Download Complete ZIP Package'}
                  </span>
                </button>
              </div>

              {/* What is included */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white border border-[#EDEAE4] rounded-xl">
                  <div className="font-semibold text-[#141314] flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-[#C15A38]" />
                    <span>index.html & styles.css</span>
                  </div>
                  <div className="text-[#8a857e] text-[11.5px] mt-1">
                    Your Home reel page and vanilla minimal stylesheet.
                  </div>
                </div>

                <div className="p-3 bg-white border border-[#EDEAE4] rounded-xl">
                  <div className="font-semibold text-[#141314] flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-[#C15A38]" />
                    <span>projects/*.html</span>
                  </div>
                  <div className="text-[#8a857e] text-[11.5px] mt-1">
                    Isaac Blankensmith case study pages with audio players.
                  </div>
                </div>

                <div className="p-3 bg-white border border-[#EDEAE4] rounded-xl">
                  <div className="font-semibold text-[#141314] flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#C15A38]" />
                    <span>.github/workflows/deploy.yml</span>
                  </div>
                  <div className="text-[#8a857e] text-[11.5px] mt-1">
                    Automated GitHub Actions workflow for zero-config deployments.
                  </div>
                </div>

                <div className="p-3 bg-white border border-[#EDEAE4] rounded-xl">
                  <div className="font-semibold text-[#141314] flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#C15A38]" />
                    <span>portfolio-data.json</span>
                  </div>
                  <div className="text-[#8a857e] text-[11.5px] mt-1">
                    Master backup file to re-import into the editor anytime.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Setup Instructions */}
          {activeTab === 'instructions' && (
            <div className="space-y-4 text-xs text-[#4a4642]">
              <div className="p-4 bg-white border border-[#EDEAE4] rounded-2xl space-y-3">
                <div className="flex items-center gap-2 font-semibold text-sm text-[#141314]">
                  <Terminal className="w-4 h-4 text-[#C15A38]" />
                  <span>How to Host the Online Editor & Portfolio on GitHub Pages</span>
                </div>

                <div className="space-y-4 pt-1">
                  <div>
                    <b className="text-[#141314]">How can the editor live online on GitHub without Vercel or Netlify?</b>
                    <p className="mt-0.5 leading-relaxed">
                      GitHub Pages supports any modern client-side application. Because this entire Studio runs in the user's browser (React + Vite + HTML5 audio/video), it requires zero backend servers.
                    </p>
                  </div>

                  <div>
                    <b className="text-[#141314]">Step 1: Push this Codebase to your GitHub Repository</b>
                    <pre className="p-3 bg-[#141314] text-[#FDFDFC] rounded-xl font-mono text-[11px] overflow-x-auto mt-1">
{`git init
git add .
git commit -m "Deploy portfolio and online studio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main`}
                    </pre>
                  </div>

                  <div>
                    <b className="text-[#141314]">Step 2: Enable GitHub Pages</b>
                    <p className="mt-0.5">
                      In your GitHub repository, click <b>Settings</b> &rarr; <b>Pages</b>. Under <b>Build and deployment &gt; Source</b>:
                    </p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Choose <b>GitHub Actions</b> (the included <code>deploy.yml</code> will automatically build and deploy it every time you push).</li>
                      <li>Or choose <b>Deploy from a branch</b> with <code>main</code> / <code>root</code>.</li>
                    </ul>
                  </div>

                  <div>
                    <b className="text-[#141314]">Step 3: Accessing your Online Studio</b>
                    <p className="mt-0.5">
                      Once deployed, you can visit <code>https://yourusername.github.io</code> anytime from your phone, laptop, or tablet. Switch between "Live Site" and "Edit Projects", upload new assets, and use the <b>⚡ Publish Directly from Browser</b> tab to commit changes directly to GitHub!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Code Inspector */}
          {activeTab === 'code-preview' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <select
                  value={selectedFileForPreview}
                  onChange={(e) => setSelectedFileForPreview(e.target.value)}
                  className="px-3 py-2 text-xs bg-white border border-[#E3DFD7] rounded-lg font-mono focus:outline-none focus:border-[#C15A38]"
                >
                  <option value="index.html">index.html (Home Page)</option>
                  <option value="styles.css">styles.css (Styles)</option>
                  <option value="cv.html">cv.html (CV Page)</option>
                  <option value="README.md">README.md</option>
                  <option value="portfolio-data.json">portfolio-data.json</option>
                  <option value=".github/workflows/deploy.yml">.github/workflows/deploy.yml</option>
                  <optgroup label="Case Studies">
                    {data.projects.map((p) => (
                      <option key={p.slug} value={`projects/${p.slug}.html`}>
                        projects/{p.slug}.html ({p.title})
                      </option>
                    ))}
                  </optgroup>
                </select>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3.5 py-2 text-xs font-medium bg-[#141314] hover:bg-[#2b292b] text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 bg-[#141314] text-[#EDEAE4] rounded-xl font-mono text-[11px] leading-relaxed max-h-[420px] overflow-y-auto whitespace-pre-wrap selection:bg-[#C15A38]/30">
                  {getActiveCode()}
                </pre>
              </div>
            </div>
          )}

          {/* TAB: Backup JSON */}
          {activeTab === 'backup' && (
            <div className="p-5 bg-white border border-[#EDEAE4] rounded-2xl space-y-3 text-xs text-[#4a4642]">
              <h4 className="text-sm font-semibold text-[#141314]">
                Backup & Restore JSON Data
              </h4>
              <p className="leading-relaxed">
                All your projects, uploaded images, audio transcripts, and case study copy can be saved as a clean JSON backup file. You can import this file anytime to restore your edits.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([jsonBackup], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2 text-xs font-medium bg-white text-[#141314] border border-[#E3DFD7] hover:border-[#141314] rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#C15A38]" />
                  <span>Download JSON Backup</span>
                </button>

                <label className="px-4 py-2 text-xs font-medium bg-white text-[#141314] border border-[#E3DFD7] hover:border-[#141314] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[#C15A38]" />
                  <span>Import JSON File</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportJsonFile}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset portfolio back to initial state? Your current unsaved edits will be cleared.')) {
                      onResetData();
                    }
                  }}
                  className="px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset to Default</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#E3DFD7] bg-white flex items-center justify-between">
          <div className="text-[11px] text-[#8a857e]">
            Online browser editor · Static GitHub Pages deployment
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-[#F5F2EC] hover:bg-[#EDEAE4] text-[#141314] rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
