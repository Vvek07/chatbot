import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import {ScaleLoader} from "react-spinners";

function ChatWindow() {
    const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat, setShowSettings} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const eventSourceRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [isVoiceRecording, setIsVoiceRecording] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);

    // Streaming chat reply using SSE
    const getReply = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setIsStreaming(true);
        setNewChat(false);
        setReply("");

        // Use fetch to initiate SSE (polyfill for POST)
        const controller = new AbortController();
        eventSourceRef.current = controller;

        try {
            const response = await fetch("http://localhost:8080/api/chat/stream", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: prompt,
                    threadId: currThreadId
                }),
                signal: controller.signal
            });

            if (!response.body) throw new Error("No response body");
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            // let fullReply = ""; // Removed unused variable
            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                if (value) {
                    const chunk = decoder.decode(value);
        // Parse SSE data lines
        chunk.split("\n").forEach(line => {
            if (line.startsWith("data: ")) {
                try {
                    const data = JSON.parse(line.replace("data: ", ""));
                    if (data.content !== undefined) {
                        setReply(prev => prev + data.content);
                    }
                } catch (err) {
                    console.error("Error parsing SSE chunk:", err);
                }
            }
        });
                }
            }
        } catch (err) {
            if (err.name !== "AbortError") {
                setReply("I'm sorry, but I'm currently unavailable. Please try again later or upgrade to Pro for priority access.");
            }
        }
        setLoading(false);
        setIsStreaming(false);
        eventSourceRef.current = null;
    };

    // Stop streaming
    const stopStreaming = () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.abort();
            setIsStreaming(false);
            setLoading(false);
        }
    };

    // Append new chat to prevChats only after streaming ends
    const wasStreaming = useRef(false);
    useEffect(() => {
        // When streaming ends and reply is not empty, append to prevChats
        if (wasStreaming.current && !isStreaming && reply) {
            setPrevChats(prevChats => ([
                ...prevChats,
                {
                    role: "user",
                    content: prompt
                },
                {
                    role: "assistant",
                    content: reply
                }
            ]));
            setPrompt("");
            setWordCount(0);
        }
        wasStreaming.current = isStreaming;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isStreaming]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setPrompt(value);
        setWordCount(value.trim().split(/\s+/).filter(word => word.length > 0).length);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            getReply();
        }
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    const handleVoiceRecord = () => {
        setIsVoiceRecording(!isVoiceRecording);
        // Voice recording functionality would be implemented here
        setTimeout(() => setIsVoiceRecording(false), 3000); // Demo timeout
    }

    // File upload handler
    const handleFileUpload = async (e) => {
        setUploadError("");
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("http://localhost:8080/api/upload/file", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setUploadedFile({ name: file.name, url: data.url });
            } else {
                setUploadError(data.error || "Upload failed");
            }
        } catch (err) {
            console.error("File upload error:", err);
            setUploadError("Upload failed");
        }
        setUploading(false);
    };

    const handleExport = () => {
        // Export functionality - premium feature
        setShowUpgradeModal(true);
    }

    // Drag & drop support
    const handleDrop = async (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            const fakeEvent = { target: { files: [file] } };
            await handleFileUpload(fakeEvent);
        }
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="chat-window" onDrop={handleDrop} onDragOver={handleDragOver}>
            {/* Header */}
            <header className="chat-header">
                <div className="header-left">
                    <div className="model-selector">
                        <div className="model-info">
                            <span className="model-name gradient-text">NeuralChat Pro</span>
                            <span className="model-status">
                                <i className="fas fa-circle status-indicator"></i>
                                Free Tier
                            </span>
                        </div>
                        <button className="model-dropdown-btn" onClick={toggleDropdown}>
                            <i className="fas fa-chevron-down"></i>
                        </button>
                    </div>
                </div>

                <div className="header-right">
                    <div className="header-actions">
                        <button className="action-btn" onClick={handleExport} title="Export Chat">
                            <i className="fas fa-download"></i>
                        </button>
                        <button className="action-btn" onClick={() => setShowSettings(true)} title="Settings">
                            <i className="fas fa-cog"></i>
                        </button>
                        <div className="user-menu">
                            <button className="user-avatar-btn" onClick={toggleDropdown}>
                                <div className="user-avatar">
                                    <i className="fas fa-user"></i>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        <div className="dropdown-section">
                            <h4>AI Models</h4>
                            <div className="model-option active">
                                <i className="fas fa-brain"></i>
                                <div>
                                    <span>NeuralChat Basic</span>
                                    <small>Free tier model</small>
                                </div>
                                <i className="fas fa-check"></i>
                            </div>
                            <div className="model-option disabled" onClick={() => setShowUpgradeModal(true)}>
                                <i className="fas fa-crown"></i>
                                <div>
                                    <span>NeuralChat Pro</span>
                                    <small>Advanced AI model</small>
                                </div>
                                <i className="fas fa-lock"></i>
                            </div>
                        </div>
                        <div className="dropdown-divider"></div>
                        <div className="dropdown-section">
                            <button className="dropdown-item" onClick={() => setShowUpgradeModal(true)}>
                                <i className="fas fa-crown"></i>
                                <span>Upgrade to Pro</span>
                            </button>
                            <button className="dropdown-item" onClick={() => setShowSettings(true)}>
                                <i className="fas fa-cog"></i>
                                <span>Settings</span>
                            </button>
                            <button className="dropdown-item">
                                <i className="fas fa-sign-out-alt"></i>
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Chat Content */}
            <div className="chat-content">
                <Chat />
                
                {/* Loading Indicator */}
                {loading && (
                    <div className="loading-container">
                        <div className="loading-indicator">
                            <ScaleLoader color="#667eea" loading={loading} size={35} />
                            <span className="loading-text">NeuralChat is thinking...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Section */}
            <div className="chat-input-section">
                <div className={`chat-input-container ${inputFocused ? 'focused' : ''}`}>
                    <div className="input-actions-left">
                        <label className="input-action-btn" title="Upload file (jpg, pdf, docx, ppt, audio)">
                            <i className="fas fa-paperclip"></i>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.pdf,.doc,.docx,.ppt,.pptx,.mp3,.wav,.mpeg,audio/*"
                                style={{ display: "none" }}
                                onChange={handleFileUpload}
                                disabled={uploading}
                            />
                        </label>
                        {uploading && <span className="upload-status">Uploading...</span>}
                        {uploadError && <span className="upload-error">{uploadError}</span>}
                        {uploadedFile && (
                            <a href={uploadedFile.url} target="_blank" rel="noopener noreferrer" className="uploaded-file-link">
                                {uploadedFile.name}
                            </a>
                        )}
                    </div>

                    <div className="input-wrapper">
                        <textarea
                            className="chat-input"
                            placeholder="Ask NeuralChat anything..."
                            value={prompt}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setInputFocused(true)}
                            onBlur={() => setInputFocused(false)}
                            rows={1}
                            style={{
                                height: 'auto',
                                minHeight: '44px',
                                maxHeight: '200px',
                                resize: 'none'
                            }}
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                        />
                        
                        {wordCount > 0 && (
                            <div className="word-counter">
                                {wordCount} words
                            </div>
                        )}
                    </div>

                    <div className="input-actions-right">
                        <button 
                            className={`input-action-btn voice-btn ${isVoiceRecording ? 'recording' : ''}`}
                            onClick={handleVoiceRecord}
                            title="Voice input (Pro feature)"
                        >
                            <i className={`fas ${isVoiceRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
                        </button>
                        
                        {isStreaming ? (
                            <button 
                                className="send-btn stop-btn active"
                                onClick={stopStreaming}
                                disabled={!isStreaming}
                                title="Stop generating"
                            >
                                <i className="fas fa-stop"></i>
                            </button>
                        ) : (
                            <button 
                                className={`send-btn ${prompt.trim() ? 'active' : ''}`}
                                onClick={getReply}
                                disabled={!prompt.trim() || loading}
                            >
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        )}
                    </div>
                </div>

                <div className="input-footer">
                    <p className="disclaimer">
                        NeuralChat can make mistakes. Verify important information. 
                        <a href="#" onClick={() => setShowUpgradeModal(true)}>Upgrade to Pro</a> for enhanced accuracy.
                    </p>
                </div>
            </div>

            {/* Upgrade Modal */}
            {showUpgradeModal && (
                <div className="modal-overlay" onClick={() => setShowUpgradeModal(false)}>
                    <div className="upgrade-modal premium-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="gradient-text">Unlock Premium Features</h2>
                            <button className="close-btn" onClick={() => setShowUpgradeModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-content">
                            <div className="feature-showcase">
                                <div className="feature-item">
                                    <i className="fas fa-brain feature-icon"></i>
                                    <div>
                                        <h4>Advanced AI Models</h4>
                                        <p>Access to GPT-4 and other premium models</p>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <i className="fas fa-file-upload feature-icon"></i>
                                    <div>
                                        <h4>File Analysis</h4>
                                        <p>Upload and analyze documents, images, and more</p>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <i className="fas fa-microphone feature-icon"></i>
                                    <div>
                                        <h4>Voice Interaction</h4>
                                        <p>Voice input and AI-generated speech output</p>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <i className="fas fa-infinity feature-icon"></i>
                                    <div>
                                        <h4>Unlimited Usage</h4>
                                        <p>No daily limits or restrictions</p>
                                    </div>
                                </div>
                            </div>
                            <button className="btn-primary upgrade-cta">
                                <i className="fas fa-crown"></i>
                                Upgrade to Pro - $19/month
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChatWindow;
