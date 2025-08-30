import "dotenv/config";
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);
const getOpenAIAPIResponse = async(message) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "qwen/qwen3-4b:free",
            messages: [{
                role: "user",
                content: message
            }]
        })
    };

    try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", options);
        const data = await response.json();

        // Add a check for successful response from OpenAI before accessing choices
        if (!response.ok) { // Check if the HTTP status code indicates an error (e.g., 400, 500)
            console.error('OpenAI API Error Response:', data); // Log the error details from OpenAI
            throw new Error(`OpenAI API returned an error: ${data.error ? data.error.message : response.statusText}`);
        }

        // Robustly check if choices and content exist
        if (data && data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
            return data.choices[0].message.content; // This is the line that was throwing the error
        } else {
            console.error("OpenAI response did not contain expected content structure:", data);
            throw new Error("Invalid or incomplete OpenAI API response.");
        }
    } catch(err) {
        console.error("Error in getOpenAIAPIResponse:", err); // Use console.error for errors
        throw err; // Re-throw the error so chat.js can catch it
    }
}

export default getOpenAIAPIResponse;
