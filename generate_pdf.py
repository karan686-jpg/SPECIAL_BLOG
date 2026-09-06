import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """Canvas that performs two-pass rendering to add 'Page X of Y' and header/footer."""
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (Only on page 2 and later)
        if self._pageNumber > 1:
            self.drawString(45, 11 * 72 - 32, "SPECIAL_BLOG — Full-Stack AI Mega Blog Platform | Placement Verification Report")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(45, 11 * 72 - 36, 8.5 * 72 - 45, 11 * 72 - 36)
        
        # Footer on all pages
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(45, 40, 8.5 * 72 - 45, 40)
        
        repo_text = "GitHub: https://github.com/karan686-jpg/SPECIAL_BLOG.git"
        page_text = f"Page {self._pageNumber} of {page_count}"
        
        self.drawString(45, 28, repo_text)
        self.drawRightString(8.5 * 72 - 45, 28, page_text)
        self.restoreState()


def generate_project_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=45,
        rightMargin=45,
        topMargin=45,
        bottomMargin=45
    )

    styles = getSampleStyleSheet()
    
    # Custom colors
    primary_color = colors.HexColor("#0F172A")   # Slate 900
    accent_blue   = colors.HexColor("#1D4ED8")   # Blue 700
    teal_dark     = colors.HexColor("#0F766E")   # Teal 700
    dark_gray     = colors.HexColor("#334155")   # Slate 700
    light_bg      = colors.HexColor("#F8FAFC")   # Slate 50
    card_border   = colors.HexColor("#CBD5E1")   # Slate 300
    header_bg     = colors.HexColor("#1E293B")   # Slate 800

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=primary_color,
        spaceAfter=3
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=accent_blue,
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=primary_color,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=dark_gray,
        spaceBefore=6,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=dark_gray,
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'BulletStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=dark_gray,
        leftIndent=10,
        firstLineIndent=-8,
        spaceAfter=3
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        textColor=dark_gray
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=colors.white
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#0F172A")
    )

    story = []

    # Title & Subtitle
    story.append(Paragraph("SPECIAL_BLOG — Full-Stack AI Mega Blog Platform", title_style))
    story.append(Paragraph("Project Technical Documentation & Verification Report for College Placement", subtitle_style))

    # Meta Info Card (Table)
    meta_data = [
        [
            Paragraph("<b>Candidate / Developer:</b> Karan Datta", table_cell),
            Paragraph("<b>Core Stack:</b> MERN (React 19, Node.js, Express, MongoDB)", table_cell)
        ],
        [
            Paragraph("<b>GitHub Repository:</b> <font color='#1D4ED8'><u>https://github.com/karan686-jpg/SPECIAL_BLOG.git</u></font>", table_cell),
            Paragraph("<b>Integrations:</b> Google Gemini 2.0 AI, ImageKit CDN, JWT", table_cell)
        ],
        [
            Paragraph("<b>Project Category:</b> Capstone Full-Stack Web Application", table_cell),
            Paragraph("<b>Verification Target:</b> Technical Placement & Academic Review", table_cell)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[270, 252])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), light_bg),
        ('BOX', (0, 0), (-1, -1), 1, card_border),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, card_border),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 8))

    # 1. Executive Summary
    story.append(Paragraph("1. Executive Summary & Objective", h1_style))
    story.append(Paragraph(
        "<b>SPECIAL_BLOG</b> is a full-stack, AI-integrated digital blogging and content management platform built using the <b>MERN Stack (MongoDB, Express, React 19, Node.js)</b>. "
        "The project provides a comprehensive content-publishing ecosystem featuring <b>Generative AI assistance (Google Gemini)</b> for automated blog post generation, <b>Quill.js WYSIWYG text editing</b>, <b>ImageKit cloud CDN</b> for automated WebP media compression, secure <b>JWT-based dual-role authentication (User/Admin)</b>, interactive community engagement (real-time likes and threaded comments), and a dedicated <b>Creator Analytics Engine</b>.",
        body_style
    ))

    # 2. Technology Stack Architecture
    story.append(Paragraph("2. Technical Stack & Architecture", h1_style))
    tech_data = [
        [Paragraph("Layer / Area", table_header), Paragraph("Technologies Used", table_header), Paragraph("Key Role & Implementation Details", table_header)],
        [
            Paragraph("<b>Frontend Core</b>", table_cell),
            Paragraph("React 19, Vite, React Router v7", table_cell),
            Paragraph("Modern component architecture, client-side routing, Fast Refresh via Vite.", table_cell)
        ],
        [
            Paragraph("<b>Styling & UX</b>", table_cell),
            Paragraph("Tailwind CSS v4, Motion, Lucide Icons", table_cell),
            Paragraph("Responsive layout, interactive animations, clean visual hierarchy, toasts.", table_cell)
        ],
        [
            Paragraph("<b>Rich Text Editor</b>", table_cell),
            Paragraph("Quill.js, Marked", table_cell),
            Paragraph("WYSIWYG article creation with heading tags, quotes, bold/italic, and code blocks.", table_cell)
        ],
        [
            Paragraph("<b>Backend Server</b>", table_cell),
            Paragraph("Node.js, Express.js v5, CORS, Dotenv", table_cell),
            Paragraph("Modular REST API architecture, middleware authentication pipelines, error handling.", table_cell)
        ],
        [
            Paragraph("<b>Database & ODM</b>", table_cell),
            Paragraph("MongoDB, Mongoose ODM v9", table_cell),
            Paragraph("Relational schema design, population queries, views/likes indexing, cascade cleanup.", table_cell)
        ],
        [
            Paragraph("<b>Generative AI</b>", table_cell),
            Paragraph("Google Gemini API (gemini-2.0-flash)", table_cell),
            Paragraph("Prompt-to-HTML automated blog generation with rich formatting and fallback logic.", table_cell)
        ],
        [
            Paragraph("<b>Cloud Media CDN</b>", table_cell),
            Paragraph("ImageKit SDK, Multer", table_cell),
            Paragraph("Direct image upload buffer processing, auto WebP compression (1280px), CDN caching.", table_cell)
        ],
        [
            Paragraph("<b>Authentication</b>", table_cell),
            Paragraph("JSON Web Tokens (JWT), Auth Guards", table_cell),
            Paragraph("Role-based access control separating public readers, verified authors, and admins.", table_cell)
        ]
    ]
    tech_table = Table(tech_data, colWidths=[90, 160, 272])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), header_bg),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, light_bg]),
        ('GRID', (0, 0), (-1, -1), 0.5, card_border),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(tech_table)
    story.append(Spacer(1, 8))

    # 3. Core System Features & Modules
    story.append(Paragraph("3. Core Modules & Key Capabilities", h1_style))
    
    features = [
        ("AI Blog Synthesis Assistant:", "Integrated with Google Gemini 2.0 Flash model. Writers can input any title/prompt to synthesize clean, semantic HTML articles directly into the Quill editor."),
        ("Rich WYSIWYG Editor Suite:", "Integrated Quill.js editor supporting multi-level headers, lists, code blocks, and formatted text for rich reader experience."),
        ("Cloud Media Processing Pipeline:", "Cover images uploaded through Multer are streamed to ImageKit, converted to WebP format, and served via global CDN edges."),
        ("Dual Role-Based Access Control:", "Secure JWT authentication separating Standard Users (article creation, likes, comments) and Administrators (publish/unpublish, comment approvals, all-blog control)."),
        ("Interactive Engagement & Analytics:", "Atomic view counting on article load, like toggle mechanism, threaded comments, and creator analytics dashboard (total views, likes, best-performing post)."),
        ("Production Build & Responsive UI:", "Fully responsive mobile/desktop design powered by Tailwind CSS v4 and React 19.")
    ]
    for feat_title, feat_desc in features:
        story.append(Paragraph(f"• <b>{feat_title}</b> {feat_desc}", bullet_style))

    story.append(Spacer(1, 8))

    # 4. Database Schema Design
    story.append(Paragraph("4. Database Schema Design (MongoDB / Mongoose)", h1_style))
    schema_data = [
        [Paragraph("Collection / Model", table_header), Paragraph("Key Fields & Types", table_header), Paragraph("Design Rationale & Relations", table_header)],
        [
            Paragraph("<b>Blog</b>", table_cell),
            Paragraph("title, subtitle, category, description (HTML), image (CDN URL), views (Number), likes ([User Ref]), isPublished (Bool), author (User Ref), authorName", table_cell),
            Paragraph("Stores formatted content with references to author & liking users. Indexed for feed sorting.", table_cell)
        ],
        [
            Paragraph("<b>Comment</b>", table_cell),
            Paragraph("blog (Blog Ref), user (User Ref), name, content, isApproved (Bool), createdAt", table_cell),
            Paragraph("Relational links to parent blog and user. Cleaned up via cascade delete on blog removal.", table_cell)
        ],
        [
            Paragraph("<b>User / Admin</b>", table_cell),
            Paragraph("name, email (unique), password, profileImage, role (User/Admin)", table_cell),
            Paragraph("Secure credential storage with JWT generation for authenticated session management.", table_cell)
        ]
    ]
    schema_table = Table(schema_data, colWidths=[95, 230, 197])
    schema_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), header_bg),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, light_bg]),
        ('GRID', (0, 0), (-1, -1), 0.5, card_border),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(schema_table)
    story.append(Spacer(1, 8))

    # 5. REST API Specifications
    story.append(Paragraph("5. Key REST API Endpoints", h1_style))
    api_data = [
        [Paragraph("Endpoint", table_header), Paragraph("Method", table_header), Paragraph("Auth Level", table_header), Paragraph("Operation & Response", table_header)],
        [Paragraph("/api/blog/all", code_style), Paragraph("GET", table_cell), Paragraph("Public", table_cell), Paragraph("Fetches all published blogs sorted by date.", table_cell)],
        [Paragraph("/api/blog/:blogId", code_style), Paragraph("GET", table_cell), Paragraph("Public", table_cell), Paragraph("Returns single blog and atomically increments view count.", table_cell)],
        [Paragraph("/api/blog/add", code_style), Paragraph("POST", table_cell), Paragraph("User / Admin", table_cell), Paragraph("Multer file upload + ImageKit CDN + database write.", table_cell)],
        [Paragraph("/api/blog/ai-generate", code_style), Paragraph("POST", table_cell), Paragraph("Public", table_cell), Paragraph("Generates rich HTML article via Google Gemini 2.0 Flash.", table_cell)],
        [Paragraph("/api/blog/like", code_style), Paragraph("POST", table_cell), Paragraph("User Auth", table_cell), Paragraph("Toggles user ID inside blog likes array.", table_cell)],
        [Paragraph("/api/blog/comments", code_style), Paragraph("POST", table_cell), Paragraph("Public", table_cell), Paragraph("Fetches approved comments populated with user profile.", table_cell)],
        [Paragraph("/api/blog/analytics", code_style), Paragraph("GET", table_cell), Paragraph("User Auth", table_cell), Paragraph("Aggregates author's total views, likes, and top article.", table_cell)],
        [Paragraph("/api/user/register", code_style), Paragraph("POST", table_cell), Paragraph("Public", table_cell), Paragraph("Registers user profile with secure credentials.", table_cell)],
        [Paragraph("/api/user/login", code_style), Paragraph("POST", table_cell), Paragraph("Public", table_cell), Paragraph("Authenticates credentials and returns JWT bearer token.", table_cell)],
        [Paragraph("/api/admin/toggle-publish", code_style), Paragraph("POST", table_cell), Paragraph("Admin Auth", table_cell), Paragraph("Moderates visibility of any published article.", table_cell)]
    ]
    api_table = Table(api_data, colWidths=[125, 45, 72, 280])
    api_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), header_bg),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, light_bg]),
        ('GRID', (0, 0), (-1, -1), 0.5, card_border),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(api_table)
    story.append(Spacer(1, 8))

    # 6. Verification & Setup Instructions for Evaluators
    story.append(Paragraph("6. Project Verification & Local Setup Instructions", h1_style))
    story.append(Paragraph("College placement evaluators and technical interviewers can verify and run the project locally:", body_style))

    setup_steps = [
        ("Step 1: Clone Repository from GitHub", "git clone https://github.com/karan686-jpg/SPECIAL_BLOG.git\ncd SPECIAL_BLOG/blog-app"),
        ("Step 2: Start Backend Server", "cd server && npm install\nConfigure .env with MONGODB_URI, JWT_SECRET, IMAGEKIT_KEYS, GEMINI_API_KEY\nRun: npm run dev  (Starts on Port 3000)"),
        ("Step 3: Launch Frontend Client", "cd ../client && npm install\nRun: npm run dev  (Vite launches on http://localhost:5173)")
    ]
    for step_title, step_code in setup_steps:
        story.append(Paragraph(f"• <b>{step_title}</b>", h2_style))
        story.append(Paragraph(step_code.replace('\n', '<br/>'), bullet_style))

    story.append(Spacer(1, 10))

    # Verification Sign-off Box
    sign_off_data = [
        [
            Paragraph("<b>Candidate Declaration:</b><br/>I hereby confirm that this project <b>SPECIAL_BLOG</b> is my authentic full-stack web application development work, implementing modern software engineering standards, MERN architecture, RESTful API design, and Generative AI integration.", table_cell),
            Paragraph("<b>Academic / Placement Evaluation:</b><br/><br/><b>Evaluator Signature:</b> ___________________<br/><b>Evaluator Name / Designation:</b> ____________<br/><b>Date of Verification:</b> ___________________", table_cell)
        ]
    ]
    sign_off_table = Table(sign_off_data, colWidths=[275, 247])
    sign_off_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), light_bg),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#94A3B8")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, card_border),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(KeepTogether([sign_off_table]))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated at: {output_path}")

if __name__ == "__main__":
    output_pdf = r"c:\Users\Karan Datta\Documents\A Learn React\Special_blog\SPECIAL_BLOG_Project_Report.pdf"
    generate_project_pdf(output_pdf)
