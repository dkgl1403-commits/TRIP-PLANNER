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
            "The Handshake & The Breakdown (Block Allocation & CTM Affirmation)"
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

        db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    seed_trade_lifecycle()
    print("Trade Lifecycle Chapter 1 updated with standard market terminology!")
