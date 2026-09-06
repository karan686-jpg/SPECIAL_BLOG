"""
================================================================================
SCRIPT: generate_study_guide.py
PURPOSE: Scans the codebase to dynamically produce:
         1. Publication-Quality Study Guide PDF (<Project>_Study_Guide.pdf)
         2. AI-Optimized Markdown Source (<Project>_NotebookLM_Source.md)
AUTHOR: Technical Educator & Documentation Engineer
================================================================================
"""

import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable, Preformatted
)
from reportlab.pdfgen import canvas

# Ensure UTF-8 console output for Windows/Linux/macOS
if sys.platform.startswith("win"):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# ==============================================================================
# 1. ARCHITECTURAL ANNOTATION KNOWLEDGE BASE
# ==============================================================================
ARCH_ANNOTATIONS = {
    # Server / Backend Core
    "server.js": {
        "role": "Server Entry Point & Middleware Bootstrap",
        "purpose": "Initializes Express application, establishes MongoDB connection, mounts security & CORS middlewares, and binds API route handlers.",
        "concepts": [
            "Express application initialization and environment variable binding (dotenv)",
            "MongoDB connection lifecycle management with Mongoose",
            "CORS policy orchestration & body-parser middleware integration",
            "Centralized route mounting for Authentication, Posts, Categories, and Users",
            "Global unhandled error catching and graceful server shutdown"
        ]
    },
    "index.js": {
        "role": "Application Entry Point / Gateway",
        "purpose": "Serves as the root module bootstrap or client/server execution bridge.",
        "concepts": [
            "Environment configuration & module exports",
            "Initial runtime bootstrapping"
        ]
    },
    # Models
    "User.js": {
        "role": "Mongoose Data Model — User Entity",
        "purpose": "Defines User schema, hashing hooks for passwords, unique constraints, and identity properties.",
        "concepts": [
            "Mongoose Schema definition with validation rules and unique indexing",
            "Password security & profile metadata storage",
            "Timestamps plugin for audit logging (createdAt, updatedAt)"
        ]
    },
    "Post.js": {
        "role": "Mongoose Data Model — Blog Post Entity",
        "purpose": "Encapsulates schema for blog articles including author relations, categories, photo storage keys, and rich text content.",
        "concepts": [
            "Relational referencing with author attribution",
            "Category array mapping & multimedia metadata handling",
            "Schema level indexing for rapid keyword and author queries"
        ]
    },
    "Category.js": {
        "role": "Mongoose Data Model — Taxonomy Entity",
        "purpose": "Defines blog taxonomies for dynamic filtering and content segmentation.",
        "concepts": [
            "Unique taxonomy indexing & case-insensitive naming",
            "Normalized categorization for scalable querying"
        ]
    },
    # Routes / Controllers
    "auth.js": {
        "role": "Authentication & Authorization Route Handler",
        "purpose": "Handles user registration, credential verification, password hashing, and session/token generation.",
        "concepts": [
            "Bcrypt password hashing with salted rounds",
            "Authentication verification & secure error messaging (preventing enumeration)",
            "RESTful POST endpoint contract design"
        ]
    },
    "posts.js": {
        "role": "Post Management REST API Handlers",
        "purpose": "Exposes CRUD operations for blog posts, filtering by author/category, and pagination support.",
        "concepts": [
            "RESTful CRUD operations (GET, POST, PUT, DELETE)",
            "Query parameter parsing for author and taxonomy filtering",
            "Ownership verification before write/delete operations"
        ]
    },
    "categories.js": {
        "role": "Taxonomy API Handlers",
        "purpose": "Provides endpoints for creating and querying blog categories.",
        "concepts": [
            "Idempotent GET requests for taxonomy listings",
            "Authenticated POST requests for category creation"
        ]
    },
    "users.js": {
        "role": "User Profile Management Route Handlers",
        "purpose": "Handles account updating, password resets, and user deletion alongside related entity cascading.",
        "concepts": [
            "User identity verification and payload sanitation",
            "Cascading resource management on account termination"
        ]
    },
    # Client / Frontend Core
    "App.js": {
        "role": "Client Root Component & Router",
        "purpose": "Declares client-side routing hierarchy, topbar navigation layout, and global authentication context consumption.",
        "concepts": [
            "React Router DOM configuration (Routes, Route, Navigate)",
            "Conditional rendering based on user authentication state",
            "Global layout scaffold (Topbar, Page Viewports)"
        ]
    },
    "App.jsx": {
        "role": "Client Root Component & Router (JSX)",
        "purpose": "Declares client-side routing hierarchy and UI scaffolding.",
        "concepts": [
            "React Router declarative routing",
            "Auth-guarded route protections"
        ]
    },
    "Context.js": {
        "role": "Global State Context & Reducer (React Context API)",
        "purpose": "Provides single source of truth for user authentication state across all UI components.",
        "concepts": [
            "React Context API (`createContext`, `useContext`)",
            "Immutable state transitions via Reducer actions (LOGIN_START, LOGIN_SUCCESS, LOGOUT)",
            "Persistent session synchronization with `localStorage`"
        ]
    },
    "Actions.js": {
        "role": "State Action Dispatch Definitions",
        "purpose": "Defines typed action creator functions for auth state modifications.",
        "concepts": [
            "Predictable action object schemas (`type`, `payload`)",
            "Decoupled state modification triggers"
        ]
    },
    "Reducer.js": {
        "role": "Authentication State Reducer",
        "purpose": "Pure function computing next auth state based on incoming dispatched actions.",
        "concepts": [
            "Pure functional state updates without side-effects",
            "Explicit handling of loading, success, and error states"
        ]
    },
    # Client Pages
    "Home.jsx": {
        "role": "Main Viewport / Blog Feed Page",
        "purpose": "Fetches and renders blog post collection with sidebar filter widgets.",
        "concepts": [
            "Asynchronous data fetching with Axios inside `useEffect`",
            "URL search query parameter parsing (`useLocation`)",
            "Component composition with Posts feed and Sidebar widgets"
        ]
    },
    "Single.jsx": {
        "role": "Single Post Detail Viewport",
        "purpose": "Renders individual post view with full content, author details, edit/delete actions.",
        "concepts": [
            "Dynamic URL parameter extraction (`useParams`)",
            "Stateful inline edit controls & optimistic UI updates"
        ]
    },
    "Write.jsx": {
        "role": "Post Authoring & Publishing Viewport",
        "purpose": "Allows authenticated authors to write articles, upload banner images, and publish to database.",
        "concepts": [
            "Multipart form-data handling for image upload",
            "Form state binding and programmatic navigation on success"
        ]
    },
    "Settings.jsx": {
        "role": "User Settings & Profile Viewport",
        "purpose": "Enables user profile updates, profile picture replacement, and account deletion.",
        "concepts": [
            "Profile picture binary upload to backend storage",
            "Global context update after credential modifications"
        ]
    },
    "Login.jsx": {
        "role": "User Authentication Viewport",
        "purpose": "Captures user credentials and dispatches login actions to global context.",
        "concepts": [
            "Controlled form inputs and submit event prevention",
            "Error boundary & visual feedback for invalid credentials"
        ]
    },
    "Register.jsx": {
        "role": "User Registration Viewport",
        "purpose": "Allows new users to create accounts with credential validation.",
        "concepts": [
            "Validation handling and redirect to login on successful account creation"
        ]
    }
}

