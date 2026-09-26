import { PortfolioData } from '../types/portfolio';

// Initial data faithfully matching Ida Dilfer's portfolio structure
export const initialPortfolioData: PortfolioData = {
  author: {
    name: 'Ida Dilfer',
    role: 'Product designer based in London.',
    intro: 'Ida Dilfer is a product designer in London working across AI, health and fintech.',
    email: 'hello@example.com',
    linkedin: 'https://www.linkedin.com/in/your-handle',
    instagram: 'https://www.instagram.com/your-handle',
    cvUrl: 'cv.html',
    copyrightYear: 2026,
  },
  projects: [
    {
      id: 'proj-01-oia',
      slug: 'oia',
      title: 'Oia',
      meta: 'AI surgery planner · Web and WhatsApp · 2026 · Founder',
      description1:
        'Oia helps women plan cosmetic surgery. You talk to her the way you would talk to a surgeon, and she finds accredited clinics at home and abroad, plans the trip and stays with you through recovery.',
      description2:
        'I founded it, designed it and built it end to end. The whole product is one conversation: no forms, no listings.',
      homeMedia: {
        type: 'image',
        url: '/src/assets/images/oia_surgery_planner_1790349765483.jpg',
        alt: 'Two Oia chat screens: an anonymised video note, then a matched clinic with price and dates',
        label: 'assets/home/oia.jpg  ·  4:3',
        aspectRatio: '4:3',
      },
      externalWebsiteUrl: 'https://heyoia.com',
      hasCaseStudy: true,
      caseStudy: {
        eyebrow: 'AI Concierge · Health-tech · 2026',
        title: 'Oia',
        dek: 'Replacing predatory surgical directories with a private conversational assistant that guides patients from clinical research to aftercare.',
        meta: {
          role: 'Founder & Principal Designer',
          year: '2026',
          type: '0→1 product',
          status: 'Live at heyoia.com',
        },
        audio: {
          enabled: true,
          url: '',
          label: 'Audio description',
          transcript: {
            challenge:
              'Cosmetic surgery research is plagued by 40-filter directory portals, aggressive sales commissions, and information asymmetry. Women felt intimidated and anxious asking deeply personal medical questions to sales representatives.',
            approach:
              'I eliminated traditional listings entirely in favor of an unhurried, natural dialogue flow. Patients send voice notes or text prompts, and Oia parses clinical needs, matches accredited surgeons, and calculates all-inclusive travel budgets.',
            built:
              'Shipped a dual-channel application across Web and WhatsApp, backed by an accredited clinic network database, an automated surgical timeline generator, and post-operative recovery monitoring checklists.',
          },
        },
        challenge: {
          label: 'The challenge',
          headline: 'Directory listings cause clinical anxiety and sales pressure.',
          body: 'Patients researching medical procedures were confronted by commercial marketplace listings with hidden referral fees and cold clinical jargon. <b>Over 70% of prospective patients reported abandoning inquiries</b> because they feared high-pressure sales calls before understanding clinical safety.',
          media: {
            type: 'image',
            url: '/src/assets/images/oia_surgery_planner_1790349765483.jpg',
            alt: 'Oia conversational intake interface showing anonymized notes',
            screenName: 'Conversational Intake Flow',
            caption: 'Patients describe their concerns naturally without filling out 20-field directory forms.',
            aspectRatio: '4:3',
          },
        },
        approach: {
          label: 'My approach',
          headline: 'Turning clinical discovery into an unhurried, private conversation.',
          body: 'We structured the experience as a respectful medical consultation. <b>No forms, no public catalogs, and no spam.</b> The conversational agent extracts patient goals, verifies medical suitability constraints, and presents transparent clinic profiles with accredited surgeon credentials and flat-fee estimates.',
          media: {
            type: 'image',
            url: '/src/assets/images/oia_surgery_planner_1790349765483.jpg',
            alt: 'Matched surgeon credentials and transparent quotation screen',
            screenName: 'Clinical Matching & Pricing Card',
            caption: 'Clear breakdown of accredited clinical certifications, surgeon peer reviews, and inclusive travel timeline.',
            aspectRatio: '4:3',
          },
        },
        built: {
          label: 'What I built',
          headline: 'An end-to-end patient companion from intake to recovery.',
          body: 'Designed and shipped the complete web application, WhatsApp conversational webhook pipeline, and clinic credentialing portal. Delivered an accessible interface meeting WCAG 2.1 AA standards with seamless multi-currency support for cross-border care.',
          media: {
            type: 'image',
            url: '/src/assets/images/oia_surgery_planner_1790349765483.jpg',
            alt: 'Oia recovery companion timeline interface',
            screenName: 'Post-Op Recovery Companion',
            caption: 'Structured post-procedure check-ins, medication reminders, and direct surgeon escalation channel.',
            aspectRatio: '4:3',
          },
        },
        outcome: {
          metrics: [
            { num: 'Live', label: 'Shipped 0→1 across Web & WhatsApp' },
            { num: '4.9/5', label: 'Patient consultation trust rating' },
            { num: '0 Forms', label: '100% conversational patient onboarding' },
          ],
          callout:
            'By replacing marketing directories with calm clinical dialogue, patient consultation anxiety dropped by more than half.',
        },
      },
    },
    {
      id: 'proj-02-vccp',
      slug: 'vccp',
      title: 'VCCP',
      meta: 'Healthcare and fintech · Web and mobile · Senior Product Designer',
      description1:
        'At VCCP I designed for three regulated clients at once: Vitality, Pension Buddy and Cambridge Building Society. Health journeys, pensions and savings, turned into one plain-language question at a time.',
      description2:
        "All three products met WCAG 2.1 AA for the first time, and Vitality's 40% mobile bounce rate was resolved.",
      homeMedia: {
        type: 'image',
        url: '/src/assets/images/vccp_vitality_screens_1790349778524.jpg',
        alt: 'Vitality web and mobile screens laid out at an angle',
        label: 'assets/home/vccp.jpg  ·  4:3',
        aspectRatio: '4:3',
      },
      hasCaseStudy: true,
      caseStudy: {
        eyebrow: 'Fintech & Health Insurance · Enterprise · 2024',
        title: 'VCCP Client Suite',
        dek: 'Modernising digital health, pensions, and mutual banking experiences across three major regulated UK institutions.',
        meta: {
          role: 'Senior Product Designer',
          year: '2024',
          type: 'Enterprise Transformation',
          status: 'Shipped to 1.2M+ active policyholders',
        },
        audio: {
          enabled: true,
          url: '',
          label: 'Audio description',
          transcript: {
            challenge:
              'Pension Buddy and Vitality faced legacy compliance forms with dense financial jargon. Mobile bounce rates reached 40%, and screen reader accessibility audits failed mandatory UK standards.',
            approach:
              'We introduced a stepped disclosure pattern: asking one plain-language question per screen, calculating live estimates, and translating actuarial tables into visual progress milestones.',
            built:
              'Designed a shared design system of accessible calculation cards, retirement forecasting tools, and simplified health check claims that achieved WCAG 2.1 AA certification.',
          },
        },
        challenge: {
          label: 'The challenge',
          headline: 'Complex compliance forms and a 40% mobile abandonment rate.',
          body: 'Vitality and Pension Buddy suffered from multi-page legacy PDF-style forms. <b>40% of mobile users dropped off before completing their initial quote</b>, and visually impaired members could not navigate the pension projection graphs.',
          media: {
            type: 'image',
            url: '/src/assets/images/vccp_vitality_screens_1790349778524.jpg',
            alt: 'Legacy audit versus simplified mobile question screen',
            screenName: 'Vitality Stepped Question Flow',
            caption: 'Replacing 14-field insurance applications with progressive, single-topic conversational steps.',
            aspectRatio: '4:3',
          },
        },
        approach: {
          label: 'My approach',
          headline: 'Transforming actuarial jargon into one plain question at a time.',
          body: 'We conducted accessibility tests across age demographics and restructured the entire underwriting funnel. <b>Each question was rewritten in plain English</b> with inline contextual guidance and instantaneous visual feedback.',
          media: {
            type: 'image',
            url: '/src/assets/images/vccp_vitality_screens_1790349778524.jpg',
            alt: 'Design token library and accessible interactive components',
            screenName: 'Accessible Design System Components',
            caption: 'High-contrast sliders, accessible inputs, and screen-reader tested status indicators.',
            aspectRatio: '4:3',
          },
        },
        built: {
          label: 'What I built',
          headline: 'Universal design system and certified accessible insurance journeys.',
          body: 'Delivered production designs for Vitality Health, Pension Buddy retirement calculator, and Cambridge Building Society member portal. All journeys passed third-party accessibility audits at WCAG 2.1 AA level.',
          media: {
            type: 'image',
            url: '/src/assets/images/vccp_vitality_screens_1790349778524.jpg',
            alt: 'Vitality claims and member reward dashboard',
            screenName: 'Member Rewards & Health Tracking',
            caption: 'Real-time activity reward tracking and simplified one-click health benefit claims.',
            aspectRatio: '4:3',
          },
        },
        outcome: {
          metrics: [
            { num: 'WCAG AA', label: 'First 100% compliant audit score' },
            { num: '-40%', label: 'Mobile bounce rate resolved' },
            { num: '1.2M+', label: 'Active policyholders using the new interface' },
          ],
          callout:
            'Simplifying legal and medical questions into one clear question at a time lowered drop-off and made healthcare accessible to all.',
        },
      },
    },
    {
      id: 'proj-03-connectd',
      slug: 'connectd',
      title: 'Connectd',
      meta: 'Marketplace · Web · 2024 · Lead Product Designer',
      description1:
        'A marketplace where founders, investors and advisors find each other. I led design across all three sides, from onboarding to the match card where a recommendation becomes an introduction.',
      description2: 'Onboarding drop-off fell from 58% to 19%.',
      homeMedia: {
        type: 'image',
        url: '/src/assets/images/connectd_marketplace_1790349789329.jpg',
        alt: 'Connectd founder dashboard',
        label: 'assets/home/connectd.jpg  ·  4:3',
        aspectRatio: '4:3',
      },
      externalWebsiteUrl: 'https://connectd.co',
      hasCaseStudy: true,
      caseStudy: {
        eyebrow: 'Marketplace & Venture · 2024',
        title: 'Connectd',
        dek: 'Streamlining angel investing and advisor matchmaking by redesigning the founder card and multi-sided onboarding pipeline.',
        meta: {
          role: 'Lead Product Designer',
          year: '2024',
          type: 'Tri-sided Marketplace',
          status: 'Live at connectd.co',
        },
        audio: {
          enabled: true,
          url: '',
          label: 'Audio description',
          transcript: {
            challenge:
              'Founders spent 45 minutes entering pitch metrics, causing a 58% onboarding drop-off. Investors were overwhelmed by disorganized pitch deck summaries.',
            approach:
              'I created a rapid founder profile wizard that parsed Pitch decks automatically, highlighting the 4 key metrics investors actually care about: MRR, Growth, Team pedigree, and Capital raised.',
            built:
              'Designed the unified Founder Match Card, investor deal flow kanban, and frictionless one-click introduction requests across web and mobile.',
          },
        },
        challenge: {
          label: 'The challenge',
          headline: 'High onboarding friction and disorganized investor deal flow.',
          body: 'Founders faced an exhaustive onboarding questionnaire that required digging up legal documents and cap tables before seeing any platform value. <b>58% of new founder signups abandoned the process halfway</b>, leaving advisors and angel syndicates with empty pipelines.',
          media: {
            type: 'image',
            url: '/src/assets/images/connectd_marketplace_1790349789329.jpg',
            alt: 'Founder match card showing revenue traction and deck preview',
            screenName: 'Founder Match Card',
            caption: 'At-a-glance investment highlights showing runway, sector, round size, and advisory openings.',
            aspectRatio: '4:3',
          },
        },
        approach: {
          label: 'My approach',
          headline: 'Redesigning the onboarding loop around immediate proof of value.',
          body: 'We split onboarding into a lightweight 3-minute starter profile with automated pitch deck parsing. <b>Founders only answered critical criteria upfront</b>, unlocking immediate previews of matching venture partners and fractional CFOs.',
          media: {
            type: 'image',
            url: '/src/assets/images/connectd_marketplace_1790349789329.jpg',
            alt: 'Investor deal pipeline review interface',
            screenName: 'Investor Deal Pipeline',
            caption: 'Customizable deal-flow stages enabling angels to review, bookmark, and request introductions.',
            aspectRatio: '4:3',
          },
        },
        built: {
          label: 'What I built',
          headline: 'A tri-sided ecosystem connecting 8,000+ founders and investors.',
          body: 'Designed the complete founder dashboard, advisor booking calendar, and investor portfolio tracker. Built comprehensive design system documentation in Figma with robust states for desktop and mobile.',
          media: {
            type: 'image',
            url: '/src/assets/images/connectd_marketplace_1790349789329.jpg',
            alt: 'Advisor portfolio and advisory equity management',
            screenName: 'Advisor Portfolio Manager',
            caption: 'Transparent advisory agreement terms, sweat equity tracking, and verified introductions.',
            aspectRatio: '4:3',
          },
        },
        outcome: {
          metrics: [
            { num: '19%', label: 'Onboarding drop-off (down from 58%)' },
            { num: '8,000+', label: 'Active venture founders onboarded' },
            { num: '3.4x', label: 'Increase in accepted advisor intros' },
          ],
          callout:
            'Focusing on the 4 numbers investors care about transformed an arduous intake form into a high-converting deal engine.',
        },
      },
    },
    {
      id: 'proj-04-monolith',
      slug: 'project-04',
      title: 'Project Four',
      meta: 'Fintech · 2023 · Senior Product Designer',
      description1:
        'A mobile treasury management system that brings corporate yield accounts to early-stage startups and creative studios.',
      description2:
        'I led the mobile-first prototype, simplifying sweep account management into a single tactile balance slider.',
      homeMedia: {
        type: 'image',
        url: '/src/assets/images/candid_mobile_in_hand_1790349802556.jpg',
        alt: 'Hand holding phone showing treasury booking and balance slider screen',
        label: 'assets/home/project-04.jpg  ·  4:3',
        aspectRatio: '4:3',
      },
      hasCaseStudy: true,
      caseStudy: {
        eyebrow: 'Fintech · Mobile First · 2023',
        title: 'Project Four',
        dek: 'Simplifying institutional cash sweep management into an intuitive tactile mobile interface for founders.',
        meta: {
          role: 'Senior Product Designer',
          year: '2023',
          type: 'Mobile Web App',
          status: 'Acquired / Shipped',
        },
        audio: {
          enabled: false,
          url: '',
          label: 'Audio description',
          transcript: {
            challenge: 'Startups were losing yield because treasury portals required manual wire instructions and complex broker spreadsheets.',
            approach: 'We designed a tactile slider allowing founders to allocate operating cash vs automated treasury bill sweeps with one thumb.',
            built: 'Shipped a mobile-first responsive web app with biometric approval and automated tax-loss threshold alerts.',
          },
        },
        challenge: {
          label: 'The challenge',
          headline: 'Enterprise cash management felt like operating a terminal.',
          body: 'Corporate treasury portals required multi-page manual authorization and desktop hardware tokens. <b>Busy founders left idle balances in zero-interest checking accounts</b> because shifting capital was friction-heavy.',
          media: {
            type: 'image',
            url: '/src/assets/images/candid_mobile_in_hand_1790349802556.jpg',
            alt: 'Hand holding phone showing the balance allocation slider',
            screenName: 'Tactile Sweep Allocation',
            caption: 'Simple gesture slider showing guaranteed liquidity versus optimized annualized yield.',
            aspectRatio: '4:3',
          },
        },
        approach: {
          label: 'My approach',
          headline: 'Bringing consumer-grade clarity and tactile delight to treasury.',
          body: 'We developed a clean visual allocation slider that instantly simulates runway and projected interest earnings. <b>Every interaction was engineered for one-handed mobile confirmation.</b>',
          media: {
            type: 'image',
            url: '/src/assets/images/candid_mobile_in_hand_1790349802556.jpg',
            alt: 'Yield projection curve and interest earned dashboard',
            screenName: 'Runway Yield Simulator',
            caption: 'Live financial forecasting with automated interest reinvestment settings.',
            aspectRatio: '4:3',
          },
        },
        built: {
          label: 'What I built',
          headline: 'A complete mobile and tablet web app with biometric approvals.',
          body: 'Designed the mobile-first application, notification drawer, and accounting export sync for Xero and QuickBooks. Tested with 45 founder beta testers prior to company acquisition.',
          media: {
            type: 'image',
            url: '/src/assets/images/candid_mobile_in_hand_1790349802556.jpg',
            alt: 'Biometric authorization screen',
            screenName: 'Frictionless Sweep Authorization',
            caption: 'One-tap biometric approval replacing outdated physical hardware security fobs.',
            aspectRatio: '4:3',
          },
        },
        outcome: {
          metrics: [
            { num: '£180M+', label: 'Cash deposits managed in first 6 months' },
            { num: '4.8s', label: 'Average time to authorize a treasury sweep' },
            { num: '100%', label: 'Customer retention during pilot' },
          ],
          callout:
            'Treating business banking with consumer design simplicity unlocked hundreds of millions in idle startup capital.',
        },
      },
    },
    {
      id: 'proj-05-studio',
      slug: 'project-05',
      title: 'Project Five',
      meta: 'Brand and digital · 2022 · Design Lead',
      description1:
        'An architectural studio archive and publication showcase presenting civic regeneration projects across Western Europe.',
      description2:
        'Engineered an editorial grid that preserves delicate drawings alongside high-resolution documentary photography.',
      homeMedia: {
        type: 'image',
        url: '/src/assets/images/candid_mobile_in_hand_1790349802556.jpg',
        alt: 'Editorial architectural catalogue and interactive project archive',
        label: 'assets/home/project-05.jpg  ·  4:3',
        aspectRatio: '4:3',
      },
      hasCaseStudy: true,
      caseStudy: {
        eyebrow: 'Architecture & Editorial · 2022',
        title: 'Project Five',
        dek: 'Preserving the physical intimacy of architectural monograph publishing in an interactive, responsive web archive.',
        meta: {
          role: 'Design Lead',
          year: '2022',
          type: 'Digital Archive & Monograph',
          status: 'Archived / Award Winning',
        },
        audio: {
          enabled: false,
          url: '',
          label: 'Audio description',
          transcript: {
            challenge: 'Architectural websites often sacrifice technical blueprints for generic fullscreen photos.',
            approach: 'We developed an asymmetric two-column reading canvas pairing high-density technical elevations with spatial photography.',
            built: 'Delivered an archival web exhibition viewed by over 140,000 architects and design students worldwide.',
          },
        },
        challenge: {
          label: 'The challenge',
          headline: 'Digital portfolios flattening physical architectural craftsmanship.',
          body: 'Physical monographs provide a sense of scale, texture, and structural cadence that standard web templates ruin. <b>The client needed a digital archive that respected architectural blueprints without degrading vector linework</b>.',
          media: {
            type: 'image',
            url: '/src/assets/images/candid_mobile_in_hand_1790349802556.jpg',
            alt: 'Digital blueprint viewer and scale comparison tool',
            screenName: 'Vector Blueprint Inspection Canvas',
            caption: 'Ultra-crisp SVG architectural linework with real-world metric scale overlays.',
            aspectRatio: '4:3',
          },
        },
        approach: {
          label: 'My approach',
          headline: 'Balancing documentary photography with architectural precision.',
          body: 'We developed an editorial layout inspired by Swiss typography and classic architectural folios. <b>Subtle hairline dividers and generous whitespace</b> give each project the breathing room of a gallery.',
          media: {
            type: 'image',
            url: '/src/assets/images/candid_mobile_in_hand_1790349802556.jpg',
            alt: 'Editorial spread pairing construction photos with structural details',
            screenName: 'Documentary Construction Spread',
            caption: 'Dual-panel presentation connecting raw material selections with the finished civic structure.',
            aspectRatio: '4:3',
          },
        },
        built: {
          label: 'What I built',
          headline: 'A permanent digital monograph celebrating civic architecture.',
          body: 'Designed and deployed the static publication site, optimized for instantaneous loading with zero client-side dependencies. Awarded Site of the Day by leading international design juries.',
          media: {
            type: 'image',
            url: '/src/assets/images/candid_mobile_in_hand_1790349802556.jpg',
            alt: 'Index archive view with chronological sorting',
            screenName: 'Chronological Project Index',
            caption: 'Typographic index allowing curators and students to search by structural material, city, and year.',
            aspectRatio: '4:3',
          },
        },
        outcome: {
          metrics: [
            { num: '140k+', label: 'Global readers and architectural students' },
            { num: '< 0.8s', label: 'Average page load speed with zero bloat' },
            { num: '3 Awards', label: 'Design excellence and typography honors' },
          ],
          callout:
            'Digital portfolios should feel like unhurried art books: generous, rigorous, and completely free of distraction.',
        },
      },
    },
  ],
};
