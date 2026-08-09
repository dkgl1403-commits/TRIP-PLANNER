import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_trade_lifecycle():
    db = SessionLocal()
    try:
        class_master = db.query(LearningClass).filter_by(level=11, name="Masterclass").first()
        if not class_master:
            print("Masterclass not found.")
            return

        tl_subject = db.query(LearningSubject).filter_by(name="Trade Lifecycle", class_id=class_master.id).first()
        if not tl_subject:
            print("Subject 'Trade Lifecycle' not found.")
            return

        topics = [
            "The Interactive Roadmaps (Macro Trade Flow & Dual-Sided Engine)",
            "The Evolution of the Exchange & CLOB (Matching Engines & Order Books)",
            "The Cast of Characters (Buy-Side, Sell-Side, Venues & Infrastructure)",
            "The Front Office (OMS/EMS, FIX Protocol & Algorithmic Execution)",
            "The Handshake & The Breakdown (Block Allocation & CTM Affirmation)",
            "CCPs, Novation & Multilateral Netting (Clearing & Risk Shielding)",
            "The Settlement SWIFT Flow (ISO 15022 / ISO 20022)",
            "Delivery versus Payment (DvP) Models & CSD Settlement Mechanics",
            "Settlement Fails, CSDR & Mandatory Buy-In Regimes",
            "T+1, T+0, Atomic Settlement & Advanced Inventory Management (Earmarking, Hold & Release)",
            "Securities Lending & Borrowing (SBL), Short Selling & Fail Prevention",
            "Post-Trade Reconciliation, Nostro/Vostro Ledgers & Regulatory Reporting"
        ]

        for idx, topic_name in enumerate(topics):
            topic = db.query(LearningTopic).filter_by(name=topic_name, subject_id=tl_subject.id).first()
            if not topic:
                topic = LearningTopic(
                    subject_id=tl_subject.id,
                    name=topic_name,
                    order=idx + 1
                )
                db.add(topic)
                db.flush()

            if topic_name == "The Interactive Roadmaps (Macro Trade Flow & Dual-Sided Engine)":
                topic.lesson_config_json = json.dumps({
                    "type": "narrative",
                    "parts": [
                        {
                            "title": "INTRODUCTION: What is the Trade Lifecycle?",
                            "narrative": "<p>The <strong>Trade Lifecycle</strong> is the end-to-end process of executing, processing, clearing, and settling a financial transaction &mdash; spanning from initial trade decision to final irrevocable settlement at the depository.</p><p>It ensures that trades are executed accurately, comply with market regulations, risk exposure is mitigated, and legal title of assets and cash are properly transferred between counterparties.</p>"
                        },
                        {
                            "title": "1. THE 6 STANDARD MARKET STAGES OF THE TRADE LIFECYCLE",
                            "narrative": "<p>In capital markets, every institutional trade moves through 6 standard operational stages:</p><ol><li><strong>Stage 1: Pre-Trade Preparation &amp; Trade Initiation (Front Office):</strong> Client onboarding, risk assessment, credit limit checks, and investment decision by the Portfolio Manager (PM).</li><li><strong>Stage 2: Trade Execution &amp; Trade Capture (Front Office / Venue):</strong> Placing orders on exchanges or OTC markets. FIX Protocol (<code>35=D</code> New Order Single) routes orders, and execution engines generate <code>35=8</code> Execution Reports logged into Trade Capture.</li><li><strong>Stage 3: Trade Enrichment, Confirmation &amp; Affirmation (Middle Office):</strong> Attaching Standing Settlement Instructions (SSIs), ISIN/CUSIP identifiers, and custodian details. Verifying trade economics with counterparties via DTCC CTM for <strong>Electronic Trade Confirmation (ETC) &amp; Affirmation</strong>.</li><li><strong>Stage 4: Clearing &amp; CCP Novation (Clearing House):</strong> Verifying obligations, calculating margin calls, and performing <strong>Novation</strong> &mdash; where the Central Counterparty (CCP) replaces the original contract to become Buyer to every Seller and Seller to every Buyer.</li><li><strong>Stage 5: Custodian Instructions &amp; Matching (Back Office):</strong> Custodians receive instructions (SWIFT <code>MT541</code> RVP / <code>MT543</code> DVP) to prepare securities and cash delivery. CSD matches instructions and issues <code>MT548</code> Matched status.</li><li><strong>Stage 6: Settlement (DvP) &amp; Post-Trade Reconciliation (Depository):</strong> Simultaneous irrevocable transfer of securities and cash via <strong>Delivery vs Payment (DvP)</strong> at the CSD. Post-trade management executes Nostro/Vostro cash ledger reconciliations and regulatory reporting.</li></ol>"
                        },
                        {
                            "title": "2. DUAL-SIDED SYMMETRICAL MARKET ARCHITECTURE",
                            "narrative": "<p>Capital markets operate on dual-sided symmetry. Every buyer has a corresponding seller, and every security movement has a matching cash sweep.</p><p>Both counterparties run parallel Front, Middle, and Back office operations &mdash; converging at the <strong>Central Counterparty (CCP)</strong> for clearing novation and the <strong>Central Securities Depository (CSD)</strong> for final DvP settlement.</p>"
                        },
                        {
                            "title": "INTERACTIVE: Trade Lifecycle Macro Roadmap & Dual-Sided Engine",
                            "narrative": "<p>Explore the 6 standard market stages and simulate the dual-sided trade lifecycle engine below.</p>",
                            "widgetType": "tl-macro-roadmap",
                            "alt": "Interactive Trade Lifecycle Macro Roadmap & Dual-Sided Engine Simulator."
                        }
                    ]
                })

            elif topic_name == "The Evolution of the Exchange & CLOB (Matching Engines & Order Books)":
                topic.lesson_config_json = json.dumps({
                    "type": "narrative",
                    "parts": [
                        {
                            "title": "INTRODUCTION: The Transformation of the Marketplace",
                            "narrative": "<p>For over two centuries, stock exchanges were physical locations where human brokers gathered to trade. On May 17, 1792, 24 stockbrokers signed the <strong>Buttonwood Agreement</strong> under a sycamore tree outside 68 Wall Street, establishing fixed commissions and giving birth to the New York Stock Exchange (NYSE).</p><p>For decades, trading relied on <strong>Open Outcry</strong> pits &mdash; where floor brokers shouted prices and used complex hand signals to execute paper trade slips. Today, open outcry is obsolete. Global equity trading is executed entirely by electronic matching engines running in microsecond datacenters.</p>"
                        },
                        {
                            "title": "1. CENTRAL LIMIT ORDER BOOK (CLOB) MECHANICS",
                            "narrative": "<p>Modern exchanges operate a <strong>Central Limit Order Book (CLOB)</strong>. The CLOB is a continuous ledger containing two distinct lists:</p><ul><li><strong>Bids (Buying Demand):</strong> Orders from buyers specifying the maximum price they are willing to pay, sorted from highest price to lowest price.</li><li><strong>Asks / Offers (Selling Supply):</strong> Orders from sellers specifying the minimum price they are willing to accept, sorted from lowest price to highest price.</li><li><strong>The Bid-Ask Spread:</strong> The price gap between the highest Bid (Touch Bid) and the lowest Ask (Touch Ask).</li></ul>"
                        },
                        {
                            "title": "2. PRICE-TIME PRIORITY & MAKER/TAKER ECONOMICS",
                            "narrative": "<p>Matching engines execute orders according to strict <strong>Price-Time Priority</strong>:</p><ol><li><strong>Price Priority:</strong> Orders with the best price (highest bid or lowest ask) are always executed first.</li><li><strong>Time Priority:</strong> Among orders at the exact same price level, the order that arrived earliest at the matching engine gets filled first.</li></ol><p><strong>Maker vs Taker Economics:</strong> Exchanges incentivize liquidity through rebate models. A trader placing a Limit Order that rests on the book provides liquidity (<strong>Liquidity Maker</strong>) and earns a rebate (e.g. +$0.02/share). A trader placing a Market Order that executes immediately consumes liquidity (<strong>Liquidity Taker</strong>) and pays a venue fee (e.g. -$0.05/share).</p>"
                        },
                        {
                            "title": "INTERACTIVE: Live CLOB Matching Engine & Evolution Timeline",
                            "narrative": "<p>Simulate placing Limit Orders (Maker) vs Market Orders (Taker) into a live CLOB matching engine and explore the history of exchange venues below.</p>",
                            "widgetType": "tl-clob-engine",
                            "alt": "Interactive Central Limit Order Book (CLOB) & Exchange Evolution Timeline."
                        }
                    ]
                })

            elif topic_name == "The Cast of Characters (Buy-Side, Sell-Side, Venues & Infrastructure)":
                topic.lesson_config_json = json.dumps({
                    "type": "narrative",
                    "parts": [
                        {
                            "title": "INTRODUCTION: The Market Ecosystem & Liability Chain",
                            "narrative": "<p>Institutional trading is an interconnected web of specialized participants. Each entity fulfills a distinct operational mandate and assumes specific legal liability under regulatory frameworks (SEC, FINRA, MiFID II).</p><p>Understanding capital markets requires deconstructing the 5 core pillars of market participants: <strong>Buy-Side</strong>, <strong>Sell-Side</strong>, <strong>Trading Venues</strong>, <strong>Securities Infrastructure</strong>, and <strong>Cash Infrastructure</strong>.</p>"
                        },
                        {
                            "title": "1. THE BUY-SIDE vs THE SELL-SIDE",
                            "narrative": "<ul><li><strong>The Buy-Side (Capital Allocators):</strong> Asset Managers, Pension Funds, Mutual Funds, and Hedge Funds. The Portfolio Manager (PM) generates investment mandates while Buy-Side Execution Traders utilize Execution Management Systems (EMS) and FIX protocol to route orders.</li><li><strong>The Sell-Side (Intermediaries & Liquidity Providers):</strong> Executing Brokers provide Direct Market Access (DMA) and Smart Order Routing (SOR). Prime Brokers (PBs) provide synthetic leverage, stock borrowing for short sales, and consolidated clearing. Market Makers (MMs) provide continuous two-sided liquidity.</li></ul>"
                        },
                        {
                            "title": "2. TRADING VENUES & DUAL INFRASTRUCTURE (SECURITIES vs CASH)",
                            "narrative": "<ul><li><strong>Lit Exchanges vs Dark Pools:</strong> Lit Venues (NYSE, NASDAQ) broadcast full pre-trade order book transparency. Dark Pools (ATS/MTFs) offer anonymous non-displayed midpoint execution, shielding large institutional block orders (e.g., 500,000 shares) from market price slippage.</li><li><strong>Securities Infrastructure:</strong> Central Counterparties (CCPs) perform Novation and multilateral netting. Central Securities Depositories (CSDs) hold the central legal register of dematerialised shares. Custodians safeguard assets and dispatch SWIFT settlement instructions (<code>MT541</code>/<code>MT543</code>).</li><li><strong>Cash Infrastructure (Clearing Banks):</strong> While custodians hold stock, <strong>Clearing Banks</strong> act as ultimate cash conduits. Holding master accounts at the Central Bank (Fedwire, TARGET2), Clearing Banks execute fiat currency sweeps for CCP margin calls and final DvP settlement.</li></ul>"
                        },
                        {
                            "title": "INTERACTIVE: Cast of Characters Ecosystem & Lit vs Dark Pool Simulator",
                            "narrative": "<p>Explore the 5 pillars of market participants and simulate institutional block order routing across Lit Exchanges vs Dark Pools below.</p>",
                            "widgetType": "tl-cast-characters",
                            "alt": "Interactive Cast of Characters Ecosystem & Lit vs Dark Pool Simulator."
                        }
                    ]
                })

            elif topic_name == "The Front Office (OMS/EMS, FIX Protocol & Algorithmic Execution)":
                topic.lesson_config_json = json.dumps({
                    "type": "narrative",
                    "parts": [
                        {
                            "title": "INTRODUCTION: OMS vs EMS Systems",
                            "narrative": "<p>The Front Office is the trade engine of capital markets. Front-office operations rely on two critical systems:</p><ul><li><strong>Order Management Systems (OMS):</strong> Used by Portfolio Managers (PMs) for portfolio accounting, cash tracking, pre-trade compliance checks, and allocation generation.</li><li><strong>Execution Management Systems (EMS):</strong> Used by Execution Traders for high-speed order routing, direct market access (DMA), real-time market data analysis, and algorithmic order slicing.</li></ul>"
                        },
                        {
                            "title": "1. THE FIX PROTOCOL (Financial Information eXchange)",
                            "narrative": "<p>The <strong>FIX Protocol</strong> is the universal messaging standard of global financial markets. Every institutional order, execution fill, and cancel request is transmitted as SOH-delimited tag-value pairs:</p><ul><li><code>Tag 35 (MsgType):</code> Defines message purpose (e.g., <code>35=D</code> New Order Single, <code>35=8</code> Execution Report, <code>35=G</code> Order Cancel/Replace).</li><li><code>Tag 54 (Side):</code> <code>54=1</code> (Buy), <code>54=2</code> (Sell), <code>54=5</code> (Sell Short).</li><li><code>Tag 38 &amp; Tag 44:</code> Order Quantity (<code>38=50000</code>) and Limit Price (<code>44=200.00</code>).</li><li><code>Tag 39 &amp; Tag 150:</code> Order Status (<code>39=2</code> Filled) and Execution Type (<code>150=2</code> Fill).</li></ul>"
                        },
                        {
                            "title": "2. INSTITUTIONAL EXECUTION ALGORITHMS",
                            "narrative": "<p>Executing a 1,000,000 share block order directly on lit venues would cause severe price slippage. Front-office execution desks utilize <strong>Algorithmic Order Slicing</strong>:</p><ol><li><strong>TWAP (Time-Weighted Average Price):</strong> Slices the block order into equal volume chunks executed at uniform time intervals throughout the day.</li><li><strong>VWAP (Volume-Weighted Average Price):</strong> Slices the order dynamically to match historical intraday U-shaped volume curves (heavy volume at open/close, light at midday).</li><li><strong>Implementation Shortfall (IS / Arrival Price):</strong> High-urgency front-loaded slicing algorithm designed to minimize price opportunity risk against arrival price benchmark.</li></ol>"
                        },
                        {
                            "title": "INTERACTIVE: FIX Protocol Parser & Algorithmic Slicing Simulator",
                            "narrative": "<p>Deconstruct raw FIX protocol messages tag-by-tag and simulate institutional TWAP, VWAP, and IS algorithmic order slicing below.</p>",
                            "widgetType": "tl-fix-parser",
                            "alt": "Interactive FIX Protocol Parser & Algorithmic Slicing Simulator."
                        }
                    ]
                })

            elif topic_name == "The Handshake & The Breakdown (Block Allocation & CTM Affirmation)":
                topic.lesson_config_json = json.dumps({
                    "type": "narrative",
                    "parts": [
                        {
                            "title": "INTRODUCTION: The Role of the Middle Office",
                            "narrative": "<p>Once an institutional block order (e.g., 1,000,000 shares of AAPL) is executed by the Front Office, the trade drops into the <strong>Middle Office</strong> for enrichment, allocation, and counterparty confirmation.</p><p>The Middle Office acts as the central control tower &mdash; ensuring that trade economics match counterparty records, Standing Settlement Instructions (SSIs) are attached, and block executions are legally broken down across underlying sub-fund accounts.</p>"
                        },
                        {
                            "title": "1. BLOCK TRADE ALLOCATION & AVERAGE PRICING",
                            "narrative": "<p>Institutional asset managers execute trades in aggregate blocks to achieve better market pricing. The Middle Office must mathematically slice the 1,000,000 share block across client sub-accounts:</p><ul><li><strong>Average Pricing:</strong> If a block was executed across multiple price fills (e.g. 500k @ $200.10, 500k @ $200.14), the Middle Office calculates the net <strong>Volume-Weighted Average Price (VWAP)</strong> ($200.12) applied uniformly to all allocations.</li><li><strong>SSI Attachment:</strong> Every sub-account allocation requires Standing Settlement Instructions &mdash; specifying Custodian BIC (e.g., <code>BKTRUS33XXX</code>), Depository Account ID, and Place of Settlement (PSET).</li></ul>"
                        },
                        {
                            "title": "2. ELECTRONIC TRADE CONFIRMATION (ETC) & CTM AFFIRMATION",
                            "narrative": "<p>To eliminate post-trade settlement fails, investment managers and executing brokers utilize <strong>DTCC Central Trade Matching (CTM)</strong> for Electronic Trade Confirmation (ETC):</p><ol><li><strong>Trade Matching:</strong> CTM automatically compares 11 core trade fields (ISIN, Side, Quantity, Price, Trade Date, Settlement Date, Currency, SSIs).</li><li><strong>Affirmation Status Transition:</strong> Status begins as <code>UNMATCHED</code>. If a field mismatches (e.g. price $200.12 vs $200.18), CTM triggers an <strong>Exception Break</strong>. Once resolved, CTM updates status to <code>MATCHED / AFFIRMED</code>.</li><li><strong>Automated Clearing Dispatch:</strong> An <strong>AFFIRMED</strong> trade is automatically routed to the Central Counterparty (CCP) for clearing novation and custodian instruction dispatch.</li></ol>"
                        },
                        {
                            "title": "INTERACTIVE: Block Allocation Calculator & DTCC CTM Matching Engine",
                            "narrative": "<p>Calculate sub-account allocations with SSI enrichment and simulate DTCC CTM Electronic Trade Confirmation (ETC) & Affirmation mechanics below.</p>",
                            "widgetType": "tl-block-allocation",
                            "alt": "Interactive Block Allocation Calculator & DTCC CTM Matching Engine."
                        }
                    ]
                })

            elif topic_name == "CCPs, Novation & Multilateral Netting (Clearing & Risk Shielding)":
                topic.lesson_config_json = json.dumps({
                    "type": "narrative",
                    "parts": [
                        {
                            "title": "INTRODUCTION: The Clearing Shield & Counterparty Default Risk",
                            "narrative": "<p>In financial markets, trade execution (T) and final settlement (T+1) are separated in time. During this settlement gap, market prices fluctuate, and counterparties face severe **Principal and Replacement Cost Risks**.</p><p>If a buyer or seller goes bankrupt before settlement, direct bilateral trades collapse. The <strong>Central Counterparty (CCP)</strong> acts as market shield &mdash; absorbing default risks and insulating the global banking system.</p>"
                        },
                        {
                            "title": "1. LEGAL CONTRACT NOVATION & MARGIN WATERFALL",
                            "narrative": "<p>Upon trade affirmation, the CCP performs <strong>Contract Novation</strong> &mdash; legally stepping between counterparties to become <em>Buyer to every Seller, and Seller to every Buyer</em>:</p><ul><li><strong>Initial Margin (IM):</strong> Collateral collected upfront from clearing members based on potential future exposure (PFE) calculated via VaR models.</li><li><strong>Variation Margin (VM):</strong> Cash collected daily (or intraday) from losing positions and transferred to winning positions to reflect Mark-to-Market (MTM) price changes.</li><li><strong>The Default Waterfall:</strong> If a clearing broker defaults, losses are absorbed in strict order: Defaulter Initial Margin &rarr; Defaulter Default Fund Deposit &rarr; CCP Equity Capital &rarr; Mutualized Default Fund Pool.</li></ul>"
                        },
                        {
                            "title": "2. MULTILATERAL NETTING ENGINE",
                            "narrative": "<p>Executing thousands of bilateral gross trades requires trillions of dollars in intraday liquidity. The CCP's core superpower is <strong>Multilateral Netting</strong>:</p><p>Instead of settling 10,000 individual gross trades across hundreds of banks, the CCP calculates a single **Net Cash Position** and single **Net Security Position** for each clearing member &mdash; routinely reducing liquidity requirements and settlement risk by **90% to 98%**.</p>"
                        },
                        {
                            "title": "INTERACTIVE: Legal Novation Default Visualizer & Multilateral Netting Engine",
                            "narrative": "<p>Simulate counterparty bankruptcy under CCP Novation and compress gross trades into net settlement obligations below.</p>",
                            "widgetType": "tl-ccp-novated",
                            "alt": "Interactive Legal Novation Default Visualizer & Multilateral Netting Engine."
                        }
                    ]
                })

            elif topic_name == "The Settlement SWIFT Flow (ISO 15022 / ISO 20022)":
                topic.lesson_config_json = json.dumps({
                    "type": "narrative",
                    "parts": [
                        {
                            "title": "INTRODUCTION: The Custody Messaging Pipeline",
                            "narrative": "<p>Settlement is the physical exchange of securities for cash. Global custodians and Central Securities Depositories (CSDs) communicate settlement instructions via the <strong>SWIFT Financial Messaging Network</strong>.</p><p>Understanding post-trade custody requires mastering ISO 15022 FIN tag standards and their modern ISO 20022 XML equivalents.</p>"
                        },
                        {
                            "title": "1. THE MT54X SETTLEMENT INSTRUCTION MESSAGES",
                            "narrative": "<p>Custodians dispatch four primary settlement instruction types (ISO 15022 <code>MT54x</code> / ISO 20022 <code>sese.023</code>):</p><ul><li><code>MT541 (Receive Against Payment - RVP):</code> Dispatched by the Buyer's Custodian instructing the CSD to receive securities and debit cash.</li><li><code>MT543 (Deliver Against Payment - DVP):</code> Dispatched by the Seller's Custodian instructing the CSD to deliver securities and credit cash.</li><li><code>MT540 &amp; MT542 (Free of Payment - RFOP/DFOP):</code> Instructs security movement without accompanying cash transfer (e.g. portfolio transfers).</li></ul>"
                        },
                        {
                            "title": "2. CSD MATCHING, STATUS ADVICE (`MT548`) & CONFIRMATIONS (`MT545`/`MT547`)",
                            "narrative": "<p>Upon receiving settlement instructions from both custodians, the Central Securities Depository (CSD) performs continuous trade matching:</p><ol><li><strong>Status &amp; Processing Advice (<code>MT548</code> / <code>sese.024</code>):</strong> CSD issues real-time status updates: <code>MATCH</code> (Matched &amp; Alleged), <code>NMAT</code> (Unmatched / Mismatch), or <code>PEND</code> (Pending Settlement).</li><li><strong>Instruction Maintenance (<code>MT530</code>):</strong> Custodians dispatch hold/release commands to amend live settlement instructions.</li><li><strong>Settlement Confirmations (<code>MT545</code> / <code>MT547</code>):</strong> Upon final book-entry DvP settlement, CSD dispatches debit and credit confirmation messages to both custodians.</li></ol>"
                        },
                        {
                            "title": "INTERACTIVE: SWIFT MT54x Tag Parser & Custody Settlement Flow Simulator",
                            "narrative": "<p>Deconstruct raw SWIFT MT541/MT543/MT548 tags and simulate the 5-step custodian-to-CSD settlement sequence below.</p>",
                            "widgetType": "tl-swift-flow",
                            "alt": "Interactive SWIFT MT54x Tag Parser & Custody Settlement Flow Simulator."
                        }
                    ]
                })

            elif topic_name == "Delivery versus Payment (DvP) Models & CSD Settlement Mechanics":
                topic.lesson_config_json = json.dumps({
                    "type": "narrative",
                    "parts": [
                        {
                            "title": "INTRODUCTION: The Golden Rule of Settlement & Herstatt Risk",
                            "narrative": "<p>The fundamental pillar of financial settlement is <strong>Delivery versus Payment (DvP)</strong>: <em>Never hand over legal ownership of securities until final cash payment is received simultaneously.</em></p><p><strong>The Story of Herstatt Risk (1974):</strong> On June 26, 1974, German regulators closed Herstatt Bank at the end of the European business day. German banks had already delivered Deutsche Marks to Herstatt, but Herstatt was shut down <em>before</em> delivering the matching US Dollars in New York (due to time zone lag). Counterparties lost $620 million — giving birth to modern DvP and CLS Bank!</p>"
                        },
                        {
                            "title": "1. THE 3 BIS DVP MODELS (Bank for International Settlements)",
                            "narrative": "<p>The Bank for International Settlements (BIS) categorizes DvP mechanics into 3 structural models:</p><ul><li><strong>Model 1 (Gross-Gross):</strong> Trade-by-trade simultaneous settlement of both securities and cash throughout the operating day.</li><li><strong>Model 2 (Gross-Net):</strong> Securities transfers settle continuously on a gross basis, while cash obligations settle in an end-of-day net batch sweep.</li><li><strong>Model 3 (Net-Net):</strong> End-of-day simultaneous multilateral net batch settlement of both securities and cash obligations.</li></ul>"
                        },
                        {
                            "title": "2. STANDING SETTLEMENT INSTRUCTIONS (SSIs) & DTCC ALERT",
                            "narrative": "<p>Every institutional trade requires Standing Settlement Instructions (SSIs) &mdash; routing data containing Depository Account IDs, Custodian BICs, PSET (Place of Settlement), and cash clearing numbers.</p><p>Incorrect SSIs are the <strong>#1 root cause of settlement fails globally</strong>. Operations desks rely on <strong>DTCC ALERT</strong> &mdash; the world's largest online database for automated SSI maintenance &amp; enrichment.</p>"
                        },
                        {
                            "title": "INTERACTIVE: 3 BIS DvP Model Simulator & DTCC ALERT SSI Engine",
                            "narrative": "<p>Simulate the 3 BIS DvP models and validate Standing Settlement Instructions via the DTCC ALERT engine below.</p>",
                            "widgetType": "tl-dvp-models",
                            "alt": "Interactive 3 BIS DvP Model Simulator & DTCC ALERT SSI Engine."
                        }
                    ]
                })

            elif topic_name == "Settlement Fails, CSDR & Mandatory Buy-In Regimes":
                topic.lesson_config_json = json.dumps({
                    "type": "narrative",
                    "parts": [
                        {
                            "title": "INTRODUCTION: Anatomy of a Settlement Fail",
                            "narrative": "<p>When a trade fails to settle on Settlement Date (SD), securities or cash remain un-delivered. Settlement fails freeze capital, increase operational risk, and carry heavy regulatory penalties.</p><p>The primary causes of settlement fails include <strong>lack of securities inventory</strong> (naked short sales / failed stock borrows), <strong>cash debit failures</strong>, <strong>SSI mismatches</strong>, and <strong>late CTM trade affirmations</strong>.</p>"
                        },
                        {
                            "title": "1. THE CSDR CASH PENALTY REGIME (EU Regulation)",
                            "narrative": "<p>Under the European Union Central Securities Depositories Regulation (CSDR), CSDs automatically assess daily cash penalties against failing counterparties:</p><ul><li><strong>Liquid Equities:</strong> Charged <strong>1.0 basis point (0.01%) per day</strong> of failed trade value.</li><li><strong>Corporate Bonds:</strong> Charged <strong>0.5 basis points (0.005%) per day</strong>.</li><li><strong>Sovereign Debt (Govt Bonds):</strong> Charged <strong>0.1 basis points (0.001%) per day</strong>.</li></ul><p>Penalty fines collected from failing sellers are directly credited to the non-failing buyer to compensate for delayed delivery.</p>"
                        },
                        {
                            "title": "2. MANDATORY BUY-IN WORKFLOW",
                            "narrative": "<p>If a settlement fail persists beyond the extension period (4 business days for liquid equities), the buyer triggers a <strong>Mandatory Buy-In</strong>:</p><ol><li><strong>Buy-In Notice:</strong> Formal notice dispatched via CSD warning the seller of imminent market buy-in.</li><li><strong>Buy-In Agent Execution:</strong> An independent Buy-In Agent executes a market purchase on a lit exchange to secure missing shares.</li><li><strong>Cash Compensation Settlement:</strong> If shares are bought at a higher price (e.g. $205 vs $200), the defaulting seller is legally obligated to pay the <strong>$500,000 price difference</strong>, plus agent execution fees and accrued CSDR cash penalties!</li></ol>"
                        },
                        {
                            "title": "INTERACTIVE: CSDR Cash Penalty Calculator & Mandatory Buy-In Simulator",
                            "narrative": "<p>Calculate daily CSDR cash penalty fines and simulate the 4-day Mandatory Buy-In execution workflow below.</p>",
                            "widgetType": "tl-csdr-penalties",
                            "alt": "Interactive CSDR Cash Penalty Calculator & Mandatory Buy-In Simulator."
                        }
                    ]
                })

            elif topic_name == "T+1, T+0, Atomic Settlement & Advanced Inventory Management (Earmarking, Hold & Release)":
                topic.lesson_config_json = json.dumps({
                    "type": "narrative",
                    "parts": [
                        {
                            "title": "INTRODUCTION: Advanced Inventory Control & Future Settlement",
                            "narrative": "<p>Modern custody operations require precise control over dematerialized securities inventory. Global custodians utilize <strong>Earmarking</strong> and <strong>Hold &amp; Release (<code>MT530</code>)</strong> mechanisms to control instruction queues and prevent inventory breaks.</p><p>Meanwhile, global capital markets are undergoing a fundamental transformation &mdash; migrating from legacy T+2 to <strong>T+1</strong>, and pioneering <strong>T+0 (Atomic Settlement)</strong> on Distributed Ledger Technology (DLT).</p>"
                        },
                        {
                            "title": "1. EARMARKING & HOLD/RELEASE MECHANICS (<code>MT530</code> / <code>sese.030</code>)",
                            "narrative": "<p>Custodians manage securities availability using two operational tools:</p><ul><li><strong>Earmarking (Securities Reservation):</strong> Locking specific share balance quantities in the CSD depository vault to reserve them exclusively for an impending DvP settlement instruction. Earmarked shares cannot be re-hypothecated, lent out, or transferred.</li><li><strong>Hold &amp; Release (<code>MT530</code>):</strong> Putting settlement instructions on <code>HOLD</code> status prevents the CSD from attempting matching or settlement. Dispatched SWIFT <code>MT530</code> <code>RELEASE</code> commands un-freeze the queue for automated execution.</li></ul>"
                        },
                        {
                            "title": "2. THE T+1 COMPRESSED TIMELINE & DLT ATOMIC SETTLEMENT (T+0)",
                            "narrative": "<p>On May 28, 2024, the US, Canada, and Mexico migrated to <strong>T+1 Settlement</strong>, cutting the settlement window from 48 hours to 24 hours:</p><ol><li><strong>Compressed Affirmation Cutoff:</strong> Same-day Electronic Trade Affirmation (CTM) deadline moved to <strong>21:00 EST on Trade Date (T)</strong>.</li><li><strong>The Future (T+0 DLT Atomic Settlement):</strong> Blockchain Smart Contracts collapse Execution, Clearing, and Settlement into a <strong>single sub-second millisecond event</strong> &mdash; eliminating counterparty credit risk and CCP margin requirements entirely.</li></ol>"
                        },
                        {
                            "title": "INTERACTIVE: Earmarking & Hold/Release Control Panel & DLT Atomic Simulator",
                            "narrative": "<p>Reserve vault share inventory via Earmarking, process MT530 Hold/Release commands, and simulate T+0 DLT Atomic Settlement below.</p>",
                            "widgetType": "tl-earmarking-holdrelease",
                            "alt": "Interactive Earmarking & Hold/Release Control Panel & DLT Atomic Simulator."
                        }
                    ]
                })

            elif topic_name == "Securities Lending & Borrowing (SBL), Short Selling & Fail Prevention":
                topic.lesson_config_json = json.dumps({
                    "type": "narrative",
                    "parts": [
                        {
                            "title": "INTRODUCTION: Why Lend & Borrow Securities?",
                            "narrative": "<p>Securities Lending &amp; Borrowing (SBL) is a multi-trillion dollar global market. Beneficial owners (pension funds, sovereign wealth funds) lend idle shares to generate yield, while borrowers (hedge funds, market makers) borrow shares for short selling, arbitrage, or settlement fail prevention.</p>"
                        },
                        {
                            "title": "1. THE SBL LIFECYCLE & COLLATERALIZATION",
                            "narrative": "<p>To borrow securities, the borrower must post <strong>102% to 105% cash or high-quality liquid assets (HQLA) collateral</strong> to protect the lender against default:</p><ul><li><strong>Rebate Rate:</strong> The interest rate paid by the lender to the borrower on cash collateral.</li><li><strong>Borrow Fee (Hard-to-Borrow):</strong> For in-demand shares, borrowers pay a premium fee (e.g. 50 bps to 500+ bps p.a.).</li></ul>"
                        },
                        {
                            "title": "2. AUTOMATED STOCK BORROWING FAIL PREVENTION",
                            "narrative": "<p>Custodians and tri-party agents run automated stock borrowing programs (e.g. Euroclear ASLplus, DTCC Stock Borrow Program). If an inventory shortfall is detected on Settlement Date, auto-borrow algorithms automatically draw shares from lending pools to guarantee 100% DvP settlement success and prevent CSDR fail penalties!</p>"
                        },
                        {
                            "title": "INTERACTIVE: SBL Collateral & Fee Calculator & Auto-Borrow Simulator",
                            "narrative": "<p>Calculate SBL collateralization and borrow fees, and simulate automated stock borrowing fail prevention below.</p>",
                            "widgetType": "tl-sBL-engine",
                            "alt": "Interactive SBL Collateral & Fee Calculator & Auto-Borrow Simulator."
                        }
                    ]
                })

            elif topic_name == "Post-Trade Reconciliation, Nostro/Vostro Ledgers & Regulatory Reporting":
                topic.lesson_config_json = json.dumps({
                    "type": "narrative",
                    "parts": [
                        {
                            "title": "INTRODUCTION: The Post-Settlement Control Tower",
                            "narrative": "<p>Settlement is not the final step. Back office operations teams must ensure accounting integrity across internal ledgers, custodian statements, and regulatory transaction repositories.</p>"
                        },
                        {
                            "title": "1. NOSTRO / VOSTRO CASH & POSITION RECONCILIATION",
                            "narrative": "<p>Reconciliation specialists compare internal accounting books against external bank statements:</p><ul><li><strong>Nostro Account ('Our money/stock at your bank'):</strong> Internal ledger of cash/securities.</li><li><strong>Vostro Account ('Your money/stock at our bank'):</strong> Custodian statement received via SWIFT <code>MT940</code>/<code>MT950</code> (Cash) or <code>MT535</code>/<code>MT536</code> (Holdings).</li><li><strong>Break Resolution:</strong> Identifying timing breaks (e.g. T+1 dividend posting) vs true cash/stock breaks requiring investigation.</li></ul>"
                        },
                        {
                            "title": "2. REGULATORY TRANSACTION REPORTING (EMIR / MiFIR / Dodd-Frank)",
                            "narrative": "<p>Under global post-2008 financial regulations (EMIR, MiFIR, Dodd-Frank, SFTR), all institutional trades must be reported by T+1 to registered Trade Repositories (DTCC GTR, Eurex Trade Repository). Reports include Legal Entity Identifiers (LEI), Unique Trade Identifiers (UTI), Execution Venues (MIC), prices, and quantities.</p>"
                        },
                        {
                            "title": "INTERACTIVE: Nostro/Vostro Recon Matrix & Regulatory Reporting Dispatcher",
                            "narrative": "<p>Perform Nostro/Vostro cash and position reconciliations and dispatch EMIR/MiFIR regulatory transaction reports below.</p>",
                            "widgetType": "tl-nostro-vostro-recon",
                            "alt": "Interactive Nostro/Vostro Recon Matrix & Regulatory Reporting Dispatcher."
                        }
                    ]
                })

        db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    seed_trade_lifecycle()
    print("Trade Lifecycle Chapter 1 updated with standard market terminology!")
