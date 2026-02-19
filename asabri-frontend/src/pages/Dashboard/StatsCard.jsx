import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StatsCard.css';

const StatsCard = ({ icon: Icon, title, value, subtitle, color = 'blue', link }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (link) {
            navigate(link);
        }
    };

    return (
        <div
            className={`stats-card ${link ? 'stats-card-clickable' : ''}`}
            onClick={handleClick}
            style={link ? { cursor: 'pointer' } : {}}
        >
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
