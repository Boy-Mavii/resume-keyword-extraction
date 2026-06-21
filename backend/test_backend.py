from nlp_engine import process_resume

test_text = """
John Doe
Software Engineer
Email: john.doe@example.com
Phone: (123) 456-7890
Location: San Francisco, CA

Skills:
Python, JavaScript, React, FastAPI, Docker, Machine Learning.

Experience:
Senior Developer at Tech Corp (2018 - Present)
- Developed various applications using Python and React.
- Lead a team of developers in an Agile environment.

Education:
B.S. in Computer Science from University of California, Berkeley.
"""

if __name__ == "__main__":
    samples = [
        ("Sample 1", """
Abdulkabeer Olanrewaju
Software Engineer
Lagos, Nigeria | +234 777 292 75 | olanrewajuabdulkabeer576@gmail.com | linkedin.com/in/abdulkabeer-olanrewaju | github.com/olakayCoder1
About Me
Passionate software engineer with 4+ years of hands-on experience crafting pixel-perfect, performant, and accessible user interfaces for fintech and verification platforms that serve millions of users.
Specialized in building modern, scalable frontends with React, Next.js, TypeScript, and Tailwind CSS while maintaining a strong full-stack foundation (Node.js/NestJS, Python/Django). Proven ability to own the entire frontend lifecycle, from design system implementation and component architecture to performance optimization, accessibility, and seamless API integration.
Deep interest in fraud prevention UIs, real-time dashboards, complex data visualization, and integrating generative AI/RAG-powered features into intuitive user experiences. Outside coding, I create frontend-focused tech content, experiment with AI-assisted UI tools, play football, and travel.
Professional Experience
Malead Technologies (Moniass Technology Limited)
Senior Frontend Engineer | Feb 2025 – Present
Lead frontend development for a high-volume cryptocurrency trading and lending platform processing thousands of transactions daily.
Own the entire UI layer using Next.js 14 (App Router), TypeScript, Tailwind CSS, and shadcn/ui
Designed and shipped a component library and design system adopted across  product teams, reducing UI inconsistencies by 90%
Implemented advanced features: real-time order books (WebSocket + Redis), dark mode, responsive trading dashboards, KYC flows
Improved Lighthouse scores from 62 → 97 (Performance) and achieved 100% Accessibility through systematic auditing
Reduced frontend bundle size by 45% using dynamic imports, code splitting, and Next.js Image optimization
Led migration from React class components to functional components + React Server Components
Stack: Next.js 14, React 18, TypeScript, TailwindCSS, shadcn/ui, TanStack Query, Zustand, WebSockets, Redis, Docker, AWS, Kubernetes
IdentityPass by Prembly
Full-Stack Engineer → Frontend Engineer | 2022 – Present 
Progressed from intern to owning the entire frontend architecture for Africa’s leading identity verification and AML platform.
Architected and maintained a Next.js + TypeScript monorepo serving verification dashboards used by 500+ enterprises
Built reusable verification widget SDK embedded in 100+ client websites with React + Tailwind + vanilla JS fallback
Designed complex user flows: multi-step KYC, document upload with live OCR feedback, facial biometrics, risk scoring UI
Implemented real-time monitoring dashboards with WebSocket updates and Chart.js / Recharts visualizations
Reduced customer support tickets related to UI/UX by 65% through proactive usability testing and heatmapping
Championed accessibility (WCAG 2.1 AA), achieving 100% compliance across all customer-facing products
Stack: React, Next.js, TypeScript, TailwindCSS, NestJS (backend), PostgreSQL, DynamoDB, Redis, AWS Lambda/SQS, Docker, Kubernetes
Zeronspace
Frontend & Backend Engineer | Apr 2021 – Nov 2022
Early engineer on an inventory & warehouse management SaaS used by retail chains across Nigeria.
Built responsive admin dashboard and mobile-friendly operator interfaces with React and Material-UI.
Implemented real-time stock tracking, barcode scanning UI, and searchable data tables with filtering & pagination
Collaborated closely with designers to translate Figma designs into reusable, maintainable components
Stack: React, Material-UI, Python/Django, PostgreSQL, REST APIs
Education
University of Ilorin
B.Sc. Computer Science | Graduated July 2025
Altschool Africa
Diploma in Software Engineering (Frontend Track) | 2023
Google Africa Scholarship recipient (top 5% cohort)
Technical Skills
Core Frontend
Next.js (App Router & Pages), React 18+, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, Framer Motion, TanStack Query, Zustand/Jotai, React Hook Form, Zod
UI/UX & Performance
Responsive & Mobile-First Design, Accessibility (WCAG), Lighthouse/CI optimization, Web Vitals, Bundle analysis, Design Systems, Figma → Code
Testing & Quality
Jest, React Testing Library, Cypress, Playwright, Storybook, Chromatic
Backend (still comfortable)
Node.js, NestJS, Python/Django, REST & GraphQL, PostgreSQL, DynamoDB, Redis, Docker, Kubernetes, AWS (Lambda, SQS, ECS, CloudFront)
Tools
Git/GitHub, GitLab CI, Postman, VS Code, Chrome DevTools, Vercel, SonarQube, Sentry, Datadog, Linear/Jira
Key Achievements
Reduced average page load time from 4.8s → 1.2s on a flagship fintech product (Next.js + Edge)
Built a design system adopted by 5+ teams (200+ components, Storybook + Chromatic)
Achieved 100% Lighthouse Accessibility score on all customer-facing verification products
Open-source contributor to shadcn/ui and several Tailwind component libraries
"""),
        ("Sample 2", """
ABAM VANESSA
Lagos State, Nigeria
Phone: 0813 063 0087 | 0701 023 1605
Email: vanessabam111@gmail.com
Portfolio: behance.net/vanessaabam/moodboards

PROFESSIONAL SUMMARY
Detail-oriented and self-driven Computer Science graduate with hands-on experience supporting business growth through research, content operations, data organization, and digital outreach. Proven ability to identify target audiences, manage structured data, collaborate cross-functionally, and support marketing and sales initiatives in remote environments. Seeking a Lead Generation Intern role to build practical experience in B2B sales development, market research, and CRM-driven growth strategies.

CORE COMPETENCIES
Lead Research & Prospect Identification
Market & Competitive Research
Data Organization & Spreadsheet Management
CRM & Prospect Database Support (Apollo-like tools familiarity)
Email & Digital Outreach Support
Reporting & Performance Tracking
Cross-team Collaboration (Sales & Marketing)
Remote Work & Time Management

EDUCATION
B.Sc. (Hons) Computer Science
University of Ilorin, Nigeria
Certification: Web, Graphics & UI/UX Design
NIIT
Senior Secondary School Certificate (SSCE)
Soltabaj Royal College | 2013 – 2018

PROFESSIONAL EXPERIENCE
ClippaPay — Content Editor, Research & Digital Operations Support
Remote | Full-time | Present
Conduct research on target audiences, small businesses, and startups to support content strategy and customer acquisition efforts.
Build and maintain structured content and prospect-related data using spreadsheets and digital tools.
Support outreach initiatives by creating and managing digital assets used in email and social media campaigns.
Collaborate with marketing and growth teams to align content with business objectives and lead acquisition goals.
Track engagement metrics and assist in reporting content and campaign performance.
Maintain organized digital records to support scalability and cross-team access.

Royal Regency Schools — Teacher
Lagos | 2022 – 2023
Managed student records and performance data with accuracy and confidentiality.
Developed clear written and verbal communication skills through structured instruction and reporting.
Demonstrated strong organizational and time-management capabilities in a fast-paced environment.

Dorato International Schools — Teacher
Lagos | 2021 – 2022
Conducted structured lesson planning and progress tracking.
Strengthened analytical skills through performance evaluation and reporting.

Anniz Finest Boutique — Sales Personnel
Lagos | 2020
Assisted customers and supported sales conversations, contributing to customer acquisition and retention.
Handled transaction records and supported inventory and visual merchandising activities.
Developed interpersonal and persuasive communication skills relevant to sales environments.

TECHNICAL SKILLS
Data & Tools: Spreadsheets (Google Sheets, Excel), CRM concepts (Apollo-like platforms)
Programming: HTML, CSS
Design & Digital Tools: Adobe Photoshop, Illustrator, InDesign, Figma, Canva
Video Editing: CapCut, Adobe Premiere Pro

SOFT SKILLS
Strong written and verbal communication
Research and analytical thinking
Attention to detail and accuracy
Self-motivated and highly organized
Comfortable working independently in remote teams
Quick learner with high adaptability
"""),
        ("Sample 3", """
AbdulKabeer Olanrewaju
Backend Software Engineer
olanrewajuabdulkabeer576@gmail.com | +2349082455489 | +2347077729275 | Lagos,, Nigeria
Summary
Backend software engineer with over 3 years of experience designing and building scalable, secure systems using Python/Django, Java/Spring Boot, Node.js/NestJS, and AWS. Expertise in developing RESTful APIs, user onboarding, identity verification, and financial applications, including cryptocurrency and loan systems. Proven track record in delivering high-performance solutions for fraud detection and transaction monitoring. Passionate about creating innovative applications and contributing to impactful projects.
Technical Skills
Languages/Frameworks: Python (Django, Flask), Java (Spring Boot), Node.js (NestJS), JavaScript (React.js)
Databases: PostgreSQL, MySQL, DynamoDB
Tools/Technologies: AWS, Redis, Docker, SQS, TailwindCSS, Git, Figma, Jira, Slack, VSCode
Methodologies: Agile, RESTful API Development, Microservices
Education
Bachelor of Science in Computer Science | University of Ilorin
June 2021 – June 2025
Diploma in Backend Engineering | AltSchool
February 2022 – April 2023

Professional Experience
Moniass Technology Limited
Backend Software Engineer | January 2025 – Present
Develop scalable RESTful APIs for cryptocurrency and loan applications using Node.js and NestJS, enabling secure transaction processing and user management.
Design and implement microservices architecture to support high-volume financial transactions, improving system reliability by 20%.
Collaborate with cross-functional teams to integrate third-party payment gateways and blockchain APIs, enhancing application functionality.
Utilize AWS and Docker for deployment, ensuring high availability and performance for financial services.
Prembly
Backend Software Engineer | May 2023 – December 2024
Built scalable RESTful APIs and microservices using Python, Java, PostgreSQL, and AWS, enhancing fraud detection and identity verification systems for millions of users.
Led development of user onboarding and transaction monitoring systems for the 3MTT federal project, ensuring scalability and reliability.
Implemented Anti-Money Laundering (AML) features using dynamic programming and concurrent web scraping, reducing fraud incidents by 15%.
Worked in an agile environment, leveraging SQS and Lambda for efficient data processing.
AltSchool
Backend Engineering Student | February 2022 – April 2023
Designed and deployed a RESTful API using Flask for a loan management website, integrated with PostgreSQL and hosted on PythonAnywhere.
Developed a two-factor authentication system, improving platform security and user trust.
Collaborated in a team of six to build and deploy a scalable web application, enhancing loan processing efficiency.
KampusBox by ZeroSpace
Backend Developer Intern | April 2022 – July 2022
Integrated payment gateways and third-party services (e.g., inventory management, CRM) to streamline operations and improve user experience.
Collaborated with front-end developers to ensure seamless client-server communication, reducing API response time by 10ms.
Projects
Identify Share API | Java, Spring Boot, MySQL, Identitypass
Built a secure RESTful API to manage and share user identities (e.g., Phone, BVN, NIN) with email-based access restrictions.
Integrated Identitypass for identity verification and encrypted sensitive data to ensure privacy.
GitHub: Identify API Repository
LoanIt Web Application | Python, Django, React.js, Paystack, Prembly
Developed a full-stack loan request platform with secure payment processing via Paystack and CAC verification via Prembly.
Built a responsive frontend using React.js and TailwindCSS for a seamless user experience across devices.
GitHub: Backend | Frontend | Live: LoanIt
Student Management System API | Python, Flask, PostgreSQL
Created a RESTful API for managing student data, courses, and performance tracking with secure authentication.
Optimized PostgreSQL database for efficient data retrieval, supporting complex queries for performance tracking.
GitHub: Student Management API
Certifications
Programming in Python, SoloLearn, 2022
Python for Data Science, Coursera, 2022
Participant, Prembly Hackathon, 2022
Languages
English (Fluent)
Yoruba (Native)
Interests
Open Source Collaboration, Football, Sports
"""),
    ]
    for label, sample_text in samples:
        print(f"\n--- {label} ---")
        results = process_resume(sample_text)
        print(f"Name: {results['name']}")
        print(f"Contact: {results['contact']}")
        print(f"Entities: {results['entities']}")
        print(f"Skills: {results['skills']}")
        print(f"Keywords: {results['keywords']}")
