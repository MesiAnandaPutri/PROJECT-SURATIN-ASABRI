import React from 'react';
import './StatsCard.css';

const StatsCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
    return (
        <div className="stats-card">
            <div className={`stats-icon icon-${color}`}>
                <Icon size={24} />
            </div>
            <div className="stats-info">
                <h3>{title}</h3>
                <div className="stats-value">{value}</div>
                <p className="stats-subtitle">{subtitle}</p>
            </div>
        </div>
    );
};

export default StatsCard;
