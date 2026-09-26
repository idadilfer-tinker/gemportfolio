import React, { useState, useRef, useEffect } from 'react';
import { Project, PortfolioData } from '../types/portfolio';
import { ArrowLeft, ArrowUpRight, Play, Pause, Square, ChevronDown, Edit2, Volume2 } from 'lucide-react';
import { generateHarmonicChimeAudio } from '../utils/audioSynthesizer';

interface CaseStudyViewProps {
  project: Project;
  data: PortfolioData;
  onBackToPortfolio: () => void;
  onEditProject: (projectId: string) => void;
}

export const CaseStudyView: React.FC<CaseStudyViewProps> = ({
  project,
  data,
  onBackToPortfolio,
  onEditProject,
}) => {
  const cs = project.caseStudy;
  const audio = cs.audio;

  // Audio player state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [audioSource, setAudioSource] = useState<string>(audio.url || '');

  // If audio is enabled but no audio url is set, we can generate a harmonic ambient voiceover track for preview
  useEffect(() => {
    let active = true;
    if (audio.enabled && !audio.url) {
      generateHarmonicChimeAudio(14).then((url) => {
        if (active && url) {
          setAudioSource(url);
        }
      });
    } else {
      setAudioSource(audio.url || '');
    }
    return () => {
      active = false;
    };
  }, [audio.enabled, audio.url]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Audio play prevented or source missing:', err);
        });
    }
  };

  const handleStop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-[#141314] font-sans-body pb-24">
      {/* Hidden audio element */}
      {audio.enabled && (
        <audio
          ref={audioRef}
          src={audioSource}
          preload="metadata"
          onTimeUpdate={() => {
            if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) setDuration(audioRef.current.duration);
          }}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Fixed Back Navigation Bar (60px high) */}
      <nav className="fixed top-0 left-0 right-0 z-40 h-[60px] bg-[#FDFDFC]/94 backdrop-blur-md border-b border-[#E3DFD7] px-6 sm:px-12 md:px-16 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToPortfolio}
          className="inline-flex items-center gap-2 text-[13.5px] text-[#4a4642] hover:text-[#141314] transition-colors focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to portfolio</span>
        </button>

        <span className="hidden md:inline-block text-[13px] text-[#8a857e] italic font-serif-display truncate max-w-[320px]">
          {project.title} · Case Study
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onEditProject(project.id)}
            className="inline-flex items-center gap-1.5 text-xs text-[#4a4642] hover:text-[#141314] px-2.5 py-1.5 rounded hover:bg-[#EDEAE4]/60 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#C15A38]" />
            <span className="hidden sm:inline">Edit</span>
          </button>

          {project.externalWebsiteUrl && (
            <a
              href={project.externalWebsiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11.5px] font-medium tracking-wider uppercase text-[#C15A38] hover:bg-[#C15A38]/10 border border-[#C15A38]/35 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap"
            >
              <span>Visit {project.externalWebsiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          )}
        </div>
      </nav>

      {/* Sticky Audio Description Bar */}
      {audio.enabled && (
        <div className="sticky top-[60px] z-30 bg-[#FDFDFC]/97 backdrop-blur-md border-b border-[#E3DFD7]">
          <div className="max-w-[1100px] mx-auto px-6 sm:px-12 md:px-16 py-3 flex items-center gap-4 sm:gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 text-[#C15A38]" />
              <span className="text-[10px] tracking-[0.14em] uppercase text-[#8a857e] whitespace-nowrap">
                {audio.label || 'Audio description'}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="w-8 h-8 rounded-full border border-[#E3DFD7] hover:border-[#a8461f] bg-transparent flex items-center justify-center transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 text-[#141314] fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-[#141314] fill-current ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={handleStop}
                aria-label="Stop"
                className="w-8 h-8 rounded-full border border-[#E3DFD7] hover:border-[#a8461f] bg-transparent flex items-center justify-center transition-colors"
              >
                <Square className="w-2.5 h-2.5 text-[#141314] fill-current" />
              </button>
            </div>

            {/* Progress scrubber */}
            <div
              onClick={handleSeek}
              className="flex-1 min-w-[100px] h-1.5 bg-[#EDEAE4] hover:bg-[#E3DFD7] rounded-sm cursor-pointer relative transition-colors"
            >
              <div
                className="absolute left-0 top-0 h-full bg-[#C15A38] rounded-sm transition-all"
                style={{
                  width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                }}
              />
            </div>

            {/* Time */}
            <span className="text-xs text-[#8a857e] font-mono tabular-nums whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Read as text toggle */}
            <button
              type="button"
              onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
              className={`text-xs border px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                isTranscriptOpen
                  ? 'bg-[#C15A38] text-white border-[#C15A38]'
                  : 'bg-transparent text-[#4a4642] border-[#E3DFD7] hover:border-[#a8461f]'
              }`}
            >
              {isTranscriptOpen ? '✕ Hide text' : '≡ Read as text'}
            </button>
          </div>

          {/* Expandable Transcript Drawer */}
          {isTranscriptOpen && (
            <div className="bg-[#F5F2EC] border-b border-[#E3DFD7] transition-all">
              <div className="max-w-[1100px] mx-auto px-6 sm:px-12 md:px-16 py-8">
                <div className="text-[10px] tracking-[0.16em] uppercase text-[#8a857e] mb-1">
                  Transcript
                </div>
                <div className="text-xs text-[#4a4642] mb-6">
                  Read the full case study narration as text.
                </div>

                <div className="max-w-[700px] border-t border-[#EDEAE4]">
                  <details className="group border-b border-[#EDEAE4]" open>
                    <summary className="list-none cursor-pointer py-4 flex items-center justify-between gap-4 font-semibold text-sm text-[#141314]">
                      <span>The challenge</span>
                      <ChevronDown className="w-4 h-4 text-[#8a857e] group-open:rotate-180 transition-transform" />
                    </summary>
                    <p className="pb-5 text-sm leading-relaxed text-[#4a4642]">
                      {audio.transcript.challenge}
                    </p>
                  </details>

                  <details className="group border-b border-[#EDEAE4]" open>
                    <summary className="list-none cursor-pointer py-4 flex items-center justify-between gap-4 font-semibold text-sm text-[#141314]">
                      <span>My approach</span>
                      <ChevronDown className="w-4 h-4 text-[#8a857e] group-open:rotate-180 transition-transform" />
                    </summary>
                    <p className="pb-5 text-sm leading-relaxed text-[#4a4642]">
                      {audio.transcript.approach}
                    </p>
                  </details>

                  <details className="group border-b border-[#EDEAE4]" open>
                    <summary className="list-none cursor-pointer py-4 flex items-center justify-between gap-4 font-semibold text-sm text-[#141314]">
                      <span>What I built</span>
                      <ChevronDown className="w-4 h-4 text-[#8a857e] group-open:rotate-180 transition-transform" />
                    </summary>
                    <p className="pb-5 text-sm leading-relaxed text-[#4a4642]">
                      {audio.transcript.built}
                    </p>
                  </details>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hero Section */}
      <header className="max-w-[1100px] mx-auto px-6 sm:px-12 md:px-16 pt-28 sm:pt-36 pb-10">
        <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#C15A38] mb-4">
          {cs.eyebrow}
        </p>

        <h1 className="font-serif-display text-4xl sm:text-6xl md:text-7xl font-normal leading-[1.05] tracking-tight text-[#141314] mb-5">
          {cs.title}
        </h1>

        <p className="text-base sm:text-lg leading-relaxed text-[#4a4642] max-w-[640px] mb-10">
          {cs.dek}
        </p>

        {/* 4-column Meta Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 border-t border-b border-[#E3DFD7] py-7 max-w-[860px]">
          <div>
            <div className="text-[9.5px] font-semibold tracking-[0.2em] uppercase text-[#8a857e] mb-1.5">
              Role
            </div>
            <div className="text-[14.5px] text-[#141314]">{cs.meta.role}</div>
          </div>
          <div>
            <div className="text-[9.5px] font-semibold tracking-[0.2em] uppercase text-[#8a857e] mb-1.5">
              Year
            </div>
            <div className="text-[14.5px] text-[#141314]">{cs.meta.year}</div>
          </div>
          <div>
            <div className="text-[9.5px] font-semibold tracking-[0.2em] uppercase text-[#8a857e] mb-1.5">
              Type
            </div>
            <div className="text-[14.5px] text-[#141314]">{cs.meta.type}</div>
          </div>
          <div>
            <div className="text-[9.5px] font-semibold tracking-[0.2em] uppercase text-[#8a857e] mb-1.5">
              Status
            </div>
            <div className="text-[14.5px] text-[#141314]">{cs.meta.status}</div>
          </div>
        </div>
      </header>

      {/* Case Study Body: Exactly Three Parts + Outcome */}
      <div className="max-w-[1100px] mx-auto px-6 sm:px-12 md:px-16">
        {/* 1. The Challenge */}
        <section className="py-14 border-b border-[#EDEAE4]">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#8a857e] mb-4">
            {cs.challenge.label}
          </p>
          <h2 className="font-serif-display text-2xl sm:text-3xl italic font-normal leading-tight tracking-tight text-[#141314] mb-4">
            {cs.challenge.headline}
          </h2>
          <div
            className="text-[15px] leading-relaxed text-[#4a4642] max-w-[660px]"
            dangerouslySetInnerHTML={{ __html: cs.challenge.body }}
          />

          <figure className="mt-8 rounded-xl overflow-hidden border border-[#EDEAE4] bg-[#f4f1ec]">
            {cs.challenge.media.type === 'video' ? (
              <video
                src={cs.challenge.media.url}
                playsInline
                autoPlay
                muted
                loop
                controls
                className="w-full block"
              />
            ) : (
              <img
                src={cs.challenge.media.url}
                alt={cs.challenge.media.alt}
                loading="lazy"
                className="w-full block"
              />
            )}
          </figure>
          {cs.challenge.media.caption && (
            <p className="text-[12.5px] text-[#8a857e] mt-3 max-w-[760px]">
              <b className="font-medium text-[#4a4642]">{cs.challenge.media.screenName}</b>. {cs.challenge.media.caption}
            </p>
          )}
        </section>

        {/* 2. My Approach */}
        <section className="py-14 border-b border-[#EDEAE4]">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#8a857e] mb-4">
            {cs.approach.label}
          </p>
          <h2 className="font-serif-display text-2xl sm:text-3xl italic font-normal leading-tight tracking-tight text-[#141314] mb-4">
            {cs.approach.headline}
          </h2>
          <div
            className="text-[15px] leading-relaxed text-[#4a4642] max-w-[660px]"
            dangerouslySetInnerHTML={{ __html: cs.approach.body }}
          />

          <figure className="mt-8 rounded-xl overflow-hidden border border-[#EDEAE4] bg-[#f4f1ec]">
            {cs.approach.media.type === 'video' ? (
              <video
                src={cs.approach.media.url}
                playsInline
                autoPlay
                muted
                loop
                controls
                className="w-full block"
              />
            ) : (
              <img
                src={cs.approach.media.url}
                alt={cs.approach.media.alt}
                loading="lazy"
                className="w-full block"
              />
            )}
          </figure>
          {cs.approach.media.caption && (
            <p className="text-[12.5px] text-[#8a857e] mt-3 max-w-[760px]">
              <b className="font-medium text-[#4a4642]">{cs.approach.media.screenName}</b>. {cs.approach.media.caption}
            </p>
          )}
        </section>

        {/* 3. What I Built */}
        <section className="py-14 border-b border-[#EDEAE4]">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#8a857e] mb-4">
            {cs.built.label}
          </p>
          <h2 className="font-serif-display text-2xl sm:text-3xl italic font-normal leading-tight tracking-tight text-[#141314] mb-4">
            {cs.built.headline}
          </h2>
          <div
            className="text-[15px] leading-relaxed text-[#4a4642] max-w-[660px]"
            dangerouslySetInnerHTML={{ __html: cs.built.body }}
          />

          <figure className="mt-8 rounded-xl overflow-hidden border border-[#EDEAE4] bg-[#f4f1ec]">
            {cs.built.media.type === 'video' ? (
              <video
                src={cs.built.media.url}
                playsInline
                autoPlay
                muted
                loop
                controls
                className="w-full block"
              />
            ) : (
              <img
                src={cs.built.media.url}
                alt={cs.built.media.alt}
                loading="lazy"
                className="w-full block"
              />
            )}
          </figure>
          {cs.built.media.caption && (
            <p className="text-[12.5px] text-[#8a857e] mt-3 max-w-[760px]">
              <b className="font-medium text-[#4a4642]">{cs.built.media.screenName}</b>. {cs.built.media.caption}
            </p>
          )}
        </section>

        {/* Outcome Section */}
        <section className="py-14">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#8a857e] mb-4">
            Outcome
          </p>
          <div className="flex flex-wrap gap-[1px] bg-[#EDEAE4] border border-[#EDEAE4] rounded-xl overflow-hidden">
            {cs.outcome.metrics.map((metric, i) => (
              <div key={i} className="flex-1 min-w-[160px] bg-[#FDFDFC] p-6 sm:p-7">
                <div className="font-serif-display text-3xl sm:text-4xl text-[#C15A38] leading-none mb-2">
                  {metric.num}
                </div>
                <div className="text-[12.5px] text-[#8a857e] leading-snug">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          {cs.outcome.callout && (
            <div className="mt-8 pl-5 border-l-2 border-[#C15A38]">
              <p className="font-serif-display italic text-lg sm:text-xl text-[#141314] leading-relaxed">
                "{cs.outcome.callout}"
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
