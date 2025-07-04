import axios from "axios";

export async function POST(req) {
  try {
    const requestData = await req.json();
    console.log("Received data:", requestData);

    // extract and convert task text to string
    const taskData = requestData.task || requestData;
    const taskText = String(
      taskData.title || taskData.description || taskData || ""
    ).trim();

    if (!taskText) {
      return Response.json(
        { error: "Task content is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing");
      return Response.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const prompt = `Break the following task into 3-5 smaller, clear, actionable subtasks:\n\n"${taskText}"`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("Gemini response text:", text);

    const subtasks = text
      .split("\n")
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter(
        (line) => line.length > 0 && !line.toLowerCase().includes("note:")
      );

    return Response.json({ subtasks });
  } catch (error) {
    console.error("API Error:", error);

    return Response.json(
      {
        error: "Error suggesting subtasks",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
