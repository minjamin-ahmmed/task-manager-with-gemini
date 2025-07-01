import axios from "axios";

export async function POST(req) {
  try {
    const { task } = await req.json();
    console.log("Task received in API:", task);
    console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);

    const prompt = `Break the following task into 3-5 smaller, clear, actionable subtasks:\n\n"${task}"`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini";

    const subtasks = text
      .split(/\n|\d+\.\s/)
      .map((subtask) => subtask.trim())
      .filter(Boolean);

    return Response.json({ subtasks });
  } catch (error) {
    console.log("🚨 Error in API:", error);

    console.error(
      "Error suggesting subtasks:",
      error.response?.data || error.message
    );
    return Response.json(
      { error: "Error suggesting subtasks" },
      { status: 500 }
    );
  }
}
