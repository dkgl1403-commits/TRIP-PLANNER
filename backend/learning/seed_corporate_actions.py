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
            "The Lifecycle & Settlement Cycle",
            "The SWIFT Messaging Protocol",
            "The Custody Chain & Entitlement Flow",
            "The Taxonomy of Events (Income, Restructuring, Redemptions)",
            "Market Claims & Transformations (Cum vs Ex)",
            "Accounts, Taxes & FX (Nostro/Vostro, WHT & Corporate FX)",
            "Securities Lending, Repo & Manufactured Payments",
            "The Wealth Distributors (Cash Dividends, Buybacks & Bonus Issues)",
            "The Restructurers (Stock Splits, Reverse Splits & Rights Issues)",
            "The Game Changers (Mergers, Acquisitions & Spin-offs)"
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
                                "narrative": "<p>The most misunderstood concept in corporate actions is the relationship between the <strong>Ex-Date</strong> and the <strong>Record Date</strong>. They are <strong>not always the same day</strong>. The gap between them is entirely determined by the country&apos;s market settlement cycle.</p><p><strong>The Golden Rule:</strong> The Ex-Date is set so that a trade executed on the Cum-Date will settle exactly <em>on</em> the Record Date &mdash; not one day after it.</p><ul><li><strong>T+2 (e.g., most of Europe &mdash; LSE, Euronext, XETRA):</strong> A trade on Monday settles on Wednesday. Therefore Ex-Date must be Tuesday (1 day before Record Date), so a Monday buyer settles on Wednesday (the Record Date).</li><li><strong>T+1 (US since May 2024, India NSE/BSE since January 2023):</strong> A trade on Tuesday settles on Wednesday. Therefore Ex-Date is Wednesday (the <em>same day</em> as Record Date), so a Tuesday buyer settles on Wednesday.</li><li><strong>T+0 (India SEBI optional pilot since March 2024, top 500 stocks):</strong> A trade settles the <em>same day</em> it is placed. This completely flips the usual Ex-Date logic &mdash; you can actually buy stock on the Record Date itself and still receive the entitlement, as long as you buy before the intraday cut-off time (typically 1:30 PM). The Ex-Date therefore falls the day <em>after</em> the Record Date.</li></ul><p>Note: <strong>Hong Kong (HKEX)</strong> currently operates on T+2. As of mid-2026, HKEX has published a consultation paper to move to <strong>T+1 by Q4 2027</strong>. There is no active proposal for T+0 in Hong Kong cash equities.</p>"
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

                # ─────────────────────────────────────────────────────────────
                # CHAPTER 4
                # ─────────────────────────────────────────────────────────────
                elif topic_name == "The SWIFT Messaging Protocol":
                    topic.lesson_config_json = json.dumps({
                        "type": "narrative",
                        "parts": [
                            {
                                "title": "THE LANGUAGE OF THE MIDDLE OFFICE",
                                "narrative": "<p>Global custodians do not process corporate actions manually over email or spreadsheets. The entire global lifecycle is governed by automated, structured messages sent across the secure <strong>SWIFT network</strong>.</p><p>Historically, this was handled under the <strong>ISO 15022</strong> standard (the MT500 series). Today, the financial industry is migrating to the richer, XML-based <strong>ISO 20022</strong> standard (the <code>seev</code> series).</p><p>As a Senior Corporate Actions Analyst, you must be fluent in both standards, understanding how structured tags translate into ledger entries and operational actions.</p>"
                            },
                            {
                                "title": "THE CORE MT5xx MESSAGE FLOW",
                                "narrative": "<p>The core lifecycle uses five primary SWIFT MT messages:</p><ol><li><strong>MT564 (Notification):</strong> Sent by Depository/Custodian to broadcast upcoming event terms, ISIN, ratios, and dates. Dynamic updates are issued as <code>NEWM</code> (New), <code>REPE</code> (Replacement), or <code>WITH</code> (Withdrawal).</li><li><strong>MT565 (Instruction):</strong> Sent by the client back to the custodian for Voluntary (<code>VOLU</code>) or Choice (<code>CHOS</code>) events to elect an option before cut-off.</li><li><strong>MT567 (Status & Advice):</strong> Sent by custodian back to client to confirm instruction receipt and status (<code>PACK</code> = Accepted, <code>REJT</code> = Rejected with reason code).</li><li><strong>MT566 (Confirmation):</strong> Sent on Pay Date to confirm cash or security entitlements have been credited or debited.</li><li><strong>MT568 (Narrative):</strong> Sent when complex reorganizations or legal terms cannot fit into structured tags (note: free-text breaks STP and requires manual analyst review).</li></ol>"
                            },
                            {
                                "title": "INTERACTIVE: SWIFT STP Flow Visualizer",
                                "narrative": "<p>Explore the end-to-end Straight-Through Processing (STP) message flow below. Toggle between <strong>Mandatory</strong>, <strong>Voluntary</strong>, and <strong>Choice</strong> events, and switch between legacy <strong>ISO 15022 (MT)</strong> and modern <strong>ISO 20022 (XML seev)</strong> standards.</p>",
                                "widgetType": "swift-message-flow-sankey",
                                "alt": "Interactive SWIFT STP Flow Visualizer for Corporate Actions."
                            },
                            {
                                "title": "AUXILIARY MESSAGES: MT202, MT508 & MT304",
                                "narrative": "<p>Beyond the core MT564-567 chain, a Senior Analyst must master three critical auxiliary SWIFT messages used for cash settlement, position blocking, and currency conversions:</p><ul><li><strong>MT508 (Intra-Position Advice / Block Instruction):</strong> Used during Voluntary events (like Tender Offers or Rights Subscriptions). When a client submits an MT565 election, the custodian&apos;s system generates an MT508 to move the tendered shares from <em>Unrestricted Available Balance</em> to <em>Blocked/Earmarked Balance</em>. This prevents the client from accidentally selling the tendered shares on the open market while the offer is pending.</li><li><strong>MT202 (Financial Institution Funds Transfer / Cover Payment):</strong> Used on Pay Date for cash settlement. When cash dividend funds are distributed by the issuer paying agent, they are transferred between bank accounts via MT202 RTGS (Fedwire/CHIPS/TARGET2) separately from the MT566 confirmation message.</li><li><strong>MT304 (Advice of FX Instruction / Corporate Action FX Cover):</strong> Used in multi-currency corporate actions. If a dividend is declared in Japanese Yen (JPY) or Euro (EUR), but beneficial owners require payout in USD, the custodian&apos;s FX desk executes a corporate action FX cover trade and confirms the rate via MT304 before posting net cash in MT566.</li></ul>"
                            },
                            {
                                "title": "INTERACTIVE: SWIFT Message Dictionary",
                                "narrative": "<p>Use the dictionary below to inspect the complete operational profiles of MT564, MT565, MT566, MT567, MT568, MT508, MT202, and MT304 &mdash; including their ISO 20022 equivalents, SWIFT tags, and senior analyst gotchas.</p>",
                                "widgetType": "ca-swift-dictionary",
                                "alt": "Comprehensive SWIFT Corporate Actions Message Dictionary."
                            }
                        ]
                    })

                # ─────────────────────────────────────────────────────────────
                # CHAPTER 5
                # ─────────────────────────────────────────────────────────────
                elif topic_name == "The Custody Chain & Entitlement Flow":
                    topic.lesson_config_json = json.dumps({
                        "type": "narrative",
                        "parts": [
                            {
                                "title": "INTRODUCTION: The Illusion of Ownership",
                                "narrative": "<p>There is a persistent illusion in retail finance that when an investor buys a share of Apple, their name is written in a ledger in Cupertino. In reality, the modern capital market relies entirely on the <strong>&quot;Street Name&quot; or Nominee structure</strong>.</p><p>The issuer (Apple) only knows one massive shareholder: the Central Securities Depository (DTC). Below that depository sits an invisible, highly complex, multi-tiered pyramid of banks, custodians, and prime brokers.</p><p>In Corporate Actions, understanding this custody pyramid is paramount because every entitlement, every tax withholding deduction, and every MT564 notification must trickle flawlessly down this pyramid to reach the actual <strong>Beneficial Owner</strong>.</p>"
                            },
                            {
                                "title": "THE ACTORS IN THE PYRAMID",
                                "narrative": "<p>To process a complex corporate action, you must understand exactly who holds the assets at each level, and whose ledger is the source of truth:</p><ol><li><strong>1. The CSD (Central Securities Depository):</strong> The top of the domestic pyramid (e.g. DTC, CREST, Euroclear UK). Holds the ultimate legal &quot;Golden Record&quot; of dematerialized shares. On Record Date, the CSD takes the snapshot of direct participants and distributes bulk gross payments on Pay Date.</li><li><strong>2. The ICSD (International CSD):</strong> Entities like Euroclear Bank and Clearstream. Settles cross-border Eurobonds and international equities, operating as a bridge between multiple domestic CSDs across 100+ countries.</li><li><strong>3. The Sub-Custodian (Local Agent Bank):</strong> Hired by Global Custodians to provide direct market access in countries where the Global Custodian lacks a local banking license (e.g. Standard Chartered in Asia). Intercepts local MT564s, translates local market practices, and applies local withholding tax.</li><li><strong>4. The Global Custodian (GC):</strong> Master aggregator for institutional clients (e.g. BNY Mellon, State Street). Consolidates multi-asset portfolios across 50+ countries, sweeps FX requirements, and manages aggregated client election deadlines.</li><li><strong>5. The Broker (Prime / Executing Broker):</strong> Holds assets for trading clients and hedge funds in &quot;Street Name&quot;. If shares were lent out to short sellers over Record Date (hypothecation), the broker must manufacture the dividend (&quot;Substitute Payment&quot;).</li><li><strong>6. The Beneficial Owner (HNI / Client / Fund):</strong> The ultimate investor who bears all economic risk and reward. On voluntary events, the Beneficial Owner makes the final decision and submits MT565 instructions.</li></ol>"
                            },
                            {
                                "title": "INTERACTIVE: Custody Chain & Pyramid Explorer",
                                "narrative": "<p>Explore the 6-level custody hierarchy below. Click any actor level to inspect their market role, operational duties, real-world firm examples, and STP risk triggers. Toggle the simulation modes to trace how notifications cascade down and instructions aggregate up.</p>",
                                "widgetType": "custody-chain-pyramid",
                                "alt": "Interactive Custody Chain & Pyramid Visualizer."
                            },
                            {
                                "title": "THE OMNIBUS CHALLENGE: Cash Breaks & Rounding",
                                "narrative": "<p>Why do Straight-Through Processing (STP) breaks happen? Because of <strong>Omnibus Accounts</strong>.</p><p>When the CSD pays a dividend, it does not send 50,000 small checks. It pays <strong>one massive lump sum of $10,000,000</strong> to the Sub-Custodian&apos;s omnibus account. The Sub-Custodian must slice that into $6,000,000 for Global Custodian A and $4,000,000 for Global Custodian B. Global Custodian A then slices it into thousands of smaller allocations for individual client accounts.</p><p>If there is a <strong>1-cent rounding error</strong> at the CSD level, or an unsettled failed trade spanning the Record Date, the omnibus account will experience a <strong>Cash Break or Stock Break</strong>. Operations analysts reconcile these breaks by writing off fractional discrepancies to dedicated General Ledger (GL) rounding accounts to ensure day-end ledger balance.</p>"
                            },
                            {
                                "title": "INTERACTIVE: Omnibus Allocation & Break Calculator",
                                "narrative": "<p>Use the calculator below to simulate how a bulk $10,000,000 CSD payout gets sliced across multiple client accounts with different tax treaty rates (0%, 15%, 30%). Switch to the <strong>1-Cent Break Simulator</strong> to see how analysts resolve rounding discrepancies.</p>",
                                "widgetType": "ca-omnibus-allocation",
                                "alt": "Interactive Omnibus Account Allocation & Break Calculator."
                            }
                        ]
                    })

                # ─────────────────────────────────────────────────────────────
                # CHAPTER 6
                # ─────────────────────────────────────────────────────────────
                elif topic_name == "The Taxonomy of Events (Income, Restructuring, Redemptions)":
                    topic.lesson_config_json = json.dumps({
                        "type": "narrative",
                        "parts": [
                            {
                                "title": "THE TAXONOMY OF EVENTS",
                                "narrative": "<p>While SWIFT categorizes events by client participation status (Mandatory vs Voluntary), middle-office operations teams categorize corporate actions by their <strong>underlying economic purpose</strong>. This taxonomy dictates downstream processing logic, tax treatments, and general ledger accounting impacts.</p><p>Every corporate action processed globally falls into one of four core operational families:</p>"
                            },
                            {
                                "title": "1. Income / Distribution Events",
                                "narrative": "<p>The issuer is distributing cash or new securities representing a portion of earnings or capital to shareholders. Crucially, the <strong>parent security ISIN does not change</strong>.</p><ul><li><strong>Examples:</strong> Cash Dividend (<code>DVCA</code>), Stock Dividend / Bonus Issue (<code>DVSE</code>), Interest Payment (<code>INTR</code>).</li><li><strong>Operational Focus:</strong> Heavy emphasis on Withholding Tax (WHT) matrix calculations, tax treaty relief, and foreign exchange (FX) sweeps.</li></ul>"
                            },
                            {
                                "title": "2. Restructuring / Reorganization Events",
                                "narrative": "<p>The issuer is altering its capital structure. This usually involves a change in the security&apos;s identification (a new ISIN/CUSIP) or a change in the physical number of shares held.</p><ul><li><strong>Examples:</strong> Mergers (<code>MRGR</code>), Spin-offs (<code>SPUN</code>), Stock Splits (<code>SPLF</code>), Reverse Splits (<code>SPLR</code>), Name/ISIN Change (<code>NAME</code>).</li><li><strong>Operational Focus:</strong> Fraction management (cash-in-lieu vs rounding up/down) and blocking the old ISIN from trading (Transformation).</li></ul>"
                            },
                            {
                                "title": "3. Redemption Events",
                                "narrative": "<p>Debt instruments (bonds) or preferred shares are being returned to the issuer in exchange for principal and finalized interest payouts.</p><ul><li><strong>Examples:</strong> Final Maturity (<code>REDM</code>), Early Call/Draw (<code>MCAL</code>), Put Option (<code>PUTT</code>).</li><li><strong>Operational Focus:</strong> Managing the amortization factor and ensuring the pool factor is correctly applied to the nominal value held on Record Date.</li></ul>"
                            },
                            {
                                "title": "4. Information & Governance Events",
                                "narrative": "<p>Events that carry no direct, immediate economic payout but affect shareholder voting rights and corporate governance.</p><ul><li><strong>Examples:</strong> Annual General Meetings (<code>MEET</code>), Consent Solicitation (<code>CONS</code>), Bankruptcy / Liquidation (<code>BRUP</code>).</li><li><strong>Operational Focus:</strong> Proxy voting execution, Power of Attorney (PoA) validation, and share immobilisation blocking if required.</li></ul>"
                            },
                            {
                                "title": "INTERACTIVE: 4-Category Event Taxonomy",
                                "narrative": "<p>Use the interactive widget below to explore each of the 4 event families, inspect SWIFT <code>:22F::CAEV</code> codes, economic impacts, and custody accounting entries.</p>",
                                "widgetType": "ca-event-taxonomy",
                                "alt": "Interactive 4-Category Corporate Actions Taxonomy Explorer."
                            }
                        ]
                    })

                # ─────────────────────────────────────────────────────────────
                # CHAPTER 7
                # ─────────────────────────────────────────────────────────────
                elif topic_name == "Market Claims & Transformations (Cum vs Ex)":
                    topic.lesson_config_json = json.dumps({
                        "type": "narrative",
                        "parts": [
                            {
                                "title": "THE CUM VS EX FRAMEWORK",
                                "narrative": "<p>When the market functions perfectly, a trade settles on time, and the Record Date snapshot captures exactly who owns what. But the market rarely functions perfectly. Trades fail, counterparties default, and clearing houses experience delays.</p><p>What happens when a trade is executed with the entitlement (<strong>Cum</strong>), but fails to settle before the Record Date snapshot? The Depository pays the wrong party!</p><ul><li><strong>Cum-Entitlement:</strong> The buyer is legally entitled to the corporate action proceeds.</li><li><strong>Ex-Entitlement:</strong> The seller is legally entitled to the corporate action proceeds.</li></ul><p>The Ex-Date is the strict boundary. Trades executed before Ex-Date are Cum. Trades executed on or after Ex-Date are Ex.</p>"
                            },
                            {
                                "title": "1. MARKET CLAIMS (Income Events)",
                                "narrative": "<p>A <strong>Market Claim</strong> is an operational mechanism to redirect corporate action proceeds to the rightful economic owner when an unsettled trade crosses the Record Date.</p><p><strong>The Scenario:</strong> A buyer purchases 1,000 shares on Monday (Cum-Date). The Ex-Date is Tuesday, and Record Date is Wednesday. The trade fails and does not settle until Thursday.</p><p><strong>The Break:</strong> On Wednesday evening, the Seller is still listed on the CSD&apos;s register. The CSD pays the $1,000 dividend to the Seller.</p><p><strong>The Action:</strong> Because the trade was executed Cum-Dividend, the Buyer legally owns that cash. The Central Counterparty (CCP) or Custodian generates an automated <strong>Market Claim</strong>: force-debiting $1,000 from the Seller&apos;s cash account and crediting it to the Buyer.</p>"
                            },
                            {
                                "title": "2. REVERSE CLAIMS & TRANSFORMATIONS",
                                "narrative": "<p><strong>Reverse Claims:</strong> If a trade is executed Ex-Dividend (buyer not entitled) but settles early before Record Date due to an operational anomaly, the CSD accidentally pays the Buyer. A Reverse Claim force-debits the Buyer and returns funds to the Seller.</p><p><strong>Transformations (Restructuring Events):</strong> While Claims handle cash and fractional stock distributions, Transformations handle mandatory reorganizations (like a 2-for-1 Stock Split or Merger) on pending trades.</p><p>If 100 shares of Old ISIN are pending settlement when a 2-for-1 split occurs, the Old ISIN is extinguished. Settlement on the Old ISIN will fail. The Custodian and CCP must <strong>cancel the pending trade</strong> for 100 Old ISIN shares and <strong>Transform it</strong> into a new pending trade for 200 shares of the New ISIN at half the settlement price.</p><p><strong>Special Ex / Special Cum:</strong> Counterparties trading OTC can explicitly agree to trade &quot;Special Ex&quot; or &quot;Special Cum&quot;. The custodian&apos;s STP engine must intercept these trade flags to suppress automated Market Claim generation.</p>"
                            },
                            {
                                "title": "INTERACTIVE: Market Claims & Transformations Simulator",
                                "narrative": "<p>Test trade timing, settlement failures, and Special OTC flags below to see how the middle office automatically generates Market Claims, Reverse Claims, or Trade Transformations.</p>",
                                "widgetType": "ca-claims-transformations",
                                "alt": "Interactive Market Claims & Transformations Simulator."
                            }
                        ]
                    })

                # ─────────────────────────────────────────────────────────────
                # CHAPTER 8
                # ─────────────────────────────────────────────────────────────
                elif topic_name == "Accounts, Taxes & FX (Nostro/Vostro, WHT & Corporate FX)":
                    topic.lesson_config_json = json.dumps({
                        "type": "narrative",
                        "parts": [
                            {
                                "title": "INTRODUCTION: The Illusion of Cash",
                                "narrative": "<p>In retail finance, cash just &quot;appears&quot; in an account. In the back office, cash does not teleport. It moves through a rigid network of correspondent banks, cross-border wires, and highly scrutinized ledgers.</p><p>When a corporate action generates cash &mdash; whether from a dividend, a tender offer, or a fractional share liquidation &mdash; the journey of that cash is fraught with regulatory hurdles, withholding tax liabilities, and reconciliation breaks.</p>"
                            },
                            {
                                "title": "1. THE RECONCILIATION LEDGERS: Nostro vs. Vostro",
                                "narrative": "<p>To process a cross-border corporate action, a Global Custodian operates two sets of books. You must understand the difference to investigate a &quot;Cash Break&quot;:</p><ul><li><strong>Nostro Account (&quot;Ours&quot;):</strong> Held by the Global Custodian at the local Sub-Custodian bank (e.g. State Street&apos;s EUR account at BNP Paribas in France). <em>&quot;Our money held by You.&quot;</em></li><li><strong>Vostro Account (&quot;Yours&quot;):</strong> Internal sub-ledger account held by the Global Custodian for the end client (Beneficial Owner). <em>&quot;Your money held by Us.&quot;</em></li></ul><p><strong>The STP Break:</strong> A cash break occurs when the Sub-Custodian credits Nostro with &euro;100,000, but the Global Custodian&apos;s MT564 entitlement engine expected &euro;100,005. Until that &euro;5 discrepancy (often a tax rounding mismatch) is investigated and resolved, funds are locked to prevent client overdraft.</p>"
                            },
                            {
                                "title": "INTERACTIVE: Nostro vs Vostro & Cash Break Explorer",
                                "narrative": "<p>Explore the Nostro vs Vostro ledger structure below and investigate how a &euro;5 cash break is resolved in middle-office operations.</p>",
                                "widgetType": "ca-nostro-vostro",
                                "alt": "Interactive Nostro vs Vostro & Cash Break Explorer."
                            },
                            {
                                "title": "2. HOLDING STRUCTURES: Omnibus vs. Segregated",
                                "narrative": "<p>How assets are held at the CSD directly impacts corporate action tax processing and entitlement allocation:</p><ul><li><strong>Omnibus Accounts:</strong> Multiple clients&apos; assets pooled into a single account at the Sub-Custodian. Highly cost-effective for settlement, but creates aggregation nightmares when slicing gross dividend payouts across clients with different tax statuses.</li><li><strong>Segregated Accounts (Name-on-Register):</strong> Each client has a distinct, ring-fenced account at the local CSD. Provides absolute transparency and penny-perfect tax calculations, but is extremely expensive to maintain (usually reserved for Sovereign Wealth Funds).</li></ul>"
                            },
                            {
                                "title": "3. THE TAX BURDEN: Withholding Tax (WHT)",
                                "narrative": "<p>When income is paid across borders, local tax authorities deduct Withholding Tax (WHT) at source before cash leaves the country. Rates are governed by <strong>Statutory Rates</strong> vs <strong>Double Taxation Treaties (DTT)</strong>:</p><ol><li><strong>Relief at Source (RAS):</strong> The Holy Grail. If tax documentation (e.g. W-8BEN) is lodged before Record Date, the dividend is paid minus only the lower treaty rate (e.g. 15% instead of 26.375%).</li><li><strong>Quick Refund:</strong> Dividend is paid at max statutory rate. Shortly after Pay Date, tax certificates are rapidly batched to the foreign tax authority to receive the refund in 2 to 4 weeks.</li><li><strong>Standard Reclaim:</strong> Dividend paid at max statutory rate. Paper-based claims are submitted to the foreign tax authority, taking 1 to 5 years to process.</li></ol>"
                            },
                            {
                                "title": "4. CORPORATE ACTION FOREX (FX)",
                                "narrative": "<p>If a Japanese company pays a JPY dividend to a USD client, currency conversion is required:</p><ul><li><strong>Depo FX (Issuer FX):</strong> Issuer/CSD converts bulk cash before paying custodian. Simple operations, but uses wide mandatory exchange rate spreads (typically 1.5% loss).</li><li><strong>Client FX (Custodian FX):</strong> Custodian receives local currency (JPY) into Nostro, then internal FX desk executes bulk spot FX to convert to USD at a tight institutional spread (0.2%).</li></ul>"
                            },
                            {
                                "title": "INTERACTIVE: Cross-Border Entitlement Simulator",
                                "narrative": "<p>Configure holding structures, tax methods, and FX execution modes below to watch a gross &euro;100,000 European dividend bleed down to the net USD Vostro credit.</p>",
                                "widgetType": "ca-cross-border-simulator",
                                "alt": "Interactive Cross-Border Entitlement Simulator."
                            }
                        ]
                    })

                # ─────────────────────────────────────────────────────────────
                # CHAPTER 9
                # ─────────────────────────────────────────────────────────────
                elif topic_name == "Securities Lending, Repo & Manufactured Payments":
                    topic.lesson_config_json = json.dumps({
                        "type": "narrative",
                        "parts": [
                            {
                                "title": "INTRODUCTION: The Illusion of the Ledger",
                                "narrative": "<p>When a massive institutional investor (like a Pension Fund) holds 10 million shares of Microsoft, they rarely just let them sit in a vault. To generate extra yield, they lend those shares out to short sellers or use them as collateral in Repurchase Agreements (Repo).</p><p>But here is the problem: <strong>Corporate Actions do not care about your private lending agreements.</strong> The Depository (CSD) only pays the entity holding the legal title on Record Date. If you lent your shares out, the CSD does not know you exist. Reconciling the economic reality of the lender with the legal reality of the Depository is the most volatile friction point in Corporate Actions.</p>"
                            },
                            {
                                "title": "1. THE GOLDEN RULE OF TITLE TRANSFER",
                                "narrative": "<p>In both Securities Lending and Repo, the <strong>Legal Title</strong> of the security transfers from the Lender to the Borrower (or Cash Taker).</p><p>Because the Borrower now legally owns the shares, they usually sell them immediately into the open market to a short sale buyer.</p><ul><li><strong>The CSD Reality:</strong> On Record Date, the CSD looks at the ledger. The original Lender is not there. The Borrower is not there. The <strong>New Buyer</strong> (who bought from the short seller) is on the register.</li><li><strong>The Entitlement:</strong> The Issuer pays the real dividend directly to the New Buyer.</li></ul>"
                            },
                            {
                                "title": "2. THE MANUFACTURED DIVIDEND (Substitute Payment)",
                                "narrative": "<p>If the Lender gave up legal title, but still holds the economic risk and reward of the position, how do they get paid?</p><p>Enter the <strong>Manufactured Dividend</strong> (also known as a Substitute Payment in Lieu of Dividends &mdash; PIL):</p><ul><li><strong>The Contract:</strong> Under the Global Master Securities Lending Agreement (GMSLA) or Global Master Repurchase Agreement (GMRA), the Borrower is contractually obligated to <em>&quot;make the Lender whole.&quot;</em></li><li><strong>The Flow:</strong> The Borrower must pay the Lender an amount of cash exactly equal to the dividend the Lender would have received had they not lent the shares. The Borrower pays this out of their own pocket (a &quot;manufactured&quot; payment).</li><li><strong>The Tax Complication & Gross-Up:</strong> A Manufactured Dividend is not a real dividend &mdash; to tax authorities, it is ordinary income. If the Lender was entitled to a 15% Treaty Rate on a real dividend, but the local tax authority taxes manufactured payments at 30%, the Borrower must perform a <strong>Tax Gross-Up</strong> out of pocket so the Lender receives the exact net cash expected.</li></ul>"
                            },
                            {
                                "title": "3. THE VOTING DILEMMA: The Hard Stop",
                                "narrative": "<p>You can manufacture cash. You can manufacture stock splits by adjusting the loan ledger. <strong>You CANNOT manufacture a vote.</strong></p><p>There is a finite number of voting rights in a public company. Because the New Buyer holds the legal title on Record Date, the New Buyer holds the absolute right to vote.</p><p><strong>The Operations Focus (Record Date Recall):</strong> If the Lender (e.g. BlackRock) wants to vote on a critical M&amp;A deal or hostile board takeover, they must issue a <strong>Recall Notice</strong> to the Borrower well before the Record Date. The Borrower is forced to buy back the shares in the open market and return them to the Lender&apos;s custody account before the CSD snapshot. Missing this deadline results in permanent loss of voting rights.</p>"
                            },
                            {
                                "title": "4. REPO AND COLLATERAL MANAGEMENT",
                                "narrative": "<p>In a Repurchase Agreement (Repo), Party A gives Party B bonds as collateral in exchange for cash. If those bonds pay a coupon (interest) while sitting in Party B&apos;s account, Party B receives the real cash from the CSD.</p><ul><li><strong>Income Tracking:</strong> Party B&apos;s corporate action system must flag these bonds as &quot;Collateral Received&quot; and automatically wire the coupon proceeds back to Party A on Pay Date.</li><li><strong>Collateral Substitution:</strong> To avoid tax tracking hassle, traders perform a <strong>Substitution</strong>. The day before Ex-Date, Party B returns the bonds to Party A and replaces them with Cash collateral just for the event duration.</li></ul>"
                            },
                            {
                                "title": "5. THE SYSTEMIC NIGHTMARE (STP Integration)",
                                "narrative": "<p>Why do breaks happen here? Because the Custody system and the Prime Brokerage (Lending) system are often completely separate legacy databases.</p><p>When the MT564 Notification arrives, the Corporate Action engine calculates entitlements based on the Custody ledger. If the Custody ledger says 0 shares (because they are out on loan), the engine projects $0 dividend. A modern STP engine must dynamically bridge these databases, artificially inflating the Custody position by the &quot;Shares on Loan&quot; ledger to accurately project the incoming Manufactured Dividend.</p>"
                            },
                            {
                                "title": "INTERACTIVE: Securities Lending & Manufactured Dividend Simulator",
                                "narrative": "<p>Test GMSLA recall notices, manufactured PIL cash flows, tax gross-ups, and Repo collateral substitutions using the interactive flow simulator below.</p>",
                                "widgetType": "ca-sec-lending-flow",
                                "alt": "Interactive Securities Lending & Manufactured Dividend Simulator."
                            }
                        ]
                    })

                # ─────────────────────────────────────────────────────────────
                # CHAPTER 10
                # ─────────────────────────────────────────────────────────────
                elif topic_name == "The Wealth Distributors (Cash Dividends, Buybacks & Bonus Issues)":
                    topic.lesson_config_json = json.dumps({
                        "type": "narrative",
                        "parts": [
                            {
                                "title": "INTRODUCTION: The Capital Allocation Dilemma",
                                "narrative": "<p>When a mature, profitable public company generates more cash than it needs for R&amp;D or expansion, the Board of Directors faces a critical decision: <strong>How do we return this excess capital to our shareholders?</strong></p><p>Historically, the answer was simple: pay a dividend. Today, the landscape of wealth distribution is highly optimized for tax efficiency and market psychology. As middle-office professionals, we process these decisions as distinct SWIFT events, each carrying unique reconciliation challenges.</p>"
                            },
                            {
                                "title": "1. CASH DIVIDENDS (SWIFT: DVCA)",
                                "narrative": "<p>The most traditional method of wealth distribution. A portion of corporate earnings is paid directly to shareholders as cash.</p><ul><li><strong>Ordinary Dividends (Interim &amp; Final):</strong> Paid on a regular schedule (quarterly or annually). Interim is declared alongside earnings; Final requires AGM shareholder approval.</li><li><strong>Special Dividends:</strong> A one-time, unusually large payout resulting from a windfall (e.g. selling a major subsidiary).</li><li><strong>The DRIP Complication (Dividend Reinvestment Plan):</strong> Processed as a Choice event (<code>CHOS</code>), DRIP allows investors to automatically use their cash dividend to buy more shares without brokerage fees. Operations must determine if shares are issued from treasury (dilutive) or purchased on the open market, and route remaining fractional cash back to the Vostro account.</li></ul>"
                            },
                            {
                                "title": "2. SHARE BUYBACKS / REPURCHASES (SWIFT: BIDS / TEND)",
                                "narrative": "<p>Over the last two decades, share buybacks have overtaken dividends as the preferred method of returning capital due to tax efficiency. By reducing the total number of Shares Outstanding, earnings are divided among fewer shares, artificially inflating <strong>Earnings Per Share (EPS)</strong>.</p><ul><li><strong>Open Market Repurchase (OMR):</strong> Company buys shares slowly on the open market. Operations impact is zero until outstanding share count updates.</li><li><strong>Tender Offer (SWIFT: BIDS / TEND):</strong> Voluntary (<code>VOLU</code>) offer to buy back a massive block of shares at a premium price. Custodians solicit MT565 client instructions. If oversubscribed, issuers apply <strong>Proration</strong>, requiring analysts to calculate exact acceptance rates and unblock unaccepted shares back to client free balances.</li></ul>"
                            },
                            {
                                "title": "3. BONUS ISSUES / CAPITALIZATION (SWIFT: BONU / CAPG)",
                                "narrative": "<p>A Bonus Issue (also known as a Scrip Issue or Capitalization Issue) is the issuance of free shares to existing shareholders, paid out of Retained Earnings.</p><ul><li><strong>The Accounting Reality:</strong> Retail investors often view bonus shares as &quot;free money.&quot; In reality, the company transfers funds from &quot;Retained Earnings&quot; to &quot;Share Capital.&quot; Share count doubles, but share price instantly halves &mdash; total economic portfolio value is identical.</li><li><strong>Bonus Issue vs. Stock Split (SPLF):</strong> In a Stock Split (<code>SPLF</code>), the Par Value (face value) of the stock decreases and no cash moves on the balance sheet. In a Bonus Issue (<code>BONU</code>), Par Value remains UNCHANGED while retained earnings are physically converted into share capital.</li></ul>"
                            },
                            {
                                "title": "INTERACTIVE: The Wealth Distribution Engine",
                                "narrative": "<p>Compare corporate balance sheets, EPS impacts, and 100-share investor portfolios across Cash Dividends, Tender Buybacks, and Bonus Issues below.</p>",
                                "widgetType": "ca-wealth-distribution",
                                "alt": "Interactive Wealth Distribution Engine Simulator."
                            }
                        ]
                    })

                # ─────────────────────────────────────────────────────────────
                # CHAPTER 11
                # ─────────────────────────────────────────────────────────────
                elif topic_name == "The Restructurers (Stock Splits, Reverse Splits & Rights Issues)":
                    topic.lesson_config_json = json.dumps({
                        "type": "narrative",
                        "parts": [
                            {
                                "title": "INTRODUCTION: Manipulating the Capital Structure",
                                "narrative": "<p>When a company wants to alter its stock price without changing its underlying market capitalization, or when it needs to raise emergency capital without taking on bank debt, it restructures its share count.</p><p>For middle-office operations, these events are mathematically intensive and highly prone to Straight-Through Processing (STP) breaks &mdash; particularly surrounding rounding rules and fractional share dispositions.</p>"
                            },
                            {
                                "title": "1. STOCK SPLITS & REVERSE SPLITS (SWIFT: SPLF / SPLR)",
                                "narrative": "<p>Splits are Mandatory (<code>MAND</code>) events that change the Par Value and total number of outstanding shares:</p><ul><li><strong>Forward Split (SPLF):</strong> e.g. 2-for-1. Used to lower share price, making stock psychologically attractive and liquid for retail traders.</li><li><strong>Reverse Split (SPLR):</strong> e.g. 1-for-10. Artificially inflates share price. Defensive move to avoid exchange delisting (e.g. maintaining NASDAQ $1.00 minimum bid rule).</li><li><strong>The Operations Nightmare (Fractional Shares &amp; CIL):</strong> Holding 125 shares under a 1-for-10 Reverse Split creates 12.5 shares. Because depositories do not support fractional registries, company agents aggregate 0.5 fractions, sell them as whole shares on the open market, and distribute cash back to custodians as <strong>Cash-in-Lieu (CIL)</strong>.</li><li><strong>STP Fractional Disposition Rules:</strong> MT564 messages specify fractional rules: <code>DROP</code> (forfeit fraction), <code>RDUP</code> (round up to whole share), or <code>CASH</code> (pay CIL). A system mismatch between custodian and CSD causes an instant stock break on Pay Date.</li></ul>"
                            },
                            {
                                "title": "2. THE RIGHTS ISSUE (SWIFT: EXRI / RHDI)",
                                "narrative": "<p>A Rights Issue (or Subscription Offer) is a Voluntary (<code>VOLU</code>) capital-raising event where existing shareholders are offered the right to buy newly issued shares at a steep discount to the market price.</p><ul><li><strong>The Nil-Paid Right (RHDI):</strong> On Ex-Date, the company distributes a temporary, tradable derivative called a &quot;Nil-Paid Right&quot; to shareholders.</li><li><strong>TERP (Theoretical Ex-Rights Price):</strong> On Ex-Date, the stock price drops to the TERP, mathematically balancing old expensive shares with new discounted shares: <br/><code>TERP = [(Old Shares × Old Price) + (New Shares × Subscription Price)] / (Old Shares + New Shares)</code></li><li><strong>The 3 Client MT565 Options:</strong> <br/>1. <strong>Exercise / Take Up (EXRI):</strong> Pay subscription price, receive new shares, avoid dilution. <br/>2. <strong>Sell Rights:</strong> Sell rights on open market to pocket cash premium compensating for TERP drop. <br/>3. <strong>Do Nothing / Lapse (EXPI):</strong> Absolute worst case. Rights expire worthless $0, original stock drops to TERP, and client suffers severe uncompensated dilution loss!</li><li><strong>Middle-Office Liability:</strong> If a custodian fails to execute an MT565 <code>EXRI</code> instruction before the CSD deadline, rights lapse. Clients will sue for lost intrinsic value. Operations teams work 24/7 matching cash balances to instruction files to ensure no in-the-money right lapses by mistake.</li></ul>"
                            },
                            {
                                "title": "INTERACTIVE: Rights Issue & Fractional Split Engine",
                                "narrative": "<p>Calculate TERP, test MT565 client instruction options, observe dilution losses, and explore Reverse Split Cash-in-Lieu (CIL) disposition rules below.</p>",
                                "widgetType": "ca-rights-issue-engine",
                                "alt": "Interactive Rights Issue & Fractional Split Engine Simulator."
                            }
                        ]
                    })

                # ─────────────────────────────────────────────────────────────
                # CHAPTERS 12 & 13
                # ─────────────────────────────────────────────────────────────
                elif topic_name == "The Game Changers (Mergers, Acquisitions & Spin-offs)":
                    topic.lesson_config_json = json.dumps({
                        "type": "narrative",
                        "parts": [
                            {
                                "title": "INTRODUCTION: The Death and Birth of ISINs",
                                "narrative": "<p>When companies combine corporate empires or fracture into distinct independent entities, the middle office enters a high-alert state. These events are not just value adjustments; they require the complete deactivation of old securities (ISIN/CUSIP), the creation and mapping of new ones, and the massive movement of cash and equity across global depositories.</p>"
                            },
                            {
                                "title": "1. MERGERS AND ACQUISITIONS (SWIFT: MRGR)",
                                "narrative": "<p>A Merger is a Mandatory (<code>MAND</code>) event where Company A absorbs Company B, or both combine to form a new Company C.</p><ul><li><strong>The Operational Flow:</strong> On the Effective Date, the Target company&apos;s shares are delisted and blocked in the Depository. The Acquirer deposits consideration (Cash, Acquirer Stock, or both) into the Depository, which then credits custodians.</li><li><strong>Dissenters&apos; Rights / Appraisal Rights:</strong> If a shareholder legally objects to the merger price, they can exercise Appraisal Rights via an MT565 instruction. The custodian blocks these shares in a segregated account until a court determines &quot;fair value&quot; (which can take years to settle).</li></ul>"
                            },
                            {
                                "title": "2. TAKEOVERS & TENDER OFFERS (SWIFT: TEND / TOFI)",
                                "narrative": "<p>Unlike a statutory merger, a Tender Offer is Voluntary (<code>VOLU</code>). The acquiring company bypasses the Target&apos;s Board of Directors and offers to buy shares directly from shareholders at a premium.</p><ul><li><strong>Protect Periods &amp; Guaranteed Delivery:</strong> If a client buys Target stock on T-1 near the deadline, the stock won&apos;t settle until T+1 (after the deadline). Custodians issue a <strong>Notice of Guaranteed Delivery</strong> (Protect Instruction) to the Depository, legally guaranteeing delivery within 2 days. If the trade fails to settle, the custodian is strictly liable for the client&apos;s lost cash entitlement!</li><li><strong>Proration Math (Scaleback):</strong> If an acquirer offers to buy up to 50% of the company for cash, but 80% of shareholders elect cash, the Depository applies a <strong>Proration Factor</strong>. If a client tendered 10,000 shares, only 6,250 shares are accepted for cash; the 3,750 unaccepted shares are scaled back and converted to the default stock consideration.</li></ul>"
                            },
                            {
                                "title": "3. SPIN-OFFS & DEMERGERS (SWIFT: SPUN / DEME)",
                                "narrative": "<p>A Spin-off is a Mandatory (<code>MAND</code>) event where a Parent company takes a subsidiary, establishes it as an independent public company, and distributes new shares to existing shareholders.</p><ul><li><strong>Valuation Adjustment:</strong> On Ex-Date, the market price of the Parent company drops by the exact market value of the newly spun-off company.</li><li><strong>Tax &amp; Cost Basis Allocation:</strong> For tax reporting (IRS Form 8937), the investor&apos;s original Cost Basis (purchase price) must be mathematically split between the Parent and Spin-off lines based on relative market value. For example, if Parent trades at $80 and Spin-off at $20 post-event, the custodian reallocates historical tax lots 80% to Parent and 20% to Spin-off to ensure accurate capital gains calculations upon eventual sale.</li></ul>"
                            },
                            {
                                "title": "INTERACTIVE: M&A Proration & Spin-off Cost Basis Engine",
                                "narrative": "<p>Simulate tender offer scaleback proration, test Guaranteed Delivery (Protect Period) custodian liability, and calculate IRS spin-off cost basis splits below.</p>",
                                "widgetType": "ca-merger-proration-engine",
                                "alt": "Interactive M&A Proration & Spin-off Cost Basis Engine Simulator."
                            }
                        ]
                    })

        db.commit()
    finally:
        db.close()
