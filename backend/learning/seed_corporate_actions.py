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
            "History & Origins of Corporate Actions"
        ]

        for topic_name in topics:
            topic = db.query(LearningTopic).filter_by(name=topic_name, subject_id=ca_subject.id).first()
            if topic:
                if topic_name == "History & Origins of Corporate Actions":
                    topic.config = json.dumps({
                        "type": "narrative",
                        "parts": [
                            {
                                "type": "text",
                                "title": "THE ORIGIN: The VOC and the First Dividend (1602 - 1610)",
                                "content": "To understand why corporate actions exist, we have to look at the first publicly traded company: the **Dutch East India Company (VOC)**, chartered in 1602.\n\n*   **The Problem:** The VOC needed massive capital to fund high-risk spice voyages to Asia. They issued shares to the public in Amsterdam. But a ship taking two years to return meant investors needed a mechanism to be compensated for their locked-up capital.\n*   **The First Corporate Action (1610):** The VOC issued the first recorded dividend. Because liquid cash was scarce, this first dividend was actually paid *in-kind*—specifically, in bags of mace and black pepper.\n*   **The First Restructuring:** As share prices rose, the VOC also pioneered the concept of fractional trading and early corporate restructurings to maintain liquidity, laying the groundwork for modern stock splits."
                            },
                            {
                                "type": "text",
                                "title": "THE EVOLUTION: From Paper to STP",
                                "content": "For 350 years, corporate actions were heavily manual, paper-based processes.\n\n*   **The Paper Era (Pre-1970s):** If a company issued a dividend, physical checks were mailed to registered shareholders. If you held a bearer bond, you literally had to cut a \"coupon\" off the paper certificate and mail it to a bank to claim your interest.\n*   **Dematerialization (1970s - 1990s):** The creation of Central Securities Depositories (CSDs) like the DTCC in the US and Euroclear/Clearstream in Europe. Shares became electronic book-entries. This allowed corporate actions to be processed centrally via ledger updates rather than physical mail.\n*   **The SWIFT Era (1990s - Present):** The introduction of ISO 15022 (and later ISO 20022) standardized the global communication of corporate actions. A dividend announcement in Tokyo could now be automatically parsed by a custodian's system in New York using standard tags (e.g., `:22F::CAEV//DVCA`)."
                            },
                            {
                                "type": "widget",
                                "widgetId": "ca-history-timeline",
                                "title": "Corporate Actions Historical Explorer",
                                "alt": "Interactive timeline showing the evolution of corporate actions and market infrastructure."
                            }
                        ]
                    })
        db.commit()
    finally:
        db.close()
