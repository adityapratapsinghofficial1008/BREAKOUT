import dotenv from "dotenv";
dotenv.config();

// Helper to fetch YouTube video title
export async function getYoutubeTitle(videoId) {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
    );
    if (res.ok) {
      const data = await res.json();
      return data.title || "Custom Video Course";
    }
  } catch (e) {
    console.error("Failed to fetch YT metadata via oembed:", e);
  }
  return "Custom Video Course";
}

// Call Mistral API
async function callMistral(prompt) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey || apiKey.includes("your_mistral_api_key")) {
    throw new Error("Mistral API key is not configured.");
  }

  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "mistral-small-2603",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mistral API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Call Groq API (Fallback)
async function callGroq(prompt) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.includes("your_groq_api_key")) {
    throw new Error("Groq API key is not configured.");
  }

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Unified call that implements the fallback mechanism
async function askAI(prompt) {
  try {
    console.log("Attempting request using primary provider (Mistral)...");
    return await callMistral(prompt);
  } catch (mistralError) {
    console.warn(
      "Primary provider (Mistral) failed. Error:",
      mistralError.message,
    );
    console.log("Attempting fallback provider (Groq)...");
    try {
      return await callGroq(prompt);
    } catch (groqError) {
      console.error(
        "Fallback provider (Groq) also failed. Error:",
        groqError.message,
      );
      throw new Error("Both Mistral and Groq API calls failed.");
    }
  }
}

// Robustly extract a JSON array or object from a raw AI response string
function extractJson(rawText) {
  // Strip markdown code fences if present
  let cleaned = rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // Try direct parse first
  try {
    return JSON.parse(cleaned);
  } catch (_) {}

  // Find the first '[' or '{' and the last ']' or '}'
  const arrayMatch = cleaned.match(/(\[[\s\S]*\])/);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[1]);
    } catch (_) {}
  }

  const objMatch = cleaned.match(/(\{[\s\S]*\})/);
  if (objMatch) {
    try {
      return JSON.parse(objMatch[1]);
    } catch (_) {}
  }

  throw new Error("Could not parse valid JSON from AI response.");
}

// Generate topics for a video
export async function generateCourseTopics(videoId, title) {
  const prompt = `You are a curriculum design AI. Generate a structured list of exactly 4 learning checkpoints/topics for a video tutorial titled "${title}" (YouTube ID: ${videoId}).

For each checkpoint, provide:
1. topicName: Short, clear name (e.g., "Variables & Functions" or "Rotations in AVL Tree")
2. description: A one-to-two sentence summary of what is covered at this point in the video.
3. textQuestionText: A conceptual question to verify factual understanding of this topic.
4. feynmanQuestionText: A prompt for the Feynman technique (e.g. "Explain in your own words how...")

Your response MUST be a valid JSON array. Do NOT wrap it in an object. Do NOT include markdown code fences or any text other than the JSON array itself.

Example format (do NOT copy this verbatim, generate content relevant to "${title}"):
[
  {
    "topicName": "Introduction & Setup",
    "description": "Overview of the core concepts and environment setup required.",
    "textQuestionText": "What is the primary purpose of this topic?",
    "feynmanQuestionText": "Explain in your own words why this setup step is necessary."
  }
]`;

  try {
    const resultText = await askAI(prompt);
    const parsed = extractJson(resultText);
    // parsed could be an array directly, or an object with a topics key
    const topics = Array.isArray(parsed)
      ? parsed
      : parsed.topics || parsed.checkpoints || Object.values(parsed)[0];
    if (!Array.isArray(topics) || topics.length === 0) {
      throw new Error("AI returned empty or non-array topics.");
    }
    console.log(
      `Successfully generated ${topics.length} topics for "${title}"`,
    );
    return topics;
  } catch (err) {
    console.warn(
      "AI generation failed, using fallback static syllabus:",
      err.message,
    );
    return [
      {
        topicName: "Core Concepts & Introduction",
        description:
          "Introduction to fundamental ideas and context presented in the video.",
        textQuestionText:
          "What is the primary objective of this module and what problem does it solve?",
        feynmanQuestionText:
          "Explain the main problem solved by this concept in your own words, as if teaching a classmate.",
      },
      {
        topicName: "Implementation Strategy",
        description:
          "How to structure and begin implementing this solution in practice.",
        textQuestionText:
          "What is the key component or algorithm required for this implementation?",
        feynmanQuestionText:
          "Describe the step-by-step implementation process to a peer who has never seen this before.",
      },
      {
        topicName: "Advanced Patterns & Edge Cases",
        description:
          "Deeper exploration of patterns, edge cases and advanced techniques introduced.",
        textQuestionText:
          "What is a common edge case or pitfall when working with this concept?",
        feynmanQuestionText:
          "How would you handle an unexpected edge case in this implementation? Walk through your reasoning.",
      },
      {
        topicName: "Optimization & Verification",
        description:
          "Testing the implementation, analyzing efficiency, and reviewing correctness.",
        textQuestionText:
          "How do you evaluate whether the implementation is optimized and correct?",
        feynmanQuestionText:
          "How would you explain the trade-offs of this approach to a junior engineer?",
      },
    ];
  }
}

// Grade student answer
export async function evaluateStudentAnswer(
  questionText,
  studentAnswer,
  questionType,
) {
  const prompt = `You are a grading assistant for an online learning platform. Evaluate the student's answer below.

Question: "${questionText}"
Student's Answer: "${studentAnswer}"
Question Type: ${questionType} (either "text" for factual answers, or "feynman" for intuitive explanations)

Grading Criteria:
- For "text" questions: Check factual accuracy and completeness.
- For "feynman" questions: Check whether the explanation is clear, intuitive, and shows genuine understanding. Creativity and good analogies should be rewarded.
- Award a score of >= 50 only if the answer genuinely demonstrates understanding.
- Be encouraging but strict enough to verify they actually understand the concept.
- Deduct significantly for very short or nonsensical answers.

Respond ONLY with a JSON object (no markdown, no extra text):
{
  "score": <number 0-100>,
  "feedback": "<concise, encouraging feedback explaining the score>"
}`;

  try {
    const resultText = await askAI(prompt);
    const parsed = extractJson(resultText);
    if (
      typeof parsed.score !== "number" ||
      typeof parsed.feedback !== "string"
    ) {
      throw new Error("Invalid grading response structure from AI.");
    }
    // Clamp score to 0-100
    parsed.score = Math.max(0, Math.min(100, Math.round(parsed.score)));
    return parsed;
  } catch (err) {
    console.warn(
      "AI grading failed, using heuristic fallback grading:",
      err.message,
    );
    const length = studentAnswer.trim().length;
    if (length < 10) {
      return {
        score: 20,
        feedback:
          "Your answer is too short. Please provide a more detailed response that demonstrates your understanding.",
      };
    }
    if (length < 40) {
      return {
        score: 55,
        feedback:
          "Good start! Your answer shows some understanding, but could benefit from more detail and explanation.",
      };
    }
    return {
      score: 78,
      feedback:
        "Good effort! Your explanation has been recorded. For a higher score, try to add more specific details and examples.",
    };
  }
}
