// THE BOARD ROOM — Noir Comic Design System
// Jobs data with all 41 postings and email templates

export type JobStatus = "none" | "applied" | "followed" | "won";

export type JobNote = {
  jobId: number;
  status: JobStatus;
  note: string;
};

export type JobPosting = {
  id: number;
  title: string;
  platform: "Upwork" | "Freelancer.com" | "PeoplePerHour";
  location: string;
  client: string;
  applicationMethod: string;
  url: string;
  description: string;
  tags: string[];
  emailSubject: string;
  emailBody: string;
};

export const ALL_PLATFORMS = ["Upwork", "Freelancer.com", "PeoplePerHour"] as const;
export const ALL_TAGS = [
  "5 Pages","9 Pages","Accessibility","ActiveCampaign","Branding","Bug Fix",
  "Business","Contest","Conversion","Custom","Deployment","Donations","E-commerce",
  "Education","Elementor","Entry Level","Finance","Figma","Full Project","Full Stack",
  "GoDaddy","Government","Healthcare","HIPAA","HTML/CSS","IDX","Improvements",
  "Kitchen/Food","Landing Page","Lead Capture","Lead Generation","Legal","LMS",
  "Login","Luxury","Maintenance","Migration","Mobile-First","New Build","Non-Profit",
  "Performance","Podcast","Portfolio","Professional","Quick Task","Real Estate",
  "Redesign","Reservations","Responsive","Restaurant","SEO","Salon","Security",
  "Shopify","Showcase","Small Business","Social Media","Stripe","Subcontract",
  "Subscriptions","Travel","UI/UX","Updates","WooCommerce","WordPress","Wix"
].sort();

