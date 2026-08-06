import json
from db import get_db
from models import Subject, LearningTopic

def seed_trade_lifecycle(db=None):
    close_db = False
    if db is None:
        db_gen = get_db()
        db = next(db_gen)
        close_db = True

    try:
        tl_subject = db.query(Subject).filter_by(name="Trade Lifecycle").first()
        if not tl_subject:
            print("Subject 'Trade Lifecycle' not found. Ensure main seed registers it.")
            return

        topics = [
            "The Interactive Roadmaps (Macro Trade Flow & Dual-Sided Engine)"
        ]

        for topic_name in topics:
            topic = db.query(LearningTopic).filter_by(name=topic_name, subject_id=tl_subject.id).first()
            if not topic:
                topic = LearningTopic(
                    subject_id=tl_subject.id,
                    name=topic_name,
                    order=1
                )
                db.add(topic)
                db.flush()

            if topic_name == "The Interactive Roadmaps (Macro Trade Flow & Dual-Sided Engine)":
                topic.lesson_config_json = json.dumps({
                    "type": "narrative",
                    "parts": [
                        {
                            "title": "INTRODUCTION: The Macro Architecture of a Trade",
                            "narrative": "<p>Before we dive into milliseconds of FIX tags, XML seev schemas, or CSD settlement penalties, we must step back and view the high-level architecture of modern global capital markets.</p><p>A trade is not a single isolated event. It is a multi-tiered journey that moves across three distinct operating environments: the <strong>Front Office</strong> (Idea Generation &amp; Execution), the <strong>Middle Office</strong> (Allocation, Confirmation &amp; Matching), and the <strong>Back Office</strong> (Clearing, SWIFT Settlement &amp; Custody).</p>"
                        },
                        {
                            "title": "1. THE 6-STAGE TRADE LIFECYCLE JOURNEY",
                            "narrative": "<p>Every institutional trade follows a rigid 6-stage operational sequence:</p><ol><li><strong>Stage 1: Order Generation &amp; Decision (Front Office):</strong> The Portfolio Manager (PM) conceives a trade idea. The Order Management System (OMS) validates risk, cash, and compliance rules.</li><li><strong>Stage 2: Execution &amp; Matching Engine (Front Office / Venue):</strong> The Execution Trader routes the order to an exchange (NYSE, NASDAQ) or dark pool via FIX Protocol (<code>35=D</code> New Order Single). The matching engine executes the order and emits a FIX <code>35=8</code> Execution Report.</li><li><strong>Stage 3: Allocation &amp; Central Trade Matching (Middle Office):</strong> A 100,000 share block trade is sliced into 50 underlying client sub-accounts. The middle office submits allocations to DTCC CTM for Electronic Trade Confirmation (ETC) &amp; Affirmation.</li><li><strong>Stage 4: Clearing &amp; CCP Risk Shield (Clearing House):</strong> The Central Counterparty (CCP) steps in via <strong>Novation</strong> &mdash; becoming the Buyer to every Seller and Seller to every Buyer. The CCP calls Initial and Variation Margin via Clearing Banks and performs multilateral netting.</li><li><strong>Stage 5: Custodian SWIFT Settlement Pipeline (Back Office):</strong> The Buyer Custodian dispatches SWIFT <code>MT541</code> (Receive Against Payment - RVP); the Seller Custodian dispatches <code>MT543</code> (Deliver Against Payment - DVP). Standing Settlement Instructions (SSIs) are matched.</li><li><strong>Stage 6: CSD Settlement &amp; Account Posting (Depository):</strong> The CSD (DTCC / Euroclear) locks stock and cash, executes <strong>Delivery vs Payment (DvP)</strong>, and updates legal title on the central register.</li></ol>"
                        },
                        {
                            "title": "2. THE DUAL-SIDED NATURE OF CAPITAL MARKETS",
                            "narrative": "<p>Every buyer has a seller, and every cash flow has a corresponding security movement. In institutional operations, the Buyer and Seller operate as symmetrical mirrors.</p><p>Both sides run parallel OMS systems, middle-office trade matching engines, clearing member bank margin accounts, and custodian SWIFT pipelines &mdash; until both parallel paths converge at the <strong>Central Counterparty (CCP)</strong> for Novation and the <strong>Central Securities Depository (CSD)</strong> for DvP finality.</p>"
                        },
                        {
                            "title": "INTERACTIVE: Trade Lifecycle Macro Roadmap & Dual-Sided Engine",
                            "narrative": "<p>Explore the interactive 6-stage macro trade flow and run the symmetrical dual-sided trade engine simulation below.</p>",
                            "widgetType": "tl-macro-roadmap",
                            "alt": "Interactive Trade Lifecycle Macro Roadmap & Dual-Sided Engine Simulator."
                        }
                    ]
                })

        db.commit()
    finally:
        if close_db:
            db.close()

if __name__ == "__main__":
    seed_trade_lifecycle()
    print("Trade Lifecycle Chapter 1 seeded successfully!")
