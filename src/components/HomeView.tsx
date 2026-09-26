import React from 'react';
import { PortfolioData, Project } from '../types/portfolio';
import { Edit2, ArrowUpRight } from 'lucide-react';

interface HomeViewProps {
  data: PortfolioData;
  onSelectProject: (projectId: string) => void;
  onEditProject: (projectId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  data,
  onSelectProject,
  onEditProject,
}) => {
  const { author, projects } = data;

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-[#141314] font-sans-body">
      {/* Home Topbar */}
      <header className="sticky top-0 z-40 bg-[#FDFDFC]/94 backdrop-blur-md border-b border-[#E3DFD7] px-6 sm:px-12 md:px-16 py-4 flex items-center justify-between">
        <a
          href="#work"
          className="text-[15px] font-medium tracking-tight text-[#141314] hover:text-[#C15A38] transition-colors"
        >
          {author.name}
        </a>
        <nav className="flex items-center gap-5 sm:gap-6 text-sm text-[#4a4642]">
          <span className="text-[#141314] font-medium border-b border-[#141314] pb-0.5">
            Work
          </span>
          <a
            href={author.cvUrl}
            onClick={(e) => {
              e.preventDefault();
              alert(`CV link is set to: "${author.cvUrl}". When exported, cv.html will be generated in your repository root.`);
            }}
            className="hover:text-[#141314] transition-colors"
          >
            CV
          </a>
          <a
            href={`mailto:${author.email}`}
            aria-label="Email"
            className="hover:text-[#141314] transition-colors"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="5" width="18" height="14" rx="1" />
              <path d="m3 6 9 7 9-7" />
            </svg>
          </a>
          {author.linkedin && (
            <a
              href={author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-[#141314] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm7 0h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.2 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4V9.5Z" />
              </svg>
            </a>
          )}
          {author.instagram && (
            <a
              href={author.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-[#141314] transition-colors"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
              </svg>
            </a>
          )}
        </nav>
      </header>

      {/* Intro section */}
      <section className="max-w-[1100px] mx-auto px-6 sm:px-12 md:px-16 pt-16 sm:pt-20 pb-12 sm:pb-14">
        <p className="font-serif-display italic text-2xl sm:text-3xl md:text-4xl text-[#141314] leading-[1.35] max-w-[840px] tracking-tight">
          {author.intro}
        </p>
      </section>

      {/* Reel */}
      <main id="work" className="max-w-[1100px] mx-auto px-6 sm:px-12 md:px-16 pb-24 space-y-16 sm:space-y-20">
        {projects.map((project: Project, idx: number) => {
          const isVideo = project.homeMedia.type === 'video';

          return (
            <article
              key={project.id}
              className="group relative grid grid-cols-1 md:grid-cols-[1.18fr_1fr] gap-8 md:gap-14 items-center pb-16 sm:pb-20 border-b border-[#EDEAE4] last:border-b-0"
            >
              {/* Quick edit shortcut hover button */}
              <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => onEditProject(project.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-xs text-xs font-medium text-[#141314] rounded-lg shadow-sm border border-[#E3DFD7] hover:bg-white hover:border-[#C15A38] transition-colors"
                >
                  <Edit2 className="w-3 h-3 text-[#C15A38]" />
                  <span>Edit Project</span>
                </button>
              </div>

              {/* Media Card */}
              <div
                onClick={() => onSelectProject(project.id)}
                className="cursor-pointer"
              >
                <figure
                  className="relative aspect-4/3 rounded-xl overflow-hidden bg-[#f4f1ec] border border-[#EDEAE4] shadow-xs group-hover:shadow-md transition-all duration-300"
                  data-label={project.homeMedia.label || `assets/home/${project.slug}.jpg`}
                >
                  {isVideo ? (
                    <video
                      src={project.homeMedia.url}
                      playsInline
                      autoPlay
                      muted
                      loop
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <img
                      src={project.homeMedia.url}
                      alt={project.homeMedia.alt || project.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.img-fallback')) {
                          const fallback = document.createElement('div');
                          fallback.className =
                            'img-fallback w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#8a857e]';
                          fallback.innerHTML = `<span class="text-sm font-medium text-[#4a4642] mb-1">${project.title}</span><span class="text-xs">Image path: ${project.homeMedia.label || 'assets/home/' + project.slug + '.jpg'}</span>`;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  )}

                  {/* Corner indicator */}
                  <div className="absolute bottom-3 left-3 bg-[#141314]/80 backdrop-blur-xs text-[11px] text-[#FDFDFC] px-2.5 py-0.5 rounded font-mono">
                    {project.homeMedia.label || `assets/home/${project.slug}.jpg`}
                  </div>
                </figure>
              </div>

              {/* Copy */}
              <div className="flex flex-col">
                <h2 className="font-serif-display text-3xl sm:text-4xl text-[#141314] font-normal leading-tight tracking-tight mb-2">
                  <button
                    type="button"
                    onClick={() => onSelectProject(project.id)}
                    className="text-left hover:text-[#C15A38] transition-colors focus:outline-none"
                  >
                    {project.title}
                  </button>
                </h2>

                <p className="text-xs sm:text-[13px] text-[#8a857e] mb-4.5 tracking-wide">
                  {project.meta}
                </p>

                <p className="text-[15px] leading-relaxed text-[#4a4642] mb-3">
                  {project.description1}
                </p>

                {project.description2 && (
                  <p className="text-[15px] leading-relaxed text-[#4a4642] mb-3">
                    {project.description2}
                  </p>
                )}

                <ul className="flex items-center gap-5 mt-4 text-[13.5px] font-medium">
                  {project.hasCaseStudy && (
                    <li>
                      <button
                        type="button"
                        onClick={() => onSelectProject(project.id)}
                        className="text-[#C15A38] hover:text-[#a8461f] hover:underline transition-colors focus:outline-none"
                      >
                        Case study
                      </button>
                    </li>
                  )}
                  {project.externalWebsiteUrl && (
                    <li>
                      <a
                        href={project.externalWebsiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#C15A38] hover:text-[#a8461f] hover:underline transition-colors"
                      >
                        <span>Website</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </li>
                  )}
                  {project.pressUrl && (
                    <li>
                      <a
                        href={project.pressUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#C15A38] hover:text-[#a8461f] hover:underline transition-colors"
                      >
                        <span>Press</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </article>
          );
        })}
      </main>

      {/* Footer */}
      <footer className="max-w-[1100px] mx-auto px-6 sm:px-12 md:px-16 py-8 border-t border-[#E3DFD7] text-xs text-[#8a857e] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          {author.name} &copy; {author.copyrightYear}
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span>Static GitHub Pages Ready</span>
          <span aria-hidden="true">·</span>
          <span>Zero Server Dependencies</span>
        </div>
      </footer>
    </div>
  );
};
