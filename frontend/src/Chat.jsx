import "./Chat.css";
import React, { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const { newChat, prevChats, reply, isStreaming } = useContext(MyContext);
    const chatEndRef = useRef(null);
    const [copiedMessageId, setCopiedMessageId] = useState(null);

    // Auto scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [prevChats, reply]);

    const copyToClipboard = async (text, messageId) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedMessageId(messageId);
            setTimeout(() => setCopiedMessageId(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Helper: get all messages except the last assistant reply (if streaming)
    let displayedChats = prevChats;
    if (isStreaming && prevChats.length > 0 && prevChats[prevChats.length - 1].role === "assistant") {
        displayedChats = prevChats.slice(0, -1);
    }

    return (
        <div className="chat-container">
            {newChat && (
                <div className="welcome-section">
                    <div className="welcome-content">
                        <div className="welcome-icon">
                            <i className="fas fa-brain"></i>
                        </div>
                        <h1 className="welcome-title gradient-text">
                            Welcome to NeuralChat Pro
                        </h1>
                        <p className="welcome-subtitle">
                            Your advanced AI assistant is ready to help. Ask me anything!
                        </p>
                        <div className="suggestion-cards">
                            <div className="suggestion-card premium-card">
                                <i className="fas fa-lightbulb suggestion-icon"></i>
                                <h3>Creative Writing</h3>
                                <p>Generate stories, poems, and creative content</p>
                            </div>
                            <div className="suggestion-card premium-card">
                                <i className="fas fa-code suggestion-icon"></i>
                                <h3>Code Assistant</h3>
                                <p>Debug, explain, and write code in any language</p>
                            </div>
                            <div className="suggestion-card premium-card">
                                <i className="fas fa-chart-line suggestion-icon"></i>
                                <h3>Data Analysis</h3>
                                <p>Analyze data and create insights</p>
                            </div>
                            <div className="suggestion-card premium-card">
                                <i className="fas fa-graduation-cap suggestion-icon"></i>
                                <h3>Learning</h3>
                                <p>Explain complex topics and concepts</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="messages-container">
                {displayedChats.map((chat, idx) => (
                    <div
                        key={idx}
                        className={`message-wrapper ${chat.role === "user" ? "user-message" : "assistant-message"}`}
                    >
                        <div className="message-avatar">
                            {chat.role === "user" ? (
                                <div className="user-avatar">
                                    <i className="fas fa-user"></i>
                                </div>
                            ) : (
                                <div className="ai-avatar">
                                    <i className="fas fa-brain"></i>
                                </div>
                            )}
                        </div>

                        <div className="message-content">
                            <div className="message-header">
                                <span className="message-sender">
                                    {chat.role === "user" ? "You" : "NeuralChat Pro"}
                                </span>
                                <span className="message-time">
                                    {formatTimestamp(chat.timestamp || Date.now())}
                                </span>
                            </div>

                            <div className="message-body">
                                {chat.role === "user" ? (
                                    <p className="user-text">{chat.content}</p>
                                ) : (
                                    <div className="ai-response">
                                        <ReactMarkdown
                                            rehypePlugins={[rehypeHighlight]}
                                            components={{
                                                code({ inline, className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || '');
                                                    return !inline && match ? (
                                                        <div className="code-block-wrapper">
                                                            <div className="code-block-header">
                                                                <span className="code-language">{match[1]}</span>
                                                                <button
                                                                    className="copy-code-btn"
                                                                    onClick={() => copyToClipboard(String(children).replace(/\n$/, ''), `code-${idx}`)}
                                                                >
                                                                    <i className={`fas ${copiedMessageId === `code-${idx}` ? 'fa-check' : 'fa-copy'}`}></i>
                                                                </button>
                                                            </div>
                                                            <code className={className} {...props}>
                                                                {children}
                                                            </code>
                                                        </div>
                                                    ) : (
                                                        <code className={`inline-code ${className}`} {...props}>
                                                            {children}
                                                        </code>
                                                    );
                                                }
                                            }}
                                        >
                                            {chat.content}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>

                            <div className="message-actions">
                                <button
                                    className="action-btn"
                                    onClick={() => copyToClipboard(chat.content, `msg-${idx}`)}
                                    title="Copy message"
                                >
                                    <i className={`fas ${copiedMessageId === `msg-${idx}` ? 'fa-check' : 'fa-copy'}`}></i>
                                </button>
                                {chat.role === "assistant" && (
                                    <>
                                        <button className="action-btn" title="Regenerate response">
                                            <i className="fas fa-redo"></i>
                                        </button>
                                        <button className="action-btn" title="Rate response">
                                            <i className="fas fa-thumbs-up"></i>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Live streaming assistant reply */}
                {isStreaming && reply && (
                    <div className="message-wrapper assistant-message">
                        <div className="message-avatar">
                            <div className="ai-avatar">
                                <i className="fas fa-brain"></i>
                            </div>
                        </div>

                        <div className="message-content">
                            <div className="message-header">
                                <span className="message-sender">NeuralChat Pro</span>
                                <span className="message-time">
                                    {formatTimestamp(Date.now())}
                                </span>
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>

                            <div className="message-body">
                                <div className="ai-response">
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                        {reply}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div ref={chatEndRef} />
        </div>
    );
}

export default Chat;