import { PDFDocument, StandardFonts, rgb, grayscale } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

async function generateResumePdf() {
  const pdfDoc = await PDFDocument.create();
  
  // Standard fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const fontBoldItalic = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);

  // Colors
  const cBlack = rgb(0.08, 0.08, 0.08);
  const cDark = rgb(0.18, 0.18, 0.18);
  const cMuted = rgb(0.38, 0.38, 0.38);
  const cBlue = rgb(0.05, 0.35, 0.65);
  const cRule = rgb(0.8, 0.8, 0.8);
  const cAccent = rgb(0.1, 0.23, 0.17); // Dark forest green

  // Page dimensions (Letter: 612 x 792)
  const pageWidth = 612;
  const pageHeight = 792;
  const marginX = 40;
  const marginTop = 40;
  const marginBottom = 40;
  const contentWidth = pageWidth - marginX * 2;

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let currentY = pageHeight - marginTop;

  function checkPageBreak(neededHeight: number) {
    if (currentY - neededHeight < marginBottom) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      currentY = pageHeight - marginTop;
      return true;
    }
    return false;
  }

  function drawHorizontalRule(thickness = 0.75, color = cRule, spaceBelow = 8) {
    checkPageBreak(spaceBelow + 4);
    currentPage.drawLine({
      start: { x: marginX, y: currentY },
      end: { x: pageWidth - marginX, y: currentY },
      thickness,
      color,
    });
    currentY -= spaceBelow;
  }

  function drawSectionHeader(title: string) {
    checkPageBreak(28);
    currentY -= 6;
    currentPage.drawText(title.toUpperCase(), {
      x: marginX,
      y: currentY,
      size: 10.5,
      font: fontBold,
      color: cAccent,
    });
    currentY -= 4;
    currentPage.drawLine({
      start: { x: marginX, y: currentY },
      end: { x: pageWidth - marginX, y: currentY },
      thickness: 1,
      color: cAccent,
    });
    currentY -= 9;
  }

  function wrapText(text: string, font: any, size: number, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, size);
      if (width <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  function drawParagraph(text: string, font = fontRegular, size = 9, color = cDark, lineHeight = 12) {
    const lines = wrapText(text, font, size, contentWidth);
    for (const line of lines) {
      checkPageBreak(lineHeight);
      currentPage.drawText(line, {
        x: marginX,
        y: currentY,
        size,
        font,
        color,
      });
      currentY -= lineHeight;
    }
  }

  function drawBullet(text: string, font = fontRegular, size = 8.5, color = cDark, lineHeight = 11.5, bulletChar = '•') {
    const bulletIndent = 12;
    const availableWidth = contentWidth - bulletIndent;
    const lines = wrapText(text, font, size, availableWidth);

    checkPageBreak(lines.length * lineHeight + 2);
    
    // Draw bullet symbol
    currentPage.drawText(bulletChar, {
      x: marginX + 2,
      y: currentY,
      size: size,
      font: fontBold,
      color: cAccent,
    });

    for (let i = 0; i < lines.length; i++) {
      currentPage.drawText(lines[i], {
        x: marginX + bulletIndent,
        y: currentY,
        size,
        font,
        color,
      });
      currentY -= lineHeight;
    }
  }

  // ==================== DOCUMENT HEADER ====================
  // Name
  currentPage.drawText('ASHISH KUMAR TRIPATHI', {
    x: marginX,
    y: currentY,
    size: 18,
    font: fontBold,
    color: cAccent,
  });
  currentY -= 15;

  // Title
  currentPage.drawText('Full Stack Developer | MERN Stack | React | Next.js | Node.js', {
    x: marginX,
    y: currentY,
    size: 10,
    font: fontBold,
    color: cDark,
  });
  currentY -= 14;

  // Contact Row 1
  const contactRow1 = '+91 8004485646  |  ashishtring@gmail.com  |  Mayur Vihar-I, Delhi 110091';
  currentPage.drawText(contactRow1, {
    x: marginX,
    y: currentY,
    size: 8.5,
    font: fontRegular,
    color: cMuted,
  });
  currentY -= 12;

  // Contact Row 2: Links
  const linkRow = 'LinkedIn: linkedin.com/in/ashish-kumar-tripathi-aa67a8148  |  GitHub: github.com/Ashish2614';
  currentPage.drawText(linkRow, {
    x: marginX,
    y: currentY,
    size: 8.5,
    font: fontRegular,
    color: cBlue,
  });
  currentY -= 8;

  // ==================== PROFESSIONAL SUMMARY ====================
  drawSectionHeader('Professional Summary');
  drawParagraph(
    'Full Stack Developer with hands-on experience building responsive web applications and RESTful APIs using React.js, Next.js, Node.js, Express.js, MongoDB, Supabase PostgreSQL, and modern JavaScript/TypeScript. Skilled in authentication, role-based access control, CRUD workflows, relational data modeling, API integration, Git/GitHub collaboration, and cloud deployment. Focused on maintainable code, usable interfaces, and end-to-end delivery.',
    fontRegular,
    8.5,
    cDark,
    11.5
  );
  currentY -= 4;

  // ==================== TECHNICAL SKILLS ====================
  drawSectionHeader('Technical Skills');

  const skills: { category: string; list: string }[] = [
    { category: 'Languages', list: 'JavaScript (ES6+), TypeScript, HTML5, CSS3, SQL' },
    { category: 'Frontend', list: 'React.js, Next.js, Redux Toolkit, Vite, Tailwind CSS, Bootstrap, responsive design, accessibility' },
    { category: 'Backend', list: 'Node.js, Express.js, REST APIs, authentication, JWT, role-based authorization, CRUD operations, Gmail Enquiry / Nodemailer Automation' },
    { category: 'Databases', list: 'MongoDB, Mongoose, Supabase PostgreSQL, Row Level Security (RLS)' },
    { category: 'Tools & Platforms', list: 'Git, GitHub, Postman, VS Code, Vercel, Render, Supabase, FormSubmit, Razorpay Payment Gateway, Gmail API' },
    { category: 'AI Development Tools', list: 'Google AI Studio, Codex, Antigravity' },
  ];

  for (const sk of skills) {
    checkPageBreak(12);
    const catText = `${sk.category}: `;
    const catWidth = fontBold.widthOfTextAtSize(catText, 8.5);

    currentPage.drawText(catText, {
      x: marginX,
      y: currentY,
      size: 8.5,
      font: fontBold,
      color: cBlack,
    });

    const lines = wrapText(sk.list, fontRegular, 8.5, contentWidth - catWidth);
    if (lines.length > 0) {
      currentPage.drawText(lines[0], {
        x: marginX + catWidth,
        y: currentY,
        size: 8.5,
        font: fontRegular,
        color: cDark,
      });
      currentY -= 11.5;

      for (let i = 1; i < lines.length; i++) {
        checkPageBreak(11.5);
        currentPage.drawText(lines[i], {
          x: marginX + 15,
          y: currentY,
          size: 8.5,
          font: fontRegular,
          color: cDark,
        });
        currentY -= 11.5;
      }
    }
  }
  currentY -= 4;

  // ==================== PROFESSIONAL EXPERIENCE ====================
  drawSectionHeader('Professional Experience');

  // Experience 1
  checkPageBreak(16);
  currentPage.drawText('MERN Stack Developer Intern | S O INFOTECH (P) LTD.', {
    x: marginX,
    y: currentY,
    size: 9,
    font: fontBold,
    color: cBlack,
  });
  const durationText = '6 Months';
  const durWidth = fontBold.widthOfTextAtSize(durationText, 8.5);
  currentPage.drawText(durationText, {
    x: pageWidth - marginX - durWidth,
    y: currentY,
    size: 8.5,
    font: fontBold,
    color: cMuted,
  });
  currentY -= 12;

  drawBullet('Contributed to ShopMart, a full-stack MERN e-commerce application, by developing responsive React interfaces and reusable UI components.');
  drawBullet('Built and integrated RESTful APIs with Node.js and Express.js for products, categories, users, authentication, and cart workflows.');
  drawBullet('Integrated MongoDB through Mongoose and implemented CRUD operations, API data handling, and frontend-backend integration.');
  drawBullet('Used Git and GitHub for version control, collaboration, debugging, and iterative feature delivery.');
  currentY -= 4;

  // Experience 2
  checkPageBreak(14);
  currentPage.drawText('Full Stack Developer | Freelance / Personal Projects', {
    x: marginX,
    y: currentY,
    size: 9,
    font: fontBold,
    color: cBlack,
  });
  currentY -= 12;
  drawBullet('Built and deployed full-stack applications end to end, including frontend interfaces, Express REST APIs, authentication, database integration, testing, Git workflows, and cloud deployment.');
  currentY -= 4;

  // ==================== SELECTED PROJECTS ====================
  drawSectionHeader('Selected Projects');

  interface ProjectItem {
    title: string;
    tech: string;
    bullets: string[];
    links?: string;
  }

  const projects: ProjectItem[] = [
    {
      title: 'AShK Stays & Studios — Boutique E-Commerce & Hospitality Platform',
      tech: 'React, TypeScript, Vite, Tailwind CSS, Express.js, Razorpay API, Gmail Enquiry / Nodemailer, Vercel',
      bullets: [
        'Built and deployed a full-stack boutique e-commerce and property advisory platform featuring dynamic curated collections, interactive suite tours, cart drawer management, and responsive UI.',
        'Integrated Razorpay payment gateway supporting domestic UPI, Netbanking, and debit/credit cards with secure cryptographic signature verification, server-side price reconciliation, and order tracking.',
        'Engineered an automated Gmail enquiry and consultation booking pipeline with server-side validation, rate-limiting, honeypot spam protection, and real-time customer notifications.',
        'Configured responsive, accessible design with Tailwind CSS, client-side routing, and Vercel serverless deployment.',
      ],
      links: 'GitHub: github.com/Ashish2614/AShK_-Studios',
    },
    {
      title: 'OpsPilot — Business Operations & Help Desk SaaS',
      tech: 'React, Vite, JavaScript, Express.js, Supabase PostgreSQL/Auth, RLS, REST APIs, Vercel, Render',
      bullets: [
        'Built a role-aware internal help desk SaaS for admins, agents, and employees, including ticket lifecycle workflows, comments, assignment, dashboard analytics, and CSV export.',
        'Implemented Supabase Auth, PostgreSQL foreign keys and RLS, Express business logic, notifications, due-date jobs, responsive UI, and deployment-ready configuration.',
      ],
      links: 'GitHub: github.com/Ashish2614/OpsPilot | Frontend: opspilot-green.vercel.app | Backend: opspilot-mua0.onrender.com',
    },
    {
      title: 'Krefzo Automation Website',
      tech: 'Next.js, TypeScript, React, Tailwind CSS, Lucide, Vercel, FormSubmit',
      bullets: [
        'Built and deployed a conversion-focused AI automation services website for lead generation and discovery-call bookings.',
        'Created responsive service, case study, FAQ, and contact flows with SEO metadata, Open Graph tags, JSON-LD schema, and reduced-motion support.',
      ],
      links: 'GitHub: github.com/Ashish2614/automation_website | Live: automation-website-gray.vercel.app',
    },
    {
      title: 'HueCraft — Color Palette Generator',
      tech: 'React, Vite, JavaScript, CSS, Browser APIs',
      bullets: [
        'Built a responsive color tool with harmony modes, locked colors, HEX editing, clipboard actions, shareable URLs, exports, favorites, and recent history.',
        'Added dark mode, keyboard generation, accessibility, searchable FAQ guidance, and local-storage fallbacks.',
      ],
      links: 'GitHub: github.com/Ashish2614/Color_Palette_Generator | Live: color-palette-generator-seven-rosy.vercel.app',
    },
    {
      title: 'ShopMart — E-commerce Application',
      tech: 'React.js, Node.js, Express.js, MongoDB, Mongoose',
      bullets: [
        'Developed product browsing, search, filtering, cart management, admin workflows, REST APIs, and MongoDB data models for products, categories, users, and authentication.',
      ],
    },
    {
      title: 'Devbhoomi Trails — Himalayan Travel Platform',
      tech: 'React, Vite, JavaScript, Tailwind CSS, Supabase, Lucide React, Vercel',
      bullets: [
        'Built and deployed a responsive travel platform for Himachal Pradesh and Uttarakhand with destination discovery, seasonal packages, itinerary modals, FAQs, and guided tour flows.',
        'Implemented a custom trip cost calculator, Supabase-backed booking and inquiry forms, WhatsApp booking handoff, responsive accessibility, and reusable component-driven UI.',
      ],
      links: 'GitHub: github.com/Ashish2614/DevbhoomiTrails | Live: devbhoomi-trails.vercel.app',
    },
    {
      title: 'Global Vista — Country Explorer',
      tech: 'React, Vite, JavaScript, REST Countries API, Wikimedia Commons, OpenStreetMap, Vercel',
      bullets: [
        'Built a responsive country discovery platform with live search, flags, maps, favorites, time zones, languages, administrative divisions, and tourist places with real photographs.',
        'Implemented dark/light themes, accessible UI, animated profile sections, API fallbacks, live clocks, state/province search, and lazy-loaded destination imagery.',
      ],
      links: 'GitHub: github.com/Ashish2614/Global_Vista | Live: vercel.com/ak-b08e/global-vista',
    },
    {
      title: 'HireFlow — Applicant Tracking System',
      tech: 'React, Vite, JavaScript, Express.js, PostgreSQL-ready API, Vercel, Render',
      bullets: [
        'Built a responsive recruitment SaaS interface for job discovery, recruiter dashboards, candidate applications, pipeline stages, interviews, notifications, and analytics.',
        'Implemented dark/light themes, timezone-aware recruiter greetings, responsive navigation, REST API foundations, SPA routing, and deployment-ready Vercel and Render configuration.',
      ],
      links: 'GitHub: github.com/Ashish2614/HireFlow | Frontend: hire-flow-fawn-theta.vercel.app | Backend: hireflow-ddzt.onrender.com',
    },
  ];

  for (const proj of projects) {
    checkPageBreak(30);
    currentPage.drawText(proj.title, {
      x: marginX,
      y: currentY,
      size: 9,
      font: fontBold,
      color: cBlack,
    });
    currentY -= 11;

    currentPage.drawText(proj.tech, {
      x: marginX,
      y: currentY,
      size: 8,
      font: fontItalic,
      color: cMuted,
    });
    currentY -= 10;

    for (const b of proj.bullets) {
      drawBullet(b, fontRegular, 8, cDark, 11);
    }

    if (proj.links) {
      checkPageBreak(12);
      currentPage.drawText(proj.links, {
        x: marginX + 12,
        y: currentY,
        size: 7.5,
        font: fontRegular,
        color: cBlue,
      });
      currentY -= 11;
    }
    currentY -= 3;
  }

  // ==================== ADDITIONAL STRENGTHS ====================
  drawSectionHeader('Additional Strengths');
  drawParagraph(
    'Responsive web development | Component-driven architecture | API integration | Debugging and problem solving | Version control | AI-assisted development | Clean, maintainable code',
    fontRegular,
    8.5,
    cDark,
    11.5
  );
  currentY -= 4;

  // ==================== EDUCATION ====================
  drawSectionHeader('Education');
  
  checkPageBreak(24);
  currentPage.drawText('• B.Tech in Electrical and Electronics Engineering', {
    x: marginX + 2,
    y: currentY,
    size: 8.5,
    font: fontBold,
    color: cBlack,
  });
  const edu1Details = ' | Sharda University | 2020 | CGPA: 8.4';
  const edu1Width = fontBold.widthOfTextAtSize('• B.Tech in Electrical and Electronics Engineering', 8.5);
  currentPage.drawText(edu1Details, {
    x: marginX + 2 + edu1Width,
    y: currentY,
    size: 8.5,
    font: fontRegular,
    color: cDark,
  });
  currentY -= 12;

  currentPage.drawText('• M.A. in Public Administration', {
    x: marginX + 2,
    y: currentY,
    size: 8.5,
    font: fontBold,
    color: cBlack,
  });
  const edu2Details = ' | IGNOU | 2021-2024';
  const edu2Width = fontBold.widthOfTextAtSize('• M.A. in Public Administration', 8.5);
  currentPage.drawText(edu2Details, {
    x: marginX + 2 + edu2Width,
    y: currentY,
    size: 8.5,
    font: fontRegular,
    color: cDark,
  });
  currentY -= 12;

  // ==================== PAGE NUMBERS ====================
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;
  pages.forEach((page, index) => {
    const pageNumText = `Ashish Kumar Tripathi — Resume | Page ${index + 1} of ${totalPages}`;
    const numWidth = fontRegular.widthOfTextAtSize(pageNumText, 7.5);
    page.drawText(pageNumText, {
      x: (pageWidth - numWidth) / 2,
      y: marginBottom / 2,
      size: 7.5,
      font: fontRegular,
      color: cMuted,
    });
  });

  // Write to public directory
  const pdfBytes = await pdfDoc.save();
  const outputPath = path.resolve(process.cwd(), 'public', 'Ashish_Kumar_Tripathi_Resume.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`PDF generated successfully at: ${outputPath} (${pdfBytes.length} bytes, ${totalPages} pages)`);
}

generateResumePdf().catch((err) => {
  console.error('Error generating resume PDF:', err);
  process.exit(1);
});
