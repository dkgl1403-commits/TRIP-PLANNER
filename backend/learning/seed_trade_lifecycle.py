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
            "The Evolution of the Exchange & CLOB (Matching Engines & Order Books)"
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

        db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    seed_trade_lifecycle()
    print("Trade Lifecycle Chapter 1 updated with standard market terminology!")
