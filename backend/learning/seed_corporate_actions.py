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
            "Market Claims & Transformations (Cum vs Ex)"
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

        db.commit()
    finally:
        db.close()
