import React, { useState } from 'react';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
    const [selectedPlan, setSelectedPlan] = useState('pro');
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: '',
        email: '',
        country: 'US'
    });

    if (!isOpen) return null;

    const plans = {
        pro: {
            name: 'NeuralChat Pro',
            monthly: 19,
            yearly: 190,
            features: [
                'Unlimited conversations',
                'Advanced AI models (GPT-4)',
                'File uploads & analysis',
                'Voice input & output',
                'Export conversations',
                'Priority support',
                'Custom themes',
                'API access'
            ]
        },
        enterprise: {
            name: 'Enterprise',
            monthly: 49,
            yearly: 490,
            features: [
                'Everything in Pro',
                'Team collaboration',
                'Admin dashboard',
                'Custom integrations',
                'Advanced analytics',
                'Dedicated support',
                'Custom branding',
                'SLA guarantee'
            ]
        }
    };

    const currentPlan = plans[selectedPlan];
    const price = billingCycle === 'monthly' ? currentPlan.monthly : currentPlan.yearly;
    const savings = billingCycle === 'yearly' ? Math.round(((currentPlan.monthly * 12 - currentPlan.yearly) / (currentPlan.monthly * 12)) * 100) : 0;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    const handleCardNumberChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        setFormData(prev => ({
            ...prev,
            cardNumber: formatted
        }));
    };

    const handleExpiryChange = (e) => {
        const formatted = formatExpiryDate(e.target.value);
        setFormData(prev => ({
            ...prev,
            expiryDate: formatted
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            onSuccess && onSuccess(selectedPlan, billingCycle);
            onClose();
        }, 3000);
    };

    return (
        <div className="payment-overlay" onClick={onClose}>
            <div className="payment-modal premium-card" onClick={(e) => e.stopPropagation()}>
                <div className="payment-header">
                    <h2 className="gradient-text">Upgrade to Premium</h2>
                    <button className="close-btn" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="payment-content">
                    {/* Plan Selection */}
                    <div className="plan-selection">
                        <h3>Choose Your Plan</h3>
                        <div className="plan-options">
                            <div 
                                className={`plan-option ${selectedPlan === 'pro' ? 'selected' : ''}`}
                                onClick={() => setSelectedPlan('pro')}
                            >
                                <div className="plan-header">
                                    <h4>Pro</h4>
                                    <div className="plan-price">
                                        <span className="currency">$</span>
                                        <span className="amount">{billingCycle === 'monthly' ? '19' : '190'}</span>
                                        <span className="period">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                                    </div>
                                </div>
                                <p className="plan-description">Perfect for individuals and professionals</p>
                            </div>
                            
                            <div 
                                className={`plan-option ${selectedPlan === 'enterprise' ? 'selected' : ''}`}
                                onClick={() => setSelectedPlan('enterprise')}
                            >
                                <div className="plan-header">
                                    <h4>Enterprise</h4>
                                    <div className="plan-price">
                                        <span className="currency">$</span>
                                        <span className="amount">{billingCycle === 'monthly' ? '49' : '490'}</span>
                                        <span className="period">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                                    </div>
                                </div>
                                <p className="plan-description">For teams and organizations</p>
                            </div>
                        </div>

                        {/* Billing Cycle */}
                        <div className="billing-cycle">
                            <div className="cycle-options">
                                <button 
                                    className={`cycle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
                                    onClick={() => setBillingCycle('monthly')}
                                >
                                    Monthly
                                </button>
                                <button 
                                    className={`cycle-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
                                    onClick={() => setBillingCycle('yearly')}
                                >
                                    Yearly
                                    {savings > 0 && <span className="savings">Save {savings}%</span>}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="features-section">
                        <h4>What's included:</h4>
                        <ul className="features-list">
                            {currentPlan.features.map((feature, index) => (
                                <li key={index}>
                                    <i className="fas fa-check"></i>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Payment Form */}
                    <form className="payment-form" onSubmit={handleSubmit}>
                        <div className="payment-methods">
                            <h4>Payment Method</h4>
                            <div className="method-options">
                                <button 
                                    type="button"
                                    className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('card')}
                                >
                                    <i className="fas fa-credit-card"></i>
                                    Credit Card
                                </button>
                                <button 
                                    type="button"
                                    className={`method-btn ${paymentMethod === 'paypal' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('paypal')}
                                >
                                    <i className="fab fa-paypal"></i>
                                    PayPal
                                </button>
                            </div>
                        </div>

                        {paymentMethod === 'card' && (
                            <div className="card-form">
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Card Number</label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={formData.cardNumber}
                                        onChange={handleCardNumberChange}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength="19"
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Expiry Date</label>
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            value={formData.expiryDate}
                                            onChange={handleExpiryChange}
                                            placeholder="MM/YY"
                                            maxLength="5"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>CVV</label>
                                        <input
                                            type="text"
                                            name="cvv"
                                            value={formData.cvv}
                                            onChange={handleInputChange}
                                            placeholder="123"
                                            maxLength="4"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Cardholder Name</label>
                                    <input
                                        type="text"
                                        name="cardName"
                                        value={formData.cardName}
                                        onChange={handleInputChange}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'paypal' && (
                            <div className="paypal-section">
                                <div className="paypal-info">
                                    <i className="fab fa-paypal paypal-icon"></i>
                                    <p>You'll be redirected to PayPal to complete your payment securely.</p>
                                </div>
                            </div>
                        )}

                        <div className="payment-summary">
                            <div className="summary-row">
                                <span>{currentPlan.name} ({billingCycle})</span>
                                <span>${price}</span>
                            </div>
                            {billingCycle === 'yearly' && savings > 0 && (
                                <div className="summary-row savings-row">
                                    <span>Yearly discount ({savings}%)</span>
                                    <span className="savings-amount">-${currentPlan.monthly * 12 - currentPlan.yearly}</span>
                                </div>
                            )}
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>${price}</span>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="payment-btn btn-primary"
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-lock"></i>
                                    Subscribe Now - ${price}
                                </>
                            )}
                        </button>

                        <div className="security-info">
                            <i className="fas fa-shield-alt"></i>
                            <span>Your payment information is encrypted and secure</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;