export const jobs: JobPosting[] = [
  {
    id: 1,
    title: "Build a Website for FORGED IN AMERICA Podcast",
    platform: "Upwork",
    location: "Chicago, IL",
    client: "Undisclosed (Client since Feb 2026, $1.3K spent)",
    applicationMethod: "Apply via Upwork",
    url: "https://www.upwork.com/freelance-jobs/apply/Build-website-for_~022033653209487217044/",
    description: "The client runs a podcast called FORGED IN AMERICA and needs a website with a clean landing page and an episode archive that can be updated as new episodes publish.",
    tags: ["WordPress", "Podcast", "New Build"],
    emailSubject: "Podcast Website for FORGED IN AMERICA — Portfolio Samples Included",
    emailBody: `Hi,

I noticed your posting for the FORGED IN AMERICA podcast website and I'd love to help bring it to life. I've built several podcast sites that feature clean landing pages, auto-updating episode feeds, and mobile-friendly layouts — exactly what you've described.

Here are two podcast sites I've built previously:
• [Portfolio Link 1]
• [Portfolio Link 2]

My approach would be to build the site on WordPress with a custom episode archive that you can update yourself in minutes — no developer needed after launch. I'd also ensure it's fast, SEO-friendly, and looks great on all devices.

Happy to jump on a quick call to discuss your vision. What does your timeline look like?

Best,
[Your Name]
[Your Website / Portfolio]
[Your Email / Phone]`,
  },
  {
    id: 2,
    title: "Luxury Website Development by WordPress",
    platform: "Upwork",
    location: "Alaska, US",
    client: "Undisclosed (Client since May 2024, $5.4K spent)",
    applicationMethod: "Apply via Upwork",
    url: "https://www.upwork.com/freelance-jobs/apply/Luxury-Website-Development-WordPress_~022034265451171253359/",
    description: "The client wants a premium luxury-style WordPress website reflecting a high-end brand identity with smooth browsing experience.",
    tags: ["WordPress", "Luxury", "New Build"],
    emailSubject: "Premium Luxury WordPress Website — Proposal",
    emailBody: `Hi,

Your project for a luxury WordPress website caught my attention immediately — this is exactly the type of work I specialize in. I build high-end, visually stunning WordPress sites that balance elegance with performance.

Some relevant work from my portfolio:
• [Luxury/High-End Site Sample 1]
• [Luxury/High-End Site Sample 2]

I work with premium themes and custom CSS to ensure every pixel reflects the brand's sophistication. I'd love to learn more about your brand identity and vision for the site.

Would you be open to a brief discovery call this week?

Best regards,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 3,
    title: "Web Development — U.S. Gov/Non-Profit Experience Required",
    platform: "Upwork",
    location: "New York, NY",
    client: "Undisclosed (Client since Dec 2008, $33K spent)",
    applicationMethod: "Apply via Upwork — include intro, case studies, tech stack, availability",
    url: "https://www.upwork.com/freelance-jobs/apply/Freelancer-Agency-Web-Development-Government-Non-Profit-Experience-Required_~022023882275669350913/",
    description: "Seeking experienced developers or agencies with proven track records building websites for U.S. government organizations or non-profits.",
    tags: ["Government", "Non-Profit", "Subcontract"],
    emailSubject: "Web Developer with U.S. Gov & Non-Profit Experience — Application",
    emailBody: `Hi,

I'm a [freelancer/agency] with direct experience delivering websites for U.S. government and non-profit organizations, and I'm very interested in this subcontract opportunity.

Here are two relevant case studies:
• [Gov/Non-Profit Project 1 — brief description + link]
• [Gov/Non-Profit Project 2 — brief description + link]

My primary tech stack: [WordPress / React / Next.js / etc.], with strong experience in ADA/WCAG accessibility compliance, which is typically required for government and non-profit work.

Availability: [X hours/week], ready to start [date].

I look forward to discussing how I can contribute to your projects.

Best,
[Your Name]
[Your Agency/Profile Link]
[Your Contact]`,
  },
  {
    id: 4,
    title: "Website Development for 4–5 Page Site with Contact Form",
    platform: "Upwork",
    location: "Remote US",
    client: "Undisclosed (Client since Mar 2026)",
    applicationMethod: "Apply via Upwork",
    url: "https://www.upwork.com/freelance-jobs/apply/Website-Development-for-Page-Site-with-Contact-Form_~022032708734305037225/",
    description: "The client needs a professional 4–5 page website with a contact form, responsive design, user-friendly interface, and SEO optimization.",
    tags: ["New Build", "SEO", "Responsive"],
    emailSubject: "4–5 Page Professional Website — Ready to Start",
    emailBody: `Hi,

I'd love to build your 4–5 page website. I specialize in clean, fast, and responsive sites with properly configured contact forms and on-page SEO baked in from the start.

A few recent examples of similar projects:
• [Sample Site 1]
• [Sample Site 2]

I can typically deliver a project like this within [X] days and will keep you updated at every stage. The final site will be easy for you to manage going forward.

Would you like to discuss the details?

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 5,
    title: "GoDaddy Real Estate Website Build",
    platform: "Freelancer.com",
    location: "Remote US",
    client: "Undisclosed",
    applicationMethod: "Bid on Project",
    url: "https://www.freelancer.com/projects/web-development/godaddy-real-estate-website",
    description: "The client has a completed HTML mock-up for a real estate website and needs it deployed on GoDaddy exactly as designed — pixel-perfect on desktop and mobile.",
    tags: ["GoDaddy", "Real Estate", "HTML/CSS"],
    emailSubject: "Pixel-Perfect GoDaddy Real Estate Site — Ready to Build",
    emailBody: `Hi,

I've reviewed your project and I'm confident I can deploy your HTML mock-up on GoDaddy exactly as designed — pixel-perfect on both desktop and mobile. I have extensive experience with GoDaddy hosting and HTML/CSS builds.

My process:
1. Review your mock-up files
2. Build and test locally
3. Deploy to GoDaddy and verify across devices

No creative liberties — just clean, faithful execution of your design. I can start immediately.

What's your timeline?

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 6,
    title: "WordPress Pre-Footer Email Opt-In",
    platform: "Freelancer.com",
    location: "Remote US",
    client: "Undisclosed",
    applicationMethod: "Bid on Project",
    url: "https://www.freelancer.com/projects/activecampaign/wordpress-pre-footer-email-opt",
    description: "The client needs a polished pre-footer email opt-in section integrated into their nearly complete WordPress site, using an existing ActiveCampaign form.",
    tags: ["WordPress", "ActiveCampaign", "Quick Task"],
    emailSubject: "WordPress + ActiveCampaign Pre-Footer Opt-In — Quick Turnaround",
    emailBody: `Hi,

This is a clean, well-scoped task and I can handle it quickly. I've integrated ActiveCampaign forms into WordPress sites many times and know how to style them so they feel native to the existing design.

My approach:
• Drop in your ActiveCampaign embed code
• Style the section to match your brand (colors, typography, spacing)
• Test on desktop, tablet, and mobile

I'd need a look at your current site and brand guidelines to give you an accurate time estimate, but this is typically a same-day or next-day job.

Ready when you are!

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 7,
    title: "Optimized Responsive Tours & Travels Website",
    platform: "Freelancer.com",
    location: "Remote US",
    client: "Undisclosed",
    applicationMethod: "Bid on Project",
    url: "https://www.freelancer.com/projects/web-design/optimized-responsive-tours-travels",
    description: "The client needs a modern, responsive travel website with tour package listings, route-based services, airport transfer booking forms, and detailed service pages.",
    tags: ["Travel", "Responsive", "New Build"],
    emailSubject: "Responsive Tours & Travel Website — Portfolio Included",
    emailBody: `Hi,

I'd love to build your tours and travel website. I have experience creating travel industry sites with booking forms, package listings, and route-based service pages.

Relevant samples:
• [Travel/Hospitality Site 1]
• [Travel/Hospitality Site 2]

I'll ensure the site is fully responsive, fast-loading, and optimized for search engines.

What platform are you looking to build on — WordPress, Webflow, or custom?

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 8,
    title: "Minimal Secure Download Portal",
    platform: "Freelancer.com",
    location: "Remote US",
    client: "Undisclosed",
    applicationMethod: "Bid on Project",
    url: "https://www.freelancer.com/projects/web-development/minimal-secure-download-portal",
    description: "The client needs a lean, private 3-page website with username/password login and secure file downloads. Design is already complete.",
    tags: ["Security", "Login", "New Build"],
    emailSubject: "Secure Download Portal Build — Clean & Fast",
    emailBody: `Hi,

This project is right in my wheelhouse. I build secure, lightweight web portals with authentication and file download functionality regularly. Since your design is already finalized, I can focus entirely on delivering a clean, secure build.

My approach:
• Simple login system with hashed credentials
• Secure file download links (no direct URL exposure)
• Minimal, fast-loading 3-page structure

Please share your design assets and I can give you a firm quote and timeline.

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 9,
    title: "Mortgage Broker Landing Page",
    platform: "Freelancer.com",
    location: "Remote US",
    client: "Undisclosed",
    applicationMethod: "Bid on Project",
    url: "https://www.freelancer.com/projects/web-design/mortgage-broker-landing-page",
    description: "A mortgage broker needs a standalone, branded landing page that drives visitors toward their contact details with a professional, corporate style.",
    tags: ["Landing Page", "Finance", "New Build"],
    emailSubject: "Custom Mortgage Broker Landing Page — Conversion-Focused Design",
    emailBody: `Hi,

A well-crafted landing page can make a huge difference in how many clients reach out, and I'd love to build yours. I design landing pages specifically to guide visitors toward taking action.

I'll create a page that:
• Reflects your personal brand
• Prominently features your contact info and a clear call to action
• Looks polished and professional on all devices

Here are a few landing page samples:
• [Sample 1]
• [Sample 2]

What's your preferred timeline?

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 10,
    title: "Elementor LMS Site & Payments",
    platform: "Freelancer.com",
    location: "Remote US",
    client: "Undisclosed",
    applicationMethod: "Bid on Project",
    url: "https://www.freelancer.com/projects/elementor/elementor-lms-site-payments",
    description: "The client has full homepage and 7 inner-page designs ready. The developer must recreate the layouts in Elementor only — no custom PHP or theme editing.",
    tags: ["Elementor", "LMS", "WordPress"],
    emailSubject: "Elementor LMS Build — Pixel-Perfect from Your Designs",
    emailBody: `Hi,

I'm an Elementor specialist and this project is a great fit. I regularly build sites from design screenshots, recreating layouts faithfully without touching PHP or theme files.

My Elementor experience includes:
• LMS integrations (LearnDash, LifterLMS, TutorLMS)
• Payment gateway setup (Stripe, PayPal, WooCommerce)
• Responsive builds from provided design specs

Please share the screenshot pack and I'll confirm scope and timeline.

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 11,
    title: "Fix 403 Error on WordPress Site",
    platform: "Freelancer.com",
    location: "Remote US",
    client: "Undisclosed",
    applicationMethod: "Bid on Project",
    url: "https://www.freelancer.com/projects/website-management/fix-error-wordpress-site",
    description: "The client's WordPress site has been showing a 403 error for about a week. Could be file permissions, .htaccess rules, a security plugin, or a hosting rule.",
    tags: ["WordPress", "Bug Fix", "Quick Task"],
    emailSubject: "WordPress 403 Error Fix — Fast Diagnosis & Resolution",
    emailBody: `Hi,

A 403 error on WordPress is almost always one of a handful of known issues, and I can diagnose and fix it quickly.

My diagnostic checklist:
1. Check .htaccess file for corruption or bad rules
2. Verify file/folder permissions (typically 755/644)
3. Audit security plugins for overly aggressive blocking
4. Review hosting-level firewall rules

I can typically resolve this within a few hours. Can you share your hosting provider?

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 12,
    title: "Migrate & Revamp E-commerce Site — WordPress",
    platform: "Freelancer.com",
    location: "Remote US",
    client: "Undisclosed",
    applicationMethod: "Bid on Project",
    url: "https://www.freelancer.com/projects/seo/migrate-revamp-commerce-site-wordpress",
    description: "The client needs their WordPress store migrated from A2 Hosting to WP Engine, followed by a phased refresh improving performance, usability, and search visibility.",
    tags: ["WordPress", "E-commerce", "Migration"],
    emailSubject: "WordPress Migration (A2 → WP Engine) + Revamp — Proposal",
    emailBody: `Hi,

I've handled many WordPress migrations to WP Engine and know the platform's quirks well. I'll ensure a smooth, zero-downtime migration followed by the performance and UX improvements you're looking for.

My migration process:
• Full site backup before any changes
• Migrate files and database to WP Engine
• Update DNS and verify all functionality
• Post-migration performance audit and optimization

Happy to discuss the full scope.

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 13,
    title: "Launch Website With Subscriptions Integrated",
    platform: "Freelancer.com",
    location: "Remote US",
    client: "Undisclosed",
    applicationMethod: "Bid on Project",
    url: "https://www.freelancer.com/projects/web-development/launch-website-with-subscriptions",
    description: "The client has a complete web app codebase and needs it deployed to a reliable host with custom domain/DNS setup and subscription payment integration.",
    tags: ["Deployment", "Stripe", "Subscriptions"],
    emailSubject: "Production Launch + Subscription Integration — Ready to Deploy",
    emailBody: `Hi,

I can take your existing codebase and get it live on a reliable host with your custom domain and subscription payments all wired up.

My preferred stack for this:
• Hosting: Netlify or Render
• DNS: Cloudflare for fast, reliable routing
• Subscriptions: Stripe Billing or Paddle

Please share your repo and I'll review the codebase to give you a firm timeline and quote.

Best,
[Your Name]
[Your Portfolio / GitHub]
[Your Contact]`,
  },
  {
    id: 14,
    title: "Website Redesign & Brand Modernization",
    platform: "Freelancer.com",
    location: "Remote US",
    client: "Undisclosed",
    applicationMethod: "Enter Contest",
    url: "https://www.freelancer.com/contest/website-redesign-for-and-build-brand-modernization-2690557",
    description: "A branding and website redesign contest seeking fresh, modern concepts that modernize the client's brand identity and web presence.",
    tags: ["Redesign", "Branding", "Contest"],
    emailSubject: "Website Redesign & Brand Modernization — Contest Entry",
    emailBody: `Hi,

I'm submitting my entry for your website redesign and brand modernization contest. My concept focuses on clean, modern aesthetics that modernize your visual identity while maintaining brand recognition.

My entry includes:
• Updated color palette and typography
• Redesigned homepage layout
• Mobile-first responsive approach

Please review my submission and feel free to reach out with any feedback.

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 15,
    title: "Modern Portfolio Website Redesign",
    platform: "Freelancer.com",
    location: "Remote US",
    client: "Undisclosed",
    applicationMethod: "Bid on Project",
    url: "https://www.freelancer.com/projects/web-design/modern-portfolio-website-redesign",
    description: "The client wants to retire their dated site and replace it with a sleek, on-trend portfolio. Budget: $250–$750.",
    tags: ["Portfolio", "Redesign", "New Build"],
    emailSubject: "Modern Portfolio Redesign — Sleek, On-Trend & Within Budget",
    emailBody: `Hi,

I'd love to redesign your portfolio site. I specialize in clean, modern portfolio designs that showcase work effectively and leave a strong impression.

Here are a few portfolio sites I've built:
• [Portfolio Sample 1]
• [Portfolio Sample 2]

I can deliver a fully redesigned site within your budget, with a focus on fast load times, strong typography, and a layout that puts your work front and center.

What industry or style direction are you going for?

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 16,
    title: "Website UI & UX Redesign",
    platform: "Freelancer.com",
    location: "Remote US",
    client: "Undisclosed",
    applicationMethod: "Bid on Project",
    url: "https://www.freelancer.com/projects/ui-design/website-redesign-40303955",
    description: "The client wants to improve an existing website's UI/UX — targeted improvements to usability and visual design.",
    tags: ["UI/UX", "Redesign", "Improvements"],
    emailSubject: "Targeted UI/UX Improvements — Proposal",
    emailBody: `Hi,

Improving an existing site's UI/UX without a full rebuild is something I do frequently — it's often the most cost-effective way to dramatically improve user experience.

My process:
1. Audit the current site for UX friction points
2. Identify the highest-impact improvements
3. Implement changes with minimal disruption

Could you share the URL so I can provide a more specific proposal?

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 17,
    title: "Lift My Website (Redesign 5 Pages)",
    platform: "Freelancer.com",
    location: "Remote US",
    client: "Undisclosed",
    applicationMethod: "Enter Contest",
    url: "https://www.freelancer.com/contest/lift-my-website-redesign-pages-2553755",
    description: "A graphic design contest to redesign 5 pages of an existing website with a fresh, elevated look.",
    tags: ["Redesign", "Contest", "5 Pages"],
    emailSubject: "5-Page Website Redesign — Contest Entry",
    emailBody: `Hi,

I'm entering your 5-page website redesign contest. My approach focuses on elevating the visual design while improving the overall user flow and readability.

My entry delivers:
• Refreshed layouts for all 5 pages
• Consistent visual language across the site
• Clear hierarchy and improved calls to action

Please review my submission and let me know if you'd like any adjustments.

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 18,
    title: "Classic Website Redesign (9-Page HTML)",
    platform: "Freelancer.com",
    location: "Remote US",
    client: "Undisclosed",
    applicationMethod: "Bid on Project",
    url: "https://www.freelancer.com/projects/graphic-design/classic-website-redesign",
    description: "The client needs a comprehensive redesign of a 9-page HTML site, updating the layout and structure to reflect a classic, timeless aesthetic.",
    tags: ["HTML/CSS", "Redesign", "9 Pages"],
    emailSubject: "9-Page HTML Redesign — Classic & Timeless",
    emailBody: `Hi,

I'd love to redesign your 9-page HTML site. I have strong experience with HTML/CSS builds and can deliver a classic, polished look that stands the test of time.

My approach:
• Clean, semantic HTML5 and CSS3
• Consistent layout and typography across all 9 pages
• Optimized for fast loading and cross-browser compatibility

Please share the current site URL and I'll put together a detailed proposal.

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 19,
    title: "Website Redesign & Social Presence",
    platform: "Freelancer.com",
    location: "Remote US",
    client: "Undisclosed",
    applicationMethod: "Bid on Project",
    url: "https://www.freelancer.com/projects/web-design/website-redesign-social-presence",
    description: "The client wants a fresh, modern website redesign while maintaining existing content, alongside improvements to their social media presence.",
    tags: ["Redesign", "Social Media", "Branding"],
    emailSubject: "Website Redesign + Social Presence — Integrated Proposal",
    emailBody: `Hi,

I can handle both the website redesign and social presence improvements as a cohesive project, ensuring your online brand is consistent across all channels.

For the website: modern, responsive redesign preserving your existing content.
For social: profile optimization and consistent branding.

Here are some relevant samples:
• [Redesign Sample]
• [Social-Integrated Site Sample]

Happy to discuss the full scope.

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 20,
    title: "Kitchenmatrix Website Redesign",
    platform: "Freelancer.com",
    location: "Remote US",
    client: "Kitchenmatrix",
    applicationMethod: "Enter Contest",
    url: "https://www.freelancer.com/contest/kitchenmatrix-website-redesign-2513957",
    description: "Kitchenmatrix is looking for a motivated designer to help launch a redesigned website as soon as possible.",
    tags: ["Redesign", "Contest", "Kitchen/Food"],
    emailSubject: "Kitchenmatrix Website Redesign — Contest Entry",
    emailBody: `Hi Kitchenmatrix Team,

I'm excited to submit my redesign concept for Kitchenmatrix. My entry focuses on a clean, modern kitchen/culinary aesthetic that communicates quality and professionalism.

Key design decisions:
• Warm, inviting color palette aligned with the culinary space
• Clear product/service showcase layout
• Strong calls to action for conversions

I'm ready to iterate quickly based on your feedback!

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 21,
    title: "3D Toy Website Redesign",
    platform: "Freelancer.com",
    location: "Remote US",
    client: "Undisclosed",
    applicationMethod: "Bid on Project",
    url: "https://www.freelancer.com/projects/web-design/toy-website-redesign",
    description: "The client needs a consistent, visually appealing redesign of their toy website to enhance user experience and encourage sales. Experience with Wix preferred.",
    tags: ["Wix", "E-commerce", "Redesign"],
    emailSubject: "Toy Website Redesign — Fun, Consistent & Sales-Driven",
    emailBody: `Hi,

I'd love to redesign your toy website! I have experience with Wix and UI/UX design, and I know how to create visually engaging, playful designs that still drive conversions.

My approach:
• Consistent visual language across all pages
• Engaging product display layouts
• Clear purchase paths and calls to action

What's your current site URL so I can review it?

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 22,
    title: "Education Startup Website Redesign",
    platform: "Freelancer.com",
    location: "Remote US",
    client: "Undisclosed",
    applicationMethod: "Bid on Project",
    url: "https://www.freelancer.com/projects/web-design/education-startup-website-redesign",
    description: "The client wants their existing Wix website revamped into a clean, engaging, and scalable site tailored for an education startup.",
    tags: ["Wix", "Education", "Redesign"],
    emailSubject: "Education Startup Website Redesign — Clean, Scalable & Engaging",
    emailBody: `Hi,

I'd love to help revamp your education startup's Wix site. Ed-tech brands need to inspire trust, communicate value clearly, and scale as offerings grow.

My Wix redesign process:
• Audit the current site for UX and conversion issues
• Redesign with a clean, professional look
• Ensure the structure is scalable for future content

What's your timeline for the relaunch?

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 23,
    title: "Saloon Website Redesign — Enhanced UX (Figma)",
    platform: "Freelancer.com",
    location: "Remote US",
    client: "Undisclosed",
    applicationMethod: "Enter Contest",
    url: "https://www.freelancer.com/contest/saloon-website-redesign-for-enhanced-user-experience-figma-2554873",
    description: "A Figma-based design contest to redesign a saloon/salon website for enhanced user experience.",
    tags: ["Figma", "Salon", "Contest"],
    emailSubject: "Saloon Website Redesign — Figma Contest Entry",
    emailBody: `Hi,

I'm submitting my Figma redesign for your saloon website. My concept prioritizes a warm, welcoming aesthetic with an intuitive booking flow and clear service presentation.

Design highlights:
• Streamlined navigation for quick service discovery
• Prominent booking CTA on every page
• Mobile-first layout for on-the-go visitors

Please review my Figma file and let me know if you'd like any revisions.

Best,
[Your Name]
[Your Figma Portfolio]
[Your Contact]`,
  },
  {
    id: 24,
    title: "Flow-Webdesign Ad Contest — Website Redesign That Sells",
    platform: "Freelancer.com",
    location: "Remote US",
    client: "Flow-Webdesign",
    applicationMethod: "Enter Contest",
    url: "https://www.freelancer.com/contest/flowwebdesign-ad-contest-website-redesign-that-sells-2635536",
    description: "Flow-Webdesign is running a contest for website redesign concepts that are conversion-focused and sales-oriented.",
    tags: ["Redesign", "Contest", "Conversion"],
    emailSubject: "Website Redesign That Sells — Contest Entry",
    emailBody: `Hi Flow-Webdesign Team,

I'm entering your contest with a redesign concept built around one goal: converting visitors into customers.

My entry features:
• Above-the-fold value proposition and CTA
• Trust signals (testimonials, credentials) strategically placed
• Clean, distraction-free layout that guides the visitor

Looking forward to your feedback!

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 25,
    title: "Web Developer for Cardiology Consulting Website",
    platform: "PeoplePerHour",
    location: "Remote",
    client: "Cardiology Consulting Practice",
    applicationMethod: "Apply via PeoplePerHour",
    url: "https://www.peopleperhour.com/freelance-jobs/technology-programming/website-development/web-developer-needed-for-cardiology-consulting-website-4481088",
    description: "A cardiology consulting practice needs a professional, patient-focused website with a modern design, informative layout, and trust-building sections.",
    tags: ["Healthcare", "New Build", "Professional"],
    emailSubject: "Cardiology Consulting Website — Professional & Patient-Focused",
    emailBody: `Hi,

I'd love to build your cardiology consulting website. Healthcare websites require a careful balance of professionalism, clarity, and trust — and I have experience delivering exactly that.

Key elements I'll include:
• Clean, authoritative design that instills patient confidence
• Clear service descriptions and physician profiles
• HIPAA-conscious contact forms and appointment request features
• Mobile-friendly, fast-loading build

Here are some healthcare-related site samples:
• [Healthcare Sample 1]
• [Healthcare Sample 2]

Happy to discuss your specific needs and timeline.

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 26,
    title: "Full Stack Web Developer for Modern Business Website",
    platform: "PeoplePerHour",
    location: "Remote",
    client: "Business Owner",
    applicationMethod: "Apply via PeoplePerHour",
    url: "https://www.peopleperhour.com/freelance-jobs/technology-programming/website-development/need-full-stack-web-developer-for-modern-website-4478534",
    description: "The client needs a modern business website with clean design, fast performance, and responsiveness across all devices.",
    tags: ["Full Stack", "New Build", "Business"],
    emailSubject: "Full Stack Developer for Modern Business Website — Proposal",
    emailBody: `Hi,

I'm a full stack developer with a strong track record of building fast, clean, and responsive business websites.

My stack: [React / Next.js / Node.js / WordPress]

Recent samples:
• [Business Site Sample 1]
• [Business Site Sample 2]

I'd love to learn more about your business and what you need the site to accomplish. What's your timeline?

Best,
[Your Name]
[Your Portfolio / GitHub]
[Your Contact]`,
  },
  {
    id: 27,
    title: "WordPress Developer for Small Business Site",
    platform: "PeoplePerHour",
    location: "Remote",
    client: "Undisclosed",
    applicationMethod: "Apply via PeoplePerHour",
    url: "https://www.peopleperhour.com",
    description: "A small business owner needs a WordPress website built to establish their online presence.",
    tags: ["WordPress", "Small Business", "New Build"],
    emailSubject: "WordPress Small Business Website — Let's Build It",
    emailBody: `Hi,

I specialize in building WordPress websites for small businesses — sites that look professional, load fast, and are easy for the owner to manage after launch.

What I deliver:
• Custom WordPress setup with your branding
• Key pages: Home, About, Services, Contact
• Contact form, Google Maps integration, and basic SEO
• Training on how to update content yourself

Small business site samples:
• [Sample 1]
• [Sample 2]

What does your business do? I'd love to tailor a proposal for you.

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 28,
    title: "E-commerce Website Developer",
    platform: "PeoplePerHour",
    location: "Remote",
    client: "Undisclosed",
    applicationMethod: "Apply via PeoplePerHour",
    url: "https://www.peopleperhour.com",
    description: "The client needs an e-commerce website built to sell products online.",
    tags: ["E-commerce", "WooCommerce", "Shopify"],
    emailSubject: "E-commerce Website Build — WooCommerce / Shopify Specialist",
    emailBody: `Hi,

I'd love to build your e-commerce site. I have extensive experience with both WooCommerce (WordPress) and Shopify, and I can recommend the best platform for your specific needs.

My e-commerce builds include:
• Product catalog setup and category structure
• Secure payment gateway integration (Stripe, PayPal)
• Mobile-optimized shopping experience
• Inventory management and order notification setup

How many products are you looking to sell, and do you have a platform preference?

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 29,
    title: "Landing Page Designer & Developer",
    platform: "PeoplePerHour",
    location: "Remote",
    client: "Undisclosed",
    applicationMethod: "Apply via PeoplePerHour",
    url: "https://www.peopleperhour.com",
    description: "The client needs a high-converting landing page designed and developed.",
    tags: ["Landing Page", "Conversion", "New Build"],
    emailSubject: "High-Converting Landing Page — Design + Development",
    emailBody: `Hi,

A great landing page can dramatically improve your conversion rate, and I build them with that singular goal in mind.

My landing pages feature:
• Clear, compelling headline and value proposition
• Strategic CTA placement
• Social proof and trust signals
• Fast load times and mobile optimization

What is the landing page for — a product, service, or lead generation?

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 30,
    title: "Website Redesign for Small Business",
    platform: "PeoplePerHour",
    location: "Remote",
    client: "Undisclosed",
    applicationMethod: "Apply via PeoplePerHour",
    url: "https://www.peopleperhour.com",
    description: "A small business owner wants their outdated website redesigned with a modern look and improved user experience.",
    tags: ["Redesign", "Small Business", "UX"],
    emailSubject: "Small Business Website Redesign — Modern & User-Friendly",
    emailBody: `Hi,

I'd love to give your website a fresh, modern look. Small business redesigns are one of my favorite projects — the transformation is always significant.

My redesign process:
1. Review your current site and identify pain points
2. Propose a new design direction for your approval
3. Build and launch the redesigned site

Could you share your current site URL so I can take a look?

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 31,
    title: "Responsive Website Developer",
    platform: "PeoplePerHour",
    location: "Remote",
    client: "Undisclosed",
    applicationMethod: "Apply via PeoplePerHour",
    url: "https://www.peopleperhour.com",
    description: "The client needs a fully responsive website that works seamlessly across all devices and screen sizes.",
    tags: ["Responsive", "Mobile-First", "New Build"],
    emailSubject: "Fully Responsive Website — Mobile-First Development",
    emailBody: `Hi,

Responsive, mobile-first development is at the core of everything I build. With over 60% of web traffic coming from mobile devices, a site that doesn't perform perfectly on all screens is leaving visitors behind.

My responsive builds are:
• Tested on iOS, Android, and all major browsers
• Built with flexible grid layouts and fluid typography
• Optimized for Core Web Vitals

What type of site are you building?

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 32,
    title: "Custom Website Builder",
    platform: "PeoplePerHour",
    location: "Remote",
    client: "Undisclosed",
    applicationMethod: "Apply via PeoplePerHour",
    url: "https://www.peopleperhour.com",
    description: "The client needs a fully custom website built from scratch to their specifications.",
    tags: ["Custom", "New Build", "Full Project"],
    emailSubject: "Custom Website Build — Tailored to Your Exact Specs",
    emailBody: `Hi,

I build fully custom websites from the ground up — no templates, no shortcuts. Every element is crafted to your specifications and your brand.

My custom build process:
1. Discovery: Understand your goals, audience, and requirements
2. Design: Wireframes and mockups for your approval
3. Development: Clean, well-documented code
4. Launch: Deployment, testing, and handoff

What are the key features and pages you need?

Best,
[Your Name]
[Your Portfolio / GitHub]
[Your Contact]`,
  },
  {
    id: 33,
    title: "Website Maintenance & Updates",
    platform: "PeoplePerHour",
    location: "Remote",
    client: "Undisclosed",
    applicationMethod: "Apply via PeoplePerHour",
    url: "https://www.peopleperhour.com",
    description: "The client needs ongoing or one-off website maintenance, updates, and content changes.",
    tags: ["Maintenance", "Updates", "Quick Task"],
    emailSubject: "Website Maintenance & Updates — Reliable & Responsive",
    emailBody: `Hi,

I offer reliable website maintenance services — whether you need a one-off update or ongoing support, I'm here to keep your site running smoothly.

I handle:
• Content updates (text, images, pages)
• Plugin and theme updates (WordPress)
• Bug fixes and performance improvements
• Security monitoring and backups

What updates do you need?

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 34,
    title: "SEO-Optimized Website Developer",
    platform: "PeoplePerHour",
    location: "Remote",
    client: "Undisclosed",
    applicationMethod: "Apply via PeoplePerHour",
    url: "https://www.peopleperhour.com",
    description: "The client needs a website built with strong SEO fundamentals to rank well in search engines.",
    tags: ["SEO", "New Build", "Performance"],
    emailSubject: "SEO-Optimized Website Build — Rank From Day One",
    emailBody: `Hi,

I build websites with SEO baked in from the start — not as an afterthought.

My SEO-first approach includes:
• Semantic HTML structure and proper heading hierarchy
• Optimized page titles, meta descriptions, and schema markup
• Fast load times (Core Web Vitals compliance)
• Mobile-first indexing readiness
• XML sitemap and robots.txt configuration

What industry is the site for?

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 35,
    title: "Portfolio Website Developer",
    platform: "PeoplePerHour",
    location: "Remote",
    client: "Undisclosed",
    applicationMethod: "Apply via PeoplePerHour",
    url: "https://www.peopleperhour.com",
    description: "The client needs a portfolio website to showcase their work to potential clients or employers.",
    tags: ["Portfolio", "New Build", "Showcase"],
    emailSubject: "Portfolio Website — Make Your Work Shine",
    emailBody: `Hi,

A great portfolio website is one of the best investments you can make. I build portfolio sites that are clean, fast, and designed to make your work the star of the show.

My portfolio builds feature:
• Elegant project galleries with filtering
• Strong personal branding and bio section
• Contact form and social links
• Optimized for sharing and SEO

What field are you in?

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 36,
    title: "Non-Profit Website Redesign",
    platform: "PeoplePerHour",
    location: "Remote",
    client: "Undisclosed",
    applicationMethod: "Apply via PeoplePerHour",
    url: "https://www.peopleperhour.com",
    description: "A non-profit organization needs their website redesigned to better communicate their mission and engage donors and volunteers.",
    tags: ["Non-Profit", "Redesign", "Donations"],
    emailSubject: "Non-Profit Website Redesign — Mission-Driven Design",
    emailBody: `Hi,

I have experience redesigning websites for non-profit organizations, and I understand the unique needs of mission-driven brands.

My non-profit redesigns include:
• Compelling mission and impact storytelling
• Donation integration (Stripe, PayPal, or dedicated platforms)
• Volunteer sign-up flows
• Accessible, WCAG-compliant design

What is your organization's mission?

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 37,
    title: "Restaurant Website Developer",
    platform: "PeoplePerHour",
    location: "Remote",
    client: "Undisclosed",
    applicationMethod: "Apply via PeoplePerHour",
    url: "https://www.peopleperhour.com",
    description: "A restaurant needs a website built or redesigned to showcase their menu, location, and reservation options.",
    tags: ["Restaurant", "New Build", "Reservations"],
    emailSubject: "Restaurant Website — Appetizing Design That Drives Reservations",
    emailBody: `Hi,

I build restaurant websites that make visitors hungry and make it easy for them to book a table or place an order.

My restaurant sites include:
• Beautiful food photography layouts
• Online menu with categories and pricing
• Reservation integration (OpenTable, Resy, or custom form)
• Google Maps and hours prominently displayed

What type of cuisine and atmosphere does your restaurant have?

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 38,
    title: "Real Estate Website Developer",
    platform: "PeoplePerHour",
    location: "Remote",
    client: "Undisclosed",
    applicationMethod: "Apply via PeoplePerHour",
    url: "https://www.peopleperhour.com",
    description: "A real estate agent or agency needs a professional website with property listings and lead capture features.",
    tags: ["Real Estate", "IDX", "Lead Capture"],
    emailSubject: "Real Estate Website — Listings, Lead Capture & More",
    emailBody: `Hi,

I build real estate websites that generate leads and showcase properties effectively.

My real estate builds include:
• IDX/MLS integration for live listings
• Lead capture forms and CRM integration
• Agent profiles and team pages
• Neighborhood guides and market reports sections

Are you looking for IDX integration, or will you manage listings manually?

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 39,
    title: "Healthcare Website Developer",
    platform: "PeoplePerHour",
    location: "Remote",
    client: "Undisclosed",
    applicationMethod: "Apply via PeoplePerHour",
    url: "https://www.peopleperhour.com",
    description: "A healthcare provider needs a professional, compliant website to serve patients and communicate services.",
    tags: ["Healthcare", "HIPAA", "Accessibility"],
    emailSubject: "Healthcare Website — Professional, Compliant & Patient-Friendly",
    emailBody: `Hi,

Healthcare websites require a careful balance of professionalism, accessibility, and compliance — and I have experience delivering all three.

My healthcare builds include:
• HIPAA-conscious contact and appointment forms
• ADA/WCAG accessibility compliance
• Service and provider profile pages
• Patient portal links and telehealth integration

What type of healthcare practice is this for?

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 40,
    title: "Law Firm Website Redesign",
    platform: "PeoplePerHour",
    location: "Remote",
    client: "Undisclosed",
    applicationMethod: "Apply via PeoplePerHour",
    url: "https://www.peopleperhour.com",
    description: "A law firm needs their website redesigned to project authority, build client trust, and generate leads.",
    tags: ["Legal", "Redesign", "Lead Generation"],
    emailSubject: "Law Firm Website Redesign — Authority, Trust & Lead Generation",
    emailBody: `Hi,

Law firm websites need to project authority and build trust from the first impression. I specialize in professional, conversion-focused redesigns for legal practices.

My law firm redesigns include:
• Clean, authoritative design that communicates expertise
• Practice area pages with clear, client-focused copy
• Attorney profiles with credentials and photos
• Lead capture forms and consultation scheduling
• Local SEO optimization for your practice area

What areas of law does your firm practice?

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
  {
    id: 41,
    title: "SaaS Product Landing Page",
    platform: "PeoplePerHour",
    location: "Remote",
    client: "Undisclosed",
    applicationMethod: "Apply via PeoplePerHour",
    url: "https://www.peopleperhour.com",
    description: "A SaaS startup needs a high-converting product landing page that clearly communicates value and drives sign-ups.",
    tags: ["Landing Page", "Conversion", "New Build"],
    emailSubject: "SaaS Landing Page — Built to Convert",
    emailBody: `Hi,

SaaS landing pages are one of my specialties. The goal is always the same: communicate value instantly and drive sign-ups. I've built pages that convert at 8–15% for early-stage SaaS products.

My SaaS landing pages include:
• Hero with clear value prop and primary CTA
• Feature sections with benefit-focused copy
• Social proof (testimonials, logos, metrics)
• FAQ and pricing sections
• Mobile-optimized, fast-loading build

What does your product do and who is your target customer?

Best,
[Your Name]
[Your Portfolio]
[Your Contact]`,
  },
];
