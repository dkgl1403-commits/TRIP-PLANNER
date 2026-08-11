import asyncio
import edge_tts

async def main():
    text = "नमस्ते, यह सर्वर-साइड न्यूरल वॉइस टेस्ट है। क्या आपको यह स्पष्ट सुनाई दे रहा है?"
    # hi-IN-MadhurNeural (Male) or hi-IN-SwaraNeural (Female)
    communicate = edge_tts.Communicate(text, "hi-IN-MadhurNeural")
    await communicate.save("scratch/test_neural_hindi.mp3")
    print("Successfully generated Microsoft Neural Hindi audio!")

if __name__ == "__main__":
    asyncio.run(main())
