

export default defineEventHandler(async(event)=>{
    const config = useRuntimeConfig();
    
    let prompt =
    'The following is a conversation with an AI assistant';

    let messages = [
        {
            actor:"Human",
            message:"How are you",
        },
        {
            actor:"AI",
           message:"Hi,How can I help you today?"

        },

    ];


    const prevMessages = await readBody(event);
    console.log("Received messages:", messages);
    messages = messages.concat(prevMessages);
    prompt += 
    messages
    .map((message)=>`${message.actor}:${message.message}`)
    .join("\n") + "\nAI:";
    
    const req = await fetch("https://api.openai.com/v1/completions",{
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            Authorization: `Bearer ${config.OPENAI_API_KEY}`,

        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo-instruct",
            prompt: prompt,
            temperature: 0.7,
            max_tokens: 256,
            top_p: 1.0,
            frequency_penalty:0.6,
            stop:["Human:","AI:"],
        }
        ),
    });
    console.log("Fetch response:", req);
    const res = await req.json();
    console.log(res);
    
    const result = res.choices[0];
    return{
        message: result.text,
        finish_reason: result.finish_reason,
    };
});