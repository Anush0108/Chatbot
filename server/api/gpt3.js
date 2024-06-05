export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  let messages = await readBody(event);
  let prompt = [{
    role: "system", 
    content: `You are a Virtual Assistant. 
    If the course is not found, please ask them to subscribe to our newsletter.
    Answer all the questions in your capacity.
    `
  }, ...messages]
 


 
  // console.log("Received messages:", messages);

 
  // let conversation = "";
  // for (const message of messages) {
  //   conversation += `${message.role}:${message.content}\n`;
  // }
  
  //   prompt += conversation + "AI:";
  //   console.log(prompt);


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

  console.log("Fetch response:", req);
  const response = await req.json();
   response = completion.data.choices[0].message
  console.log(response);

  // const result = response.choices[0];
  return {
    message: response,
  }

});
