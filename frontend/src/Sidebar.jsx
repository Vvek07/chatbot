import "./Sidebar.css";
import { useContext, useEffect, useState, memo } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";

const Sidebar = memo(function Sidebar() {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread");
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            setAllThreads(filteredData);
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId])

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch(err) {
            console.log(err);
        }
    }   

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {method: "DELETE"});
            const res = await response.json();
            console.log(res);

            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }

        } catch(err) {
            console.log(err);
        }
    }

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    }

    const handleUpgradeClick = () => {
        setShowUpgradeModal(true);
    }

    return (
        <>
            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="brand-section">
                        <div className="logo-container">
                            <div className="logo-icon">
                                <i className="fas fa-brain"></i>
                            </div>
                            {!isCollapsed && (
                                <div className="brand-text">
                                    <h1 className="brand-name gradient-text">NeuralChat</h1>
                                    <span className="brand-subtitle">Pro</span>
                                </div>
                            )}
                        </div>
                        <button className="collapse-btn" onClick={toggleSidebar}>
                            <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
                        </button>
                    </div>

                    <button className="new-chat-btn btn-primary" onClick={createNewChat}>
                        <i className="fas fa-plus"></i>
                        {!isCollapsed && <span>New Chat</span>}
                    </button>
                </div>

                <div className="sidebar-content">
                    <div className="chat-history">
                        {!isCollapsed && <h3 className="section-title">Recent Chats</h3>}
                        <ul className="history-list">
                            {allThreads?.map((thread) => (
                                <li 
                                    key={thread.threadId} 
                                    className={`history-item ${thread.threadId === currThreadId ? 'active' : ''}`}
                                    onClick={() => changeThread(thread.threadId)}
                                    title={isCollapsed ? thread.title : ''}
                                >
                                    <div className="history-content">
                                        <i className="fas fa-message history-icon"></i>
                                        {!isCollapsed && (
                                            <span className="history-title">{thread.title}</span>
                                        )}
                                    </div>
                                    {!isCollapsed && (
                                        <button 
                                            className="delete-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteThread(thread.threadId);
                                            }}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="sidebar-footer">
                    <div className="premium-section">
                        <button className="upgrade-btn" onClick={handleUpgradeClick}>
                            <div className="upgrade-icon">
                                <i className="fas fa-crown"></i>
                            </div>
                            {!isCollapsed && (
                                <div className="upgrade-content">
                                    <span className="upgrade-title">Upgrade to Pro</span>
                                    <span className="upgrade-subtitle">Unlock premium features</span>
                                </div>
                            )}
                        </button>
                    </div>

                    <div className="user-section">
                        <div className="user-avatar">
                            <i className="fas fa-user"></i>
                        </div>
                        {!isCollapsed && (
                            <div className="user-info">
                                <span className="user-name">Free User</span>
                                <span className="user-plan">Basic Plan</span>
                            </div>
                        )}
                    </div>

                    {!isCollapsed && (
                        <div className="footer-links">
                            <a href="#" className="footer-link">
                                <i className="fas fa-cog"></i>
                                <span>Settings</span>
                            </a>
                            <a href="#" className="footer-link">
                                <i className="fas fa-question-circle"></i>
                                <span>Help</span>
                            </a>
                        </div>
                    )}
                </div>
            </aside>

            {/* Upgrade Modal */}
            {showUpgradeModal && (
                <div className="modal-overlay" onClick={() => setShowUpgradeModal(false)}>
                    <div className="upgrade-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="gradient-text">Upgrade to NeuralChat Pro</h2>
                            <button className="close-btn" onClick={() => setShowUpgradeModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-content">
                            <div className="pricing-card premium-card">
                                <div className="pricing-header">
                                    <i className="fas fa-crown pricing-icon"></i>
                                    <h3>Pro Plan</h3>
                                    <div className="price">
                                        <span className="currency">$</span>
                                        <span className="amount">19</span>
                                        <span className="period">/month</span>
                                    </div>
                                </div>
                                <ul className="features-list">
                                    <li><i className="fas fa-check"></i> Unlimited conversations</li>
                                    <li><i className="fas fa-check"></i> Advanced AI models</li>
                                    <li><i className="fas fa-check"></i> File uploads & analysis</li>
                                    <li><i className="fas fa-check"></i> Voice input & output</li>
                                    <li><i className="fas fa-check"></i> Export conversations</li>
                                    <li><i className="fas fa-check"></i> Priority support</li>
                                </ul>
                                <button className="btn-primary upgrade-cta">
                                    <i className="fas fa-credit-card"></i>
                                    Upgrade Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
});

export default Sidebar;
