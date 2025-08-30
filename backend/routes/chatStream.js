import express from "express";
import Thread from "../models/Thread.js";

const router = express.Router();

router.post("/chat/stream", async (req, res) => {
    console.log("[SSE] Streaming started");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const { threadId, message } = req.body;
    console.log("[SSE] Incoming body:", req.body);

    if (!threadId || !message) {
        res.write(`event: error\ndata: ${JSON.stringify({ error: "missing required fields" })}\n\n`);
        return res.end();
    }

    let thread = await Thread.findOne({ threadId });
    if (!thread) {
        thread = new Thread({
            threadId,
            title: message,
            messages: [{ role: "user", content: message }],
        });
    } else {
        thread.messages.push({ role: "user", content: message });
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "qwen/qwen3-4b:free",
                messages: [{ role: "user", content: message }],
                stream: false, // 🚨 request only final answer
            }),
        });

        console.log("[SSE] OpenRouter response status:", response.status);

        if (!response.ok) {
            res.write(`event: error\ndata: ${JSON.stringify({ error: "Failed to connect to OpenRouter" })}\n\n`);
            return res.end();
        }

        const data = await response.json();
        console.log("[SSE] Full response:", data);

        const assistantReply = data.choices?.[0]?.message?.content || "No reply";

        // Save to DB
        if (assistantReply.trim()) {
            thread.messages.push({ role: "assistant", content: assistantReply });
            thread.updatedAt = new Date();
            await thread.save();
        }

        // Send the full reply once
        res.write(`data: ${JSON.stringify({ content: assistantReply })}\n\n`);
        res.write(`event: end\ndata: {"done": true}\n\n`);
        res.end();

    } catch (err) {
        console.error("[SSE] Streaming error:", err);
        res.write(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
    }
});

export default router;
