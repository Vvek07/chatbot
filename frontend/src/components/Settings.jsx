import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './Settings.css';

const Settings = ({ isOpen, onClose }) => {
    const { 
        theme, 
        toggleTheme, 
        accentColor, 
        setAccentColor, 
        fontSize, 
        setFontSize, 
        animations, 
        setAnimations 
    } = useTheme();
    
    const [activeTab, setActiveTab] = useState('appearance');
    const [voiceInput, setVoiceInput] = useState(false);
    const [fileUploads, setFileUploads] = useState(true);
    const [analytics, setAnalytics] = useState(true);

    if (!isOpen) return null;

    const accentColors = [
        { name: 'Purple', value: 'purple', color: '#667eea' },
        { name: 'Blue', value: 'blue', color: '#4facfe' },
        { name: 'Green', value: 'green', color: '#43e97b' },
        { name: 'Orange', value: 'orange', color: '#fa709a' },
        { name: 'Red', value: 'red', color: '#ff6b6b' }
    ];

    // No premium gating for toggles

    return (
        <>
            <div className="settings-overlay" onClick={onClose}>
                <div className="settings-modal premium-card" onClick={(e) => e.stopPropagation()}>
                    <div className="settings-header">
                        <h2 className="gradient-text">Settings</h2>
                        <button className="close-btn" onClick={onClose}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="settings-content">
                        <div className="settings-tabs">
                            <button 
                                className={`tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
                                onClick={() => setActiveTab('appearance')}
                            >
                                <i className="fas fa-palette"></i>
                                Appearance
                            </button>
                            <button 
                                className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
                                onClick={() => setActiveTab('chat')}
                            >
                                <i className="fas fa-comments"></i>
                                Chat
                            </button>
                            <button 
                                className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
                                onClick={() => setActiveTab('account')}
                            >
                                <i className="fas fa-user"></i>
                                Account
                            </button>
                            <button 
                                className={`tab-btn ${activeTab === 'advanced' ? 'active' : ''}`}
                                onClick={() => setActiveTab('advanced')}
                            >
                                <i className="fas fa-cog"></i>
                                Advanced
                            </button>
                        </div>

                        <div className="settings-panel">
                            {activeTab === 'appearance' && (
                                <div className="settings-section">
                                    <div className="setting-group">
                                        <h3>Theme</h3>
                                        <div className="theme-selector">
                                            <button 
                                                className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                                                onClick={() => theme !== 'dark' && toggleTheme()}
                                            >
                                                <i className="fas fa-moon"></i>
                                                Dark
                                            </button>
                                            <button 
                                                className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                                                onClick={() => theme !== 'light' && toggleTheme()}
                                            >
                                                <i className="fas fa-sun"></i>
                                                Light
                                            </button>
                                        </div>
                                    </div>

                                    <div className="setting-group">
                                        <h3>Accent Color</h3>
                                        <div className="color-selector">
                                            {accentColors.map((color) => (
                                                <button
                                                    key={color.value}
                                                    className={`color-option ${accentColor === color.value ? 'active' : ''}`}
                                                    onClick={() => setAccentColor(color.value)}
                                                    style={{ backgroundColor: color.color }}
                                                    title={color.name}
                                                >
                                                    {accentColor === color.value && <i className="fas fa-check"></i>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="setting-group">
                                        <h3>Font Size</h3>
                                        <div className="font-size-selector">
                                            {['small', 'medium', 'large'].map((size) => (
                                                <button
                                                    key={size}
                                                    className={`size-option ${fontSize === size ? 'active' : ''}`}
                                                    onClick={() => setFontSize(size)}
                                                >
                                                    {size.charAt(0).toUpperCase() + size.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="setting-group">
                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <h4>Animations</h4>
                                                <p>Enable smooth transitions and animations</p>
                                            </div>
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={animations}
                                                    onChange={(e) => setAnimations(e.target.checked)}
                                                />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'chat' && (
                                <div className="settings-section">
                                    <div className="setting-group">
                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <h4>Auto-save Conversations</h4>
                                                <p>Automatically save your chat history</p>
                                            </div>
                                            <label className="toggle-switch">
                                                <input type="checkbox" defaultChecked />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="setting-group">
                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <h4>Voice Input</h4>
                                                <p>Enable voice-to-text input</p>
                                            </div>
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={voiceInput}
                                                    onChange={e => setVoiceInput(e.target.checked)}
                                                />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="setting-group">
                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <h4>File Uploads</h4>
                                                <p>Upload and analyze documents</p>
                                            </div>
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={fileUploads}
                                                    onChange={e => setFileUploads(e.target.checked)}
                                                />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="setting-group">
                                        <h3>Export Options</h3>
                                        <div className="export-options">
                                            <button className="export-btn" disabled>
                                                <i className="fas fa-file-pdf"></i>
                                                Export as PDF
                                            </button>
                                            <button className="export-btn" disabled>
                                                <i className="fas fa-file-word"></i>
                                                Export as Word
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'account' && (
                                <div className="settings-section">
                                    <div className="setting-group">
                                        <h3>Subscription</h3>
                                        <div className="subscription-info">
                                            <div className="plan-card">
                                                <div className="plan-header">
                                                    <h4>Free Plan</h4>
                                                    <span className="plan-price">$0/month</span>
                                                </div>
                                                <ul className="plan-features">
                                                    <li><i className="fas fa-check"></i> 20 messages per day</li>
                                                    <li><i className="fas fa-check"></i> Basic AI model</li>
                                                    <li><i className="fas fa-times"></i> No file uploads</li>
                                                    <li><i className="fas fa-times"></i> No voice features</li>
                                                </ul>
                                                {/* Upgrade button removed for now */}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="setting-group">
                                        <h3>Usage Statistics</h3>
                                        <div className="usage-stats">
                                            <div className="stat-item">
                                                <span className="stat-label">Messages Today</span>
                                                <span className="stat-value">5 / 20</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-label">Total Conversations</span>
                                                <span className="stat-value">12</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-label">Member Since</span>
                                                <span className="stat-value">Jan 2024</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'advanced' && (
                                <div className="settings-section">
                                    <div className="setting-group">
                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <h4>Developer Mode</h4>
                                                <p>Show API response times and debug info</p>
                                            </div>
                                            <label className="toggle-switch">
                                                <input type="checkbox" />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="setting-group">
                                        <h3>Data Management</h3>
                                        <div className="data-options">
                                            <button className="data-btn">
                                                <i className="fas fa-download"></i>
                                                Export All Data
                                            </button>
                                            <button className="data-btn danger">
                                                <i className="fas fa-trash"></i>
                                                Clear All Conversations
                                            </button>
                                        </div>
                                    </div>

                                    <div className="setting-group">
                                        <h3>Privacy</h3>
                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <h4>Analytics</h4>
                                                <p>Help improve NeuralChat by sharing usage data</p>
                                            </div>
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={analytics}
                                                    onChange={e => setAnalytics(e.target.checked)}
                                                />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* No upgrade modal needed for toggles */}
        </>
    );
};

export default Settings;