import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_corporate_actions():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=11, name="Masterclass").first()
        if not class_11:
            return

        ca_subject = db.query(LearningSubject).filter_by(name="Corporate Actions", class_id=class_11.id).first()
        if not ca_subject:
            return

        topics = [
            "History & Origins of Corporate Actions",
            "The Boardroom Decisions (SWIFT CAMV)"
        ]

        for topic_name in topics:
            topic = db.query(LearningTopic).filter_by(name=topic_name, subject_id=ca_subject.id).first()
            if topic:
                if topic_name == "History & Origins of Corporate Actions":
                    topic.lesson_config_json = json.dumps({
                        "type": "narrative",
                        "parts": [
                            {
                                "title": "THE ORIGIN: The VOC and the First Dividend (1602 - 1610)",
                                "narrative": "To understand why corporate actions exist, we have to look at the first publicly traded company: the **Dutch East India Company (VOC)**, chartered in 1602.\n\n*   **The Problem:** The VOC needed massive capital to fund high-risk spice voyages to Asia. They issued shares to the public in Amsterdam. But a ship taking two years to return meant investors needed a mechanism to be compensated for their locked-up capital.\n*   **The First Corporate Action (1610):** The VOC issued the first recorded dividend. Because liquid cash was scarce, this first dividend was actually paid *in-kind*—specifically, in bags of mace and black pepper.\n*   **The First Restructuring:** As share prices rose, the VOC also pioneered the concept of fractional trading and early corporate restructurings to maintain liquidity, laying the groundwork for modern stock splits."
                            },
                            {
                                "title": "THE STANDARDIZATION: Paper to SWIFT",
                                "narrative": "Fast forward to the 1970s. Wall Street was drowning in paper certificates. The \"Paper Crunch\" forced the market to close on Wednesdays just to catch up on paperwork!\n\nThis led to the creation of Central Securities Depositories (like the DTCC) and the dematerialization of shares (book-entry). But the real revolution came with **SWIFT** in the 1990s.\n\n*   **ISO 15022 (MT564):** The creation of standardized, machine-readable messages meant a dividend in Japan could be automatically processed by a broker in New York without manual data entry.\n*   **The Goal:** STP (Straight-Through Processing). Removing human touchpoints to eliminate risk.",
                                "widgetType": "ca-history-timeline",
                                "title": "Corporate Actions Historical Explorer",
                                "alt": "Interactive timeline showing the evolution of corporate actions and market infrastructure."
                            }
                        ]
                    })
                
                elif topic_name == "The Boardroom Decisions (SWIFT CAMV)":
                    topic.lesson_config_json = json.dumps({
                        "type": "narrative",
                        "parts": [
                            {
                                "title": "DEFINING THE EVENT",
                                "narrative": "A corporate action is a material event initiated by a public company's Board of Directors that affects the securities (equity or debt) issued by the company.\n\n*   **The Catalyst:** These events are governed by the company's **Articles of Association** and are legally bound by a Corporate Resolution.\n*   **The Golden Rule:** While retail investors focus on the *price* of the stock post-action, middle-office analysts focus on the **entitlement calculation**. A corporate action fundamentally alters the quantity of holdings, the cash balance, or the identification (ISIN/CUSIP) of the underlying security."
                            },
                            {
                                "title": "THE THREE EVENT CATEGORIES (SWIFT CAMV Indicators)",
                                "narrative": "Every corporate action processed globally is categorized by its mandatory/voluntary status. In SWIFT messaging, this is denoted by the Mandatory/Voluntary Indicator (`:22F::CAMV`).\n\nThere are three indicators: MAND (Mandatory), VOLU (Voluntary), and CHOS (Mandatory with Choice).",
                                "widgetType": "ca-camv-indicator",
                                "alt": "Interactive Widget explaining MAND, VOLU, and CHOS indicators."
                            },
                            {
                                "title": "THE ANATOMY OF A CORPORATE ACTION",
                                "narrative": "Before a custodian can calculate an entitlement, the \"Golden Copy\" of the event must be scrubbed and verified. A Senior Analyst looks at an event not as a news headline, but as a rigid set of parameters:\n\n*   **Event Type:** What is happening?\n*   **Security:** Which ISIN/CUSIP is affected?\n*   **Ratios / Rates:** What is the math? (e.g., USD 0.50 per share, or 2 new shares for 1 old).\n*   **Dates:** The strict chronological lifecycle that dictates exactly who is entitled to the proceeds. (We will cover the lifecycle dates heavily in Chapter 3)."
                            }
                        ]
                    })
        db.commit()
    finally:
        db.close()
