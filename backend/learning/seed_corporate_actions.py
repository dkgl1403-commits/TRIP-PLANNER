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
                # ─────────────────────────────────────────────────────────────
                # CHAPTER 1
                # ─────────────────────────────────────────────────────────────
                if topic_name == "History & Origins of Corporate Actions":
                    topic.lesson_config_json = json.dumps({
                        "type": "narrative",
                        "parts": [
                            {
                                "title": "THE ORIGIN: The VOC and the First Dividend (1602 - 1610)",
                                "narrative": "<p>To understand why corporate actions exist, we have to look at the first publicly traded company: the <strong>Dutch East India Company (VOC)</strong>, chartered in 1602.</p><ul><li><strong>The Problem:</strong> The VOC needed massive capital to fund high-risk spice voyages to Asia. They issued shares to the public in Amsterdam. But a ship taking two years to return meant investors needed a mechanism to be compensated for their locked-up capital.</li><li><strong>The First Corporate Action (1610):</strong> The VOC issued the first recorded dividend. Because liquid cash was scarce, this first dividend was actually paid <em>in-kind</em>&mdash;specifically, in bags of mace and black pepper.</li><li><strong>The First Restructuring:</strong> As share prices rose, the VOC also pioneered the concept of fractional trading and early corporate restructurings to maintain liquidity, laying the groundwork for modern stock splits.</li></ul>"
                            },
                            {
                                "title": "THE STANDARDIZATION: Paper to SWIFT",
                                "narrative": "<p>Fast forward to the 1970s. Wall Street was drowning in paper certificates. The <strong>&quot;Paper Crunch&quot;</strong> was so severe, the market was forced to close on Wednesdays just to catch up on the backlog of paperwork!</p><p>This crisis led to two historic changes:</p><ul><li><strong>Dematerialization:</strong> The creation of Central Securities Depositories (like the DTCC in the US, and Euroclear/Clearstream in Europe) moved shares from physical certificates to electronic book-entries held in a central ledger.</li><li><strong>ISO 15022 (MT564):</strong> With the rise of the SWIFT network in the 1990s, global communication of corporate action events was standardised. A dividend announcement in Tokyo could now be automatically parsed by a custodian&apos;s system in New York using standard structured tags (e.g., <code>:22F::CAEV//DVCA</code>).</li></ul><p>The goal of all this was <strong>STP (Straight-Through Processing)</strong> &mdash; removing every human touchpoint to eliminate risk and speed up settlement.</p>",
                                "widgetType": "ca-history-timeline",
                                "alt": "Interactive timeline showing the evolution of corporate actions and market infrastructure."
                            }
                        ]
                    })

                # ─────────────────────────────────────────────────────────────
                # CHAPTER 2
                # ─────────────────────────────────────────────────────────────
                elif topic_name == "The Boardroom Decisions (SWIFT CAMV)":
                    topic.lesson_config_json = json.dumps({
                        "type": "narrative",
                        "parts": [
                            {
                                "title": "DEFINING THE EVENT",
                                "narrative": "<p>A corporate action is a <strong>material event initiated by a public company&apos;s Board of Directors</strong> that affects the securities (equity or debt) issued by the company.</p><ul><li><strong>The Catalyst:</strong> These events are governed by the company&apos;s <em>Articles of Association</em> and are legally bound by a Corporate Resolution passed at a Board meeting.</li><li><strong>The Golden Rule:</strong> While retail investors focus on the <em>price</em> of the stock post-action, middle-office analysts focus on the <strong>entitlement calculation</strong>. A corporate action fundamentally alters the <strong>quantity</strong> of holdings, the <strong>cash balance</strong>, or the <strong>identification (ISIN/CUSIP)</strong> of the underlying security.</li></ul>"
                            },
                            {
                                "title": "THE THREE EVENT CATEGORIES (SWIFT CAMV Indicators)",
                                "narrative": "<p>Every corporate action processed globally is categorized by its mandatory/voluntary status. In SWIFT messaging, this is denoted by the <strong>Mandatory/Voluntary Indicator</strong> (<code>:22F::CAMV</code>).</p><p>There are three possible values, and understanding them is the foundation of all corporate actions operations:</p><ol><li><strong>MAND &mdash; Mandatory:</strong> The event applies to all eligible shareholders automatically. No instruction is needed or accepted.</li><li><strong>VOLU &mdash; Voluntary:</strong> The issuer makes an offer. The shareholder must actively elect to participate, or miss the benefit entirely.</li><li><strong>CHOS &mdash; Mandatory with Choice:</strong> The event will happen regardless, but the shareholder can choose <em>how</em> it happens. A Default Option always applies if no instruction is received.</li></ol><p>Click each indicator in the widget below to explore the operations focus and key event types.</p>",
                                "widgetType": "ca-camv-indicator",
                                "alt": "Interactive Widget explaining MAND, VOLU, and CHOS indicators."
                            },
                            {
                                "title": "THE ANATOMY OF A CORPORATE ACTION",
                                "narrative": "<p>Before a custodian can calculate an entitlement, the <strong>&quot;Golden Copy&quot;</strong> of the event must be scrubbed and verified against multiple data vendors. A Senior Analyst looks at an event not as a news headline, but as a rigid set of parameters:</p><ul><li><strong>Event Type (CAEV):</strong> What is happening? (e.g., Cash Dividend = <code>DVCA</code>, Stock Split = <code>SPLF</code>)</li><li><strong>Security:</strong> Which ISIN or CUSIP is affected?</li><li><strong>Ratios / Rates:</strong> What is the mathematical entitlement? (e.g., USD 0.50 per share, or 2 new shares for every 1 old share held)</li><li><strong>Dates:</strong> The strict chronological lifecycle that dictates <em>exactly</em> who is entitled to the proceeds. This is covered in depth in Chapter 3.</li></ul><p>Any discrepancy between vendors (Bloomberg vs Reuters vs SIX) on any of these parameters must be escalated before the event is broadcast to clients.</p>"
                            }
                        ]
                    })

                # ─────────────────────────────────────────────────────────────
                # CHAPTER 3
                # ─────────────────────────────────────────────────────────────
                elif topic_name == "The Lifecycle & Settlement Cycle":
                    topic.lesson_config_json = json.dumps({
                        "type": "narrative",
                        "parts": [
                            {
                                "title": "THE CHRONOLOGY OF ENTITLEMENT",
                                "narrative": "<p>In the middle office, a corporate action is not a single event &mdash; it is a <strong>rigid, chronological sequence of five critical dates</strong>. Missing any one of these dates results in a miscalculated entitlement, triggering claims, counter-claims, and severe financial liability for the custodian.</p><p>The sequence is always:</p><ol><li><strong>Announcement Date</strong> &rarr; The Board declares the event</li><li><strong>Cum-Date</strong> &rarr; Last day to buy and still receive the entitlement</li><li><strong>Ex-Date</strong> &rarr; Stock trades without the entitlement value</li><li><strong>Record Date</strong> &rarr; The shareholder register snapshot is taken</li><li><strong>Pay Date</strong> &rarr; Cash or securities are distributed</li></ol><p>Every event in every market around the world follows this pattern. The differences between markets lie only in the <em>gaps</em> between these dates, driven by the country&apos;s settlement cycle rules.</p>"
                            },
                            {
                                "title": "INTERACTIVE: The 5-Date Lifecycle",
                                "narrative": "<p>Use the interactive widget below to step through each of the five lifecycle dates. For each date, you will find:</p><ul><li>Its precise operational definition</li><li>The <strong>Operations Team&apos;s</strong> focus on that date</li><li>The <strong>market impact</strong> of the date</li><li>A live <strong>Apple (AAPL) dividend</strong> example showing the numbers in action</li><li>A hidden <strong>Senior Analyst Tip</strong> revealing real-world gotchas</li></ul>",
                                "widgetType": "ca-lifecycle-dates",
                                "alt": "Interactive 5-date lifecycle explorer for corporate actions."
                            },
                            {
                                "title": "THE SETTLEMENT CYCLE RELATIONSHIP",
                                "narrative": "<p>The most misunderstood concept in corporate actions is the relationship between the <strong>Ex-Date</strong> and the <strong>Record Date</strong>. They are <strong>not always the same day</strong>. The gap between them is entirely determined by the country&apos;s market settlement cycle.</p><p><strong>The Golden Rule:</strong> The Ex-Date is set so that a trade executed on the Cum-Date will settle exactly <em>on</em> the Record Date &mdash; not one day after it.</p><ul><li><strong>T+2 Market (e.g., most of Europe):</strong> A trade on Monday settles on Wednesday. Therefore Ex-Date must be Tuesday (1 day before Record Date), so a Monday buyer settles on Wednesday (the Record Date).</li><li><strong>T+1 Market (US, India, Canada post-2024):</strong> A trade on Tuesday settles on Wednesday. Therefore Ex-Date is Wednesday (the <em>same day</em> as Record Date), so a Tuesday buyer settles on Wednesday (the Record Date).</li></ul>"
                            },
                            {
                                "title": "INTERACTIVE: Settlement Cycle Simulator",
                                "narrative": "<p>Toggle between <strong>T+1 (US / India)</strong> and <strong>T+2 (Europe)</strong> settlement modes below. Click any calendar day to see exactly whether a buyer on that day is legally entitled to the dividend or not.</p><p>This is the exact decision tree a corporate actions operations analyst runs through when deciding whether to file a <strong>Market Claim</strong>.</p>",
                                "widgetType": "ca-settlement-cycle",
                                "alt": "T+1 vs T+2 Settlement Cycle Simulator for corporate actions."
                            },
                            {
                                "title": "MARKET CLAIMS: When Settlement Goes Wrong",
                                "narrative": "<p>Real life is messier than the textbook. Trades fail. Counterparties default. Systems crash. When a trade executed on the <strong>Cum-Date fails to settle on the Record Date</strong>, the buyer has a legal right to the entitlement &mdash; but the entitlement was paid to the seller, who still holds the shares on record.</p><p>This creates a <strong>Market Claim</strong>. The process works as follows:</p><ol><li><strong>Identification:</strong> The custodian&apos;s fails management system automatically flags all unsettled trades that span the Record Date at end of day.</li><li><strong>Claim Generation:</strong> A SWIFT <code>MT565</code> Instruction message is generated and sent to the failing counterparty, demanding the return of the equivalent cash or securities.</li><li><strong>Resolution:</strong> The counterparty acknowledges and processes a reverse payment equal to the gross entitlement (before any tax deductions).</li><li><strong>Time Pressure:</strong> Claims have strict market deadlines &mdash; often 15 to 30 business days. Failing to file within the window means the entitlement is <strong>permanently lost</strong>, a direct financial write-off for the custodian.</li></ol><p>Market Claims are the bread and butter of a middle-office corporate actions team. A senior analyst on a busy dividend cycle may handle dozens in a single day.</p>"
                            }
                        ]
                    })

        db.commit()
    finally:
        db.close()
