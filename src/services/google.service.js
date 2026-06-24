const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

/**
 * Generates a roast-based title and caption from a base64 encoded image or video.
 * @param {string} base64Data - Base64 data string of the media.
 * @param {string} mimeType - The media's mime type (e.g., 'image/jpeg', 'video/mp4').
 * @returns {Promise<{title: string, caption: string}>}
 */
async function generatecaption_title(base64Data, mimeType) {
    const modelsToTry = [
        "gemini-3.5-flash",
        "gemini-3.1-flash-lite",
        "gemini-2.5-flash",
        "gemini-2.5-flash-lite",
        "gemini-2.0-flash"
    ];
    let lastError = null;

    for (const model of modelsToTry) {
        try {
            console.log(`Attempting content generation using model: ${model}`);
            const response = await ai.models.generateContent({
                model: model,
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: "Look at this media and generate a hilarious, witty, and savage roast-based title and caption for it. Respond with a JSON object containing a 'title' field and a 'caption' field."
                            },
                            {
                                inlineData: {
                                    mimeType: mimeType,
                                    data: base64Data
                                }
                            }
                        ]
                    }
                ],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            title: { type: "STRING" },
                            caption: { type: "STRING" }
                        },
                        required: ["title", "caption"]
                    }
                }
            });

            if (response.text) {
                let cleanedText = response.text.trim();
                // Remove markdown code block formatting if present
                if (cleanedText.startsWith("```")) {
                    const lines = cleanedText.split("\n");
                    // Remove the starting line like ```json
                    lines.shift();
                    // Remove the ending line like ```
                    if (lines[lines.length - 1].trim() === "```") {
                        lines.pop();
                    }
                    cleanedText = lines.join("\n").trim();
                }
                return JSON.parse(cleanedText);
            }
        } catch (error) {
            console.warn(`Model ${model} failed:`, error.message || error);
            lastError = error;
        }
    }

    throw lastError || new Error("All fallback models failed to generate content.");
}

module.exports = { generatecaption_title };