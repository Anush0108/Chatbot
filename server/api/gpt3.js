export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  let messages;

  try {
    messages = await readBody(event);
    if (!Array.isArray(messages)) {
      throw new Error("Messages body is not an array");
    }
  } catch (error) {
    console.error("Error reading body:", error);
    return {
      statusCode: 400,
      message: "Invalid request body. Please provide an array of messages.",
    };
  }

  let prompt = [{
    role: "system",
    content: `You are a Virtual Assistant. 
    If the course is not found, please ask them to subscribe to our newsletter.
    Answer all the questions in your capacity.`
  }, ...messages];

  try {
    const req = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: prompt,
        max_tokens: 560,
        n: 1,
        stop: null,
        temperature: 0.7,
      }),
    });

    if (!req.ok) {
      const errorResponse = await req.json();
      console.error("OpenAI API response error:", errorResponse);
      throw new Error(`OpenAI API request failed. (Status: ${req.status}, Message: ${req.statusText})`);
    }

    const response = await req.json();

    if (!response.choices || !response.choices.length) {
      throw new Error("No valid response received from OpenAI API.");
    }

    const message = response.choices[0].message;

    return {
      message,
    };
  } catch (error) {
    console.error("Error fetching from OpenAI API:", error);

    let errorMessage = "An unexpected error occurred. Please try again later.";
    if (error.message.includes("OpenAI API request failed")) {
      errorMessage = error.message;
    } else if (error.message.includes("No valid response received from OpenAI API")) {
      errorMessage = error.message;
    }

    return {
      statusCode: 500,
      message: {
        role: "assistant",
        content: errorMessage,
      },
    };
  }
});