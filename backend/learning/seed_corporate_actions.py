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
            "The Boardroom Decisions (SWIFT CAMV)",
            "The Lifecycle & Settlement Cycle"
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

                elif topic_name == "The Lifecycle & Settlement Cycle":
                    topic.lesson_config_json = json.dumps({
                        "type": "narrative",
                        "parts": [
                            {
                                "title": "THE CHRONOLOGY OF ENTITLEMENT",
                                "narrative": "In the middle office, a corporate action is not a single event — it is a rigid, chronological sequence of five critical dates. Missing any one of these dates results in a miscalculated entitlement, triggering claims, counter-claims, and severe financial liability for the custodian.\n\nThe sequence is: **Announcement Date → Cum-Date → Ex-Date → Record Date → Pay Date**.\n\nEvery event in every market around the world follows this pattern. The differences between markets lie only in the *gaps* between these dates, driven by settlement cycle rules."
                            },
                            {
                                "title": "INTERACTIVE: The 5-Date Lifecycle",
                                "narrative": "Use the interactive widget below to step through each lifecycle date. For each date, you will see its precise definition, the Operations Team's focus, market impact, a live Apple (AAPL) dividend example, and a hidden analyst tip.",
                                "widgetType": "ca-lifecycle-dates",
                                "alt": "Interactive 5-date lifecycle explorer for corporate actions."
                            },
                            {
                                "title": "THE SETTLEMENT CYCLE RELATIONSHIP",
                                "narrative": "The most misunderstood concept in corporate actions is the relationship between the **Ex-Date** and the **Record Date**. They are NOT always the same day. The gap between them is entirely determined by the country's settlement cycle (T+1 or T+2).\n\n**The Golden Rule:** The Ex-Date is set so that a trade executed on the last day a buyer can receive the entitlement (Cum-Date) will settle exactly ON the Record Date — not after it.\n\n*   **T+2 (e.g., most of Europe):** Trade on Monday (Cum-Date) → Settles Wednesday (Record Date). Therefore Ex-Date = Tuesday (1 day before Record Date).\n*   **T+1 (US, India, Canada since 2024):** Trade on Tuesday (Cum-Date) → Settles Wednesday (Record Date). Therefore Ex-Date = Wednesday (same day as Record Date)."
                            },
                            {
                                "title": "INTERACTIVE: Settlement Cycle Simulator",
                                "narrative": "Toggle between T+1 (US/India) and T+2 (Europe) settlement modes. Click each calendar day to see exactly who is entitled to the dividend and who is not. This is the exact decision tree an ops analyst runs through when processing a market claim.",
                                "widgetType": "ca-settlement-cycle",
                                "alt": "T+1 vs T+2 Settlement Cycle Simulator for corporate actions."
                            },
                            {
                                "title": "MARKET CLAIMS: When Settlement Goes Wrong",
                                "narrative": "Real life is messier than the textbook. Trades fail. Counterparties default. Systems crash. When a trade that was executed on the Cum-Date fails to settle on the Record Date, the buyer has a legal right to the entitlement — but the entitlement was paid to the seller (who still technically holds the shares).\n\nThis creates a **Market Claim**:\n\n1.  **Identification:** The custodian's fails management system flags all unsettled trades that span the Record Date.\n2.  **Claim Generation:** An MT565 (Instruction message) is generated and sent to the failing counterparty, demanding the return of the equivalent cash or securities.\n3.  **Resolution:** The counterparty acknowledges and processes the reverse payment.\n4.  **Time Pressure:** Claims have market deadlines. Failing to file a claim within the stipulated window (often 15-30 business days) means the entitlement is permanently lost — a direct financial write-off for the custodian.\n\nMarket Claims are the bread and butter of a middle-office corporate actions team. Senior analysts handle dozens per dividend cycle."
                            }
                        ]
                    })
        db.commit()
    finally:
        db.close()