# ==============================================================================
# 2. REPORTLAB TWO-PASS NUMBERED CANVAS
# ==============================================================================
class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas renderer to dynamically calculate total pages,
    drawing professional running headers and 'Page X of Y' footers.
    """
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
        
        # Suppress headers/footers on cover page (Page 1)
        if self._pageNumber > 1:
            # Running Header
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#475569"))
            self.drawString(40, 11 * 72 - 30, "SPECIAL_BLOG — Full-Stack Architecture & Study Guide")
            self.drawRightString(8.5 * 72 - 40, 11 * 72 - 30, "MERN Full-Stack Notes")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.75)
            self.line(40, 11 * 72 - 34, 8.5 * 72 - 40, 11 * 72 - 34)

            # Running Footer
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.75)
            self.line(40, 36, 8.5 * 72 - 40, 36)
            
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawString(40, 24, "Special_Blog Codebase Study Material | Hands-on Full-Stack Mastery")
            page_text = f"Page {self._pageNumber} of {page_count}"
            self.drawRightString(8.5 * 72 - 40, 24, page_text)
            
        self.restoreState()


# ==============================================================================
# 3. CODEBASE SCANNER & TOPOLOGICAL SORTER
# ==============================================================================
IGNORE_DIRS = {
    'node_modules', '.git', 'dist', 'build', 'coverage', '__pycache__',
    '.vscode', '.idea', '.gemini', 'study_material', 'bin', 'obj'
}

VALID_EXTENSIONS = {
    '.js', '.jsx', '.ts', '.tsx', '.json', '.env.example', '.css', '.html', '.md'
}

def scan_project_files(root_dir):
    """
    Scans project directory recursively, filters out noise, and orders files logically.
    """
    discovered_files = []
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # In-place directory pruning
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS and not d.startswith('.')]
        
        for filename in filenames:
            ext = os.path.splitext(filename)[1].lower()
            if ext in VALID_EXTENSIONS or filename in {'package.json', '.gitignore', '.env.example'}:
                full_path = os.path.join(dirpath, filename)
                rel_path = os.path.relpath(full_path, root_dir).replace('\\', '/')
                
                # Exclude generated output artifacts
                if "Study_Guide" in filename or "NotebookLM" in filename or "SPECIAL_BLOG_Project_Report" in filename:
                    continue
                
                discovered_files.append((rel_path, full_path, filename))
    
    # Priority sorting function
    def sort_priority(item):
        rel_p, _, fname = item
        score = 100
        
        # Priority 1: Configurations & Env
        if 'package.json' in fname: score = 10
        elif '.env' in fname: score = 15
        elif 'vite.config' in fname or 'webpack' in fname: score = 20
        # Priority 2: Server Entry Point
        elif 'server' in rel_p and ('server.js' in fname or 'index.js' in fname or 'app.js' in fname): score = 30
        # Priority 3: Server Models
        elif 'models' in rel_p: score = 40
        # Priority 4: Server Routes / Controllers / Middlewares
        elif 'routes' in rel_p or 'controllers' in rel_p or 'middleware' in rel_p: score = 50
        # Priority 5: Client Global State / Context / Store
        elif 'context' in rel_p.lower() or 'redux' in rel_p.lower(): score = 60
        # Priority 6: Client Entry / App Scaffold
        elif 'client' in rel_p and ('App' in fname or 'main' in fname or 'index' in fname): score = 70
        # Priority 7: Client Pages / Views
        elif 'pages' in rel_p: score = 80
        # Priority 8: Client Components
        elif 'components' in rel_p: score = 90
        
        return (score, rel_p)
    
    discovered_files.sort(key=sort_priority)
    return discovered_files


# ==============================================================================
# 4. REPORTLAB PDF GENERATOR
# ==============================================================================
def generate_study_guide_pdf(project_root, output_pdf_path, scanned_files):
    """
    Generates a publication-grade PDF containing executive overview,
    architecture summary, and chunked source code with breakdown callout cards.
    """
    doc = SimpleDocTemplate(
        output_pdf_path,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=45,
        bottomMargin=48
    )

    styles = getSampleStyleSheet()
    
    # Professional Color Palette
    c_primary     = colors.HexColor("#0F172A")  # Slate 900
    c_brand       = colors.HexColor("#3730A3")  # Indigo 800
    c_accent      = colors.HexColor("#0284C7")  # Sky 600
    c_text        = colors.HexColor("#1E293B")  # Slate 800
    c_muted       = colors.HexColor("#64748B")  # Slate 500
    c_callout_bg  = colors.HexColor("#F1F5F9")  # Slate 100
    c_border      = colors.HexColor("#CBD5E1")  # Slate 300
    c_code_bg     = colors.HexColor("#F8FAFC")  # Slate 50

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=22, leading=26,
        textColor=c_primary, spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=10.5, leading=14,
        textColor=c_brand, spaceAfter=10
    )
    h1_style = ParagraphStyle(
        'Heading1_Custom', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=13, leading=17,
        textColor=c_primary, spaceBefore=12, spaceAfter=6,
        keepWithNext=True
    )
    file_title_style = ParagraphStyle(
        'FileTitle', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=11, leading=15,
        textColor=c_brand, spaceBefore=8, spaceAfter=4,
        keepWithNext=True
    )
    body_style = ParagraphStyle(
        'Body_Custom', parent=styles['Normal'],
        fontName='Helvetica', fontSize=8.5, leading=12,
        textColor=c_text, spaceAfter=4
    )
    callout_bold = ParagraphStyle(
        'CalloutBold', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=8.5, leading=12,
        textColor=c_primary
    )
    bullet_style = ParagraphStyle(
        'Bullet_Custom', parent=styles['Normal'],
        fontName='Helvetica', fontSize=8, leading=11.5,
        textColor=c_text, leftIndent=12, firstLineIndent=-8, spaceAfter=2
    )
    code_chunk_style = ParagraphStyle(
        'CodeChunk', parent=styles['Normal'],
        fontName='Courier', fontSize=6.8, leading=8.5,
        textColor=colors.HexColor("#0F172A")
    )

    story = []

    # --------------------------------------------------------------------------
    # COVER / EXECUTIVE SECTION
    # --------------------------------------------------------------------------
    story.append(Paragraph("SPECIAL_BLOG — Full-Stack Architecture & Study Guide", title_style))
    story.append(Paragraph("A Comprehensive Master Technical Reference for MERN Architecture, APIs & State Flow", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_brand, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph("Executive System Overview", h1_style))
    overview_text = (
        "<b>SPECIAL_BLOG</b> is a full-stack, distributed blogging and content management platform "
        "architected using the <b>MERN Stack (MongoDB, Express.js, React.js, Node.js)</b>. "
        "The backend implements a secured RESTful API with Bcrypt salted hashing, Mongoose ORM "
        "relational modeling, and static asset streaming. The frontend is built on React utilizing "
        "the <b>Context API with useReducer</b> for centralized authentication state synchronization, "
        "React Router for declarative client-side navigation, and Axios for HTTP communication."
    )
    story.append(Paragraph(overview_text, body_style))
    story.append(Spacer(1, 8))

    # Architecture Component Table
    story.append(Paragraph("Architectural Component Breakdown", h1_style))
    table_data = [
        [
            Paragraph("<b>Layer / Component</b>", callout_bold),
            Paragraph("<b>Technologies & Libraries</b>", callout_bold),
            Paragraph("<b>Core Architectural Responsibilities</b>", callout_bold)
        ],
        [
            Paragraph("<b>Backend Gateway</b>", body_style),
            Paragraph("Node.js, Express, CORS, Dotenv", body_style),
            Paragraph("RESTful endpoints, HTTP request lifecycle, CORS validation, JSON parsing", body_style)
        ],
        [
            Paragraph("<b>Data Persistence</b>", body_style),
            Paragraph("MongoDB, Mongoose ODM", body_style),
            Paragraph("Schema modeling, data validation, indexing, and cascade references", body_style)
        ],
        [
            Paragraph("<b>Security & Auth</b>", body_style),
            Paragraph("Bcrypt.js, Secure Headers", body_style),
            Paragraph("One-way password hashing with salt rounds, authentication validation", body_style)
        ],
        [
            Paragraph("<b>Frontend Core</b>", body_style),
            Paragraph("React.js, React Router DOM", body_style),
            Paragraph("SPA lifecycle, client-side routing, protected navigation guards", body_style)
        ],
        [
            Paragraph("<b>State Management</b>", body_style),
            Paragraph("Context API, useReducer, LocalStorage", body_style),
            Paragraph("Global auth state machine, immutable action dispatches, token persistence", body_style)
        ]
    ]

    t = Table(table_data, colWidths=[120, 150, 260])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#E2E8F0")),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t)
    story.append(Spacer(1, 14))

    # --------------------------------------------------------------------------
    # CODEBASE FILE SECTIONS
    # --------------------------------------------------------------------------
    story.append(Paragraph("Codebase Source & Deep Architectural Breakdown", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.75, color=c_muted, spaceBefore=2, spaceAfter=8))

    for rel_path, full_path, filename in scanned_files:
        # Resolve Architectural Annotations
        annot = ARCH_ANNOTATIONS.get(filename, {
            "role": "System Component",
            "purpose": f"Provides implementation logic for {filename}.",
            "concepts": ["Component implementation and modular code organization."]
        })

        # File Section Header
        story.append(Paragraph(f"📄 File: <font color='#0284C7'>{rel_path}</font>", file_title_style))
        
        # Breakdown Callout Box
        callout_content = [
            [Paragraph(f"<b>Role:</b> {annot['role']}", callout_bold)],
            [Paragraph(f"<b>Purpose:</b> {annot['purpose']}", body_style)],
            [Paragraph("<b>Key Architectural Concepts & Patterns:</b>", callout_bold)]
        ]
        for c in annot['concepts']:
            callout_content.append([Paragraph(f"• {c}", bullet_style)])
        
        callout_table = Table(callout_content, colWidths=[530])
        callout_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), c_callout_bg),
            ('BOX', (0,0), (-1,-1), 0.75, c_border),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ]))
        
        story.append(callout_table)
        story.append(Spacer(1, 4))

        # Read Source Code & Chunking (Prevents Layout Engine Overflow)
        try:
            with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                code_lines = f.readlines()
        except Exception as e:
            code_lines = [f"// Error reading file: {str(e)}"]

        if not code_lines:
            code_lines = ["// Empty file\n"]

        # Chunk lines into batches of 40 lines
        chunk_size = 40
        total_lines = len(code_lines)
        
        for i in range(0, total_lines, chunk_size):
            chunk = code_lines[i : i + chunk_size]
            formatted_chunk_lines = []
            
            for line_idx, line in enumerate(chunk, start=i+1):
                # Clean up tabs & special characters
                clean_line = line.replace('\t', '    ').rstrip('\r\n')
                # Truncate overly long lines to prevent text wrapping glitches in preformatted
                if len(clean_line) > 105:
                    clean_line = clean_line[:102] + "..."
                formatted_chunk_lines.append(f"{line_idx:4d} | {clean_line}")
                
            chunk_text = "\n".join(formatted_chunk_lines)
            
            # Format Code Block Container
            code_pre = Preformatted(chunk_text, code_chunk_style)
            code_table = Table([[code_pre]], colWidths=[530])
            code_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), c_code_bg),
                ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
                ('TOPPADDING', (0,0), (-1,-1), 3),
                ('BOTTOMPADDING', (0,0), (-1,-1), 3),
                ('LEFTPADDING', (0,0), (-1,-1), 5),
                ('RIGHTPADDING', (0,0), (-1,-1), 5),
            ]))
            story.append(code_table)
            story.append(Spacer(1, 3))
            
        story.append(Spacer(1, 8))

    # Build Document with NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"✅ Study Guide PDF successfully built at: {output_pdf_path}")


# ==============================================================================
# 5. NOTEBOOKLM OPTIMIZED MARKDOWN GENERATOR
# ==============================================================================
def generate_notebooklm_markdown(project_root, output_md_path, scanned_files):
    """
    Produces an AI-optimized markdown document structured for
    Google NotebookLM audio podcast generation, deep study, and viva Q&A.
    """
    md_content = []
    
    # Header
    md_content.append("# SPECIAL_BLOG: Full-Stack MERN Architecture & Comprehensive Study Source\n")
    md_content.append("> **AI Ingestion Note**: This document contains the end-to-end architectural overview, component breakdowns, data models, API handlers, state machines, and source code for the **SPECIAL_BLOG** platform.\n")
    
    # Architectural Executive Summary
    md_content.append("## Executive System Architecture\n")
    md_content.append("| Layer | Technology Stack | Core Architectural Responsibility |")
    md_content.append("| :--- | :--- | :--- |")
    md_content.append("| **Backend Gateway** | Node.js, Express.js | REST API routing, CORS security, request middleware pipeline |")
    md_content.append("| **Persistence** | MongoDB, Mongoose ODM | Document modeling, validations, foreign key references, timestamps |")
    md_content.append("| **Security & Cryptography** | Bcrypt.js | Salted one-way credential hashing and auth verification |")
    md_content.append("| **Client Viewport** | React.js, React Router DOM | Single Page Application (SPA), declarative navigation |")
    md_content.append("| **State Management** | Context API + `useReducer` | Global authentication state machine, LocalStorage synchronization |\n")

    md_content.append("## Complete Source Code & Architectural Breakdown\n")

    for rel_path, full_path, filename in scanned_files:
        annot = ARCH_ANNOTATIONS.get(filename, {
            "role": "Source Module",
            "purpose": f"Implements functionality for {filename}.",
            "concepts": ["Standard module implementation."]
        })

        ext = os.path.splitext(filename)[1].lower().replace('.', '')
        fence_lang = ext if ext in {'js', 'jsx', 'json', 'css', 'html', 'yaml', 'md'} else 'javascript'
        if ext == 'json': fence_lang = 'json'
        elif ext in {'jsx', 'js'}: fence_lang = 'javascript'

        md_content.append(f"### File: `{rel_path}`\n")
        md_content.append(f"- **Architectural Role:** {annot['role']}")
        md_content.append(f"- **System Purpose:** {annot['purpose']}")
        md_content.append("- **Key Concepts & Design Patterns:**")
        for c in annot['concepts']:
            md_content.append(f"  - {c}")
        md_content.append("\n```" + fence_lang)
        
        try:
            with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                code_text = f.read()
            md_content.append(code_text.rstrip())
        except Exception as e:
            md_content.append(f"// Error reading file: {str(e)}")
            
        md_content.append("```\n")
        md_content.append("---\n")

    with open(output_md_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(md_content))

    print(f"✅ NotebookLM Markdown successfully generated at: {output_md_path}")


# ==============================================================================
# 6. MAIN EXECUTION PIPELINE
# ==============================================================================
def main():
    # Resolve Paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(base_dir, "..")) if os.path.basename(base_dir) == "study_material" else base_dir
    output_dir = os.path.join(project_root, "study_material")
    os.makedirs(output_dir, exist_ok=True)

    pdf_out = os.path.join(output_dir, "SPECIAL_BLOG_Study_Guide.pdf")
    md_out = os.path.join(output_dir, "SPECIAL_BLOG_NotebookLM_Source.md")

    print("=" * 70)
    print("🚀 STARTING REVISION & STUDY DELIVERABLE GENERATOR")
    print(f"📁 Project Root Scan: {project_root}")
    print(f"📂 Output Directory : {output_dir}")
    print("=" * 70)

    # 1. Scan codebase
    scanned_files = scan_project_files(project_root)
    print(f"🔍 Discovered {len(scanned_files)} architectural source files for documentation.\n")

    # 2. Generate PDF
    print("⏳ Building Publication-Grade Study Guide PDF...")
    generate_study_guide_pdf(project_root, pdf_out, scanned_files)

    # 3. Generate NotebookLM Markdown
    print("⏳ Building NotebookLM Optimized Markdown...")
    generate_notebooklm_markdown(project_root, md_out, scanned_files)

    print("\n" + "=" * 70)
    print("✨ ALL DELIVERABLES GENERATED SUCCESSFULLY!")
    print(f"1. PDF Guide    : {pdf_out}")
    print(f"2. NotebookLM MD: {md_out}")
    print("=" * 70)

if __name__ == "__main__":
    main()
