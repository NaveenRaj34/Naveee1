"""
JobShield AI - PDF Report Generator
Generates a formal, cybersecurity-styled executive risk report using ReportLab.
"""
import io
import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pdf_report(analysis_data: dict, output_filepath: str = None) -> bytes:
    """
    Renders an executive scam analysis dossier as a PDF.
    Returns raw PDF bytes and optionally writes to output_filepath.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    c_navy = colors.HexColor("#0f172a")
    c_dark = colors.HexColor("#0a0f1d")
    c_accent = colors.HexColor("#0284c7")
    c_safe = colors.HexColor("#10b981")
    c_warning = colors.HexColor("#f59e0b")
    c_danger = colors.HexColor("#ef4444")
    c_text = colors.HexColor("#334155")
    c_light_bg = colors.HexColor("#f8fafc")

    # Typography styles
    style_title = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=20,
        leading=24,
        textColor=c_navy,
        spaceAfter=4,
        fontName='Helvetica-Bold'
    )
    style_tagline = ParagraphStyle(
        'DocTagline',
        fontSize=10,
        leading=12,
        textColor=c_accent,
        fontName='Helvetica-Bold'
    )
    style_meta = ParagraphStyle(
        'DocMeta',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#64748b"),
        fontName='Helvetica'
    )
    style_section = ParagraphStyle(
        'SectionHeader',
        fontSize=13,
        leading=16,
        textColor=c_navy,
        fontName='Helvetica-Bold',
        spaceBefore=12,
        spaceAfter=6
    )
    style_body = ParagraphStyle(
        'BodyTextCustom',
        fontSize=10,
        leading=14,
        textColor=c_text,
        fontName='Helvetica'
    )
    style_bold = ParagraphStyle(
        'BodyBoldCustom',
        fontSize=10,
        leading=14,
        textColor=c_navy,
        fontName='Helvetica-Bold'
    )

    story = []

    # 1. Header Banner
    header_data = [
        [
            Paragraph("<b>JobShield AI</b>", style_title),
            Paragraph(f"<b>REPORT DATE:</b> {datetime.now().strftime('%Y-%m-%d %H:%M UTC')}<br/><b>REPORT ID:</b> #{analysis_data.get('id', 'NEW')}", style_meta)
        ],
        [
            Paragraph("AI-POWERED JOB SCAM DETECTION & RISK ANALYSIS PLATFORM", style_tagline),
            Paragraph("CONFIDENTIAL RISK ASSESSMENT", style_meta)
        ]
    ]
    header_table = Table(header_data, colWidths=[330, 200])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_accent, spaceBefore=4, spaceAfter=14))

    # 2. Executive Summary Box
    score = analysis_data.get("risk_score", 0)
    level = analysis_data.get("risk_level", "Low")
    level_color = c_danger if level in ["High", "Critical"] else (c_warning if level == "Moderate" else c_safe)

    score_box_data = [
        [
            Paragraph("<b>TARGET JOB TITLE:</b>", style_bold),
            Paragraph(str(analysis_data.get("job_title", "N/A")), style_body),
            Paragraph("<b>RISK ASSESSMENT:</b>", style_bold),
            Paragraph(f"<font color='{level_color.hexval()}'><b>{score}/100 ({level.upper()} RISK)</b></font>", style_bold)
        ],
        [
            Paragraph("<b>TARGET COMPANY:</b>", style_bold),
            Paragraph(str(analysis_data.get("company_name", "N/A")), style_body),
            Paragraph("<b>AI PREDICTION:</b>", style_bold),
            Paragraph(f"<b>{analysis_data.get('prediction', 'Analyzed')}</b> ({analysis_data.get('confidence', 0)}% conf.)", style_body)
        ]
    ]
    summary_table = Table(score_box_data, colWidths=[130, 150, 120, 130])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_light_bg),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 12))

    # 3. Verification & Factor Analysis Table
    story.append(Paragraph("Verification & Heuristic Checks", style_section))
    verification_data = [
        [
            Paragraph("<b>Verification Dimension</b>", style_bold),
            Paragraph("<b>Status</b>", style_bold),
            Paragraph("<b>Findings & Evidence</b>", style_bold)
        ],
        [
            Paragraph("Company Web Presence", style_body),
            Paragraph(str(analysis_data.get("company_verification", {}).get("trust_status", "N/A")), style_body),
            Paragraph(str(analysis_data.get("company_verification", {}).get("explanation", "N/A")), style_body)
        ],
        [
            Paragraph("Recruiter Contact", style_body),
            Paragraph(str(analysis_data.get("recruiter_verification", {}).get("trust_status", "N/A")), style_body),
            Paragraph(str(analysis_data.get("recruiter_verification", {}).get("explanation", "N/A")), style_body)
        ],
        [
            Paragraph("Salary Structure", style_body),
            Paragraph(str(analysis_data.get("salary_analysis", {}).get("salary_risk", "N/A")), style_body),
            Paragraph(str(analysis_data.get("salary_analysis", {}).get("explanation", "N/A")), style_body)
        ],
        [
            Paragraph("NLP / ML Classifier", style_body),
            Paragraph(f"{analysis_data.get('prediction', 'Analyzed')}", style_body),
            Paragraph(f"Trained Random Forest Classifier. Confidence: {analysis_data.get('confidence', 0)}%", style_body)
        ]
    ]
    v_table = Table(verification_data, colWidths=[140, 100, 290])
    v_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#e2e8f0")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(v_table)
    story.append(Spacer(1, 12))

    # 4. Detected Indicators & Contributing Factors
    factors = analysis_data.get("contributing_factors", [])
    if factors:
        story.append(Paragraph("Traceable Contributing Factors", style_section))
        f_data = [
            [
                Paragraph("<b>Factor</b>", style_bold),
                Paragraph("<b>Impact</b>", style_bold),
                Paragraph("<b>Severity</b>", style_bold),
                Paragraph("<b>Detail</b>", style_bold)
            ]
        ]
        for f in factors:
            f_data.append([
                Paragraph(str(f.get("name", "")), style_body),
                Paragraph(f"+{f.get('score_contribution', 0)} pts", style_bold),
                Paragraph(str(f.get("severity", "MED")), style_body),
                Paragraph(str(f.get("explanation", "")), style_body),
            ])
        f_table = Table(f_data, colWidths=[140, 60, 60, 270])
        f_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#e2e8f0")),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#cbd5e1")),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ]))
        story.append(f_table)
        story.append(Spacer(1, 12))

    # 5. Explainable AI Recommendations
    recs = analysis_data.get("recommendations", [])
    if recs:
        story.append(Paragraph("Actionable Safety Recommendations", style_section))
        for r in recs[:4]:
            sev = r.get("severity", "INFO")
            title = r.get("title", "Safety Advisory")
            text = r.get("text", "")
            story.append(Paragraph(f"• <b>[{sev}] {title}:</b> {text}", style_body))
            story.append(Spacer(1, 4))

    story.append(Spacer(1, 14))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceBefore=4, spaceAfter=8))
    story.append(Paragraph(
        "<b>DISCLAIMER:</b> JobShield AI provides automated decision-support risk analysis based on statistical modeling, domain validation, and linguistic pattern detection. It does not provide legal guarantees. Job seekers are strongly advised to independently verify employer credentials before transmitting sensitive information.",
        style_meta
    ))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()

    if output_filepath:
        os.makedirs(os.path.dirname(os.path.abspath(output_filepath)), exist_ok=True)
        with open(output_filepath, "wb") as f:
            f.write(pdf_bytes)

    return pdf_bytes
