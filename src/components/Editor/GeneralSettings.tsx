import React from 'react';
import { AuthorProfile } from '../../types/portfolio';
import { User, Mail, Globe, Instagram, Linkedin, FileText } from 'lucide-react';

interface GeneralSettingsProps {
  author: AuthorProfile;
  onChange: (updated: AuthorProfile) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ author, onChange }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#E3DFD7] space-y-5">
      <div className="border-b border-[#EDEAE4] pb-3">
        <h3 className="text-sm font-semibold text-[#141314] flex items-center gap-2">
          <User className="w-4 h-4 text-[#C15A38]" />
          <span>Portfolio Profile & Header</span>
        </h3>
        <p className="text-xs text-[#8a857e] mt-0.5">
          Controls the top navigation wordmark, intro bio statement, and social links.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
            Your Full Name (Brand Wordmark)
          </label>
          <input
            type="text"
            value={author.name}
            onChange={(e) => onChange({ ...author, name: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
            Role / Tagline
          </label>
          <input
            type="text"
            value={author.role}
            onChange={(e) => onChange({ ...author, role: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5 flex items-center justify-between">
          <span>Home Intro Statement</span>
          <span className="text-[11px] text-[#8a857e] font-normal font-serif-display italic">
            Displayed in prominent italic Tinos serif
          </span>
        </label>
        <textarea
          rows={3}
          value={author.intro}
          onChange={(e) => onChange({ ...author, intro: e.target.value })}
          className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38] leading-relaxed"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#8a857e]" />
            <span>Contact Email</span>
          </label>
          <input
            type="email"
            value={author.email}
            onChange={(e) => onChange({ ...author, email: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5 flex items-center gap-1.5">
            <Linkedin className="w-3.5 h-3.5 text-[#8a857e]" />
            <span>LinkedIn URL</span>
          </label>
          <input
            type="text"
            value={author.linkedin}
            onChange={(e) => onChange({ ...author, linkedin: e.target.value })}
            placeholder="https://www.linkedin.com/in/..."
            className="w-full px-3 py-2 text-xs bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5 flex items-center gap-1.5">
            <Instagram className="w-3.5 h-3.5 text-[#8a857e]" />
            <span>Instagram URL</span>
          </label>
          <input
            type="text"
            value={author.instagram}
            onChange={(e) => onChange({ ...author, instagram: e.target.value })}
            placeholder="https://www.instagram.com/..."
            className="w-full px-3 py-2 text-xs bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#8a857e]" />
            <span>CV Page / Link</span>
          </label>
          <input
            type="text"
            value={author.cvUrl}
            onChange={(e) => onChange({ ...author, cvUrl: e.target.value })}
            placeholder="cv.html or https://..."
            className="w-full px-3 py-2 text-xs bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4642] mb-1.5">
            Copyright Year
          </label>
          <input
            type="number"
            value={author.copyrightYear}
            onChange={(e) =>
              onChange({ ...author, copyrightYear: parseInt(e.target.value) || 2026 })
            }
            className="w-full px-3 py-2 text-xs bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
          />
        </div>
      </div>
    </div>
  );
};
