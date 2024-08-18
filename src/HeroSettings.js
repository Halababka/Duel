import React from 'react';

function HeroSettings({ hero, settings, onChange }) {
    const handleSpeedChange = (e) => {
        onChange({
            ...settings,
            speed: parseInt(e.target.value, 10),
        });
    };

    const handleFireRateChange = (e) => {
        onChange({
            ...settings,
            fireRate: parseInt(e.target.value, 10),
        });
    };

    return (
        <div>
            <h2>{hero} Settings</h2>
            <label>
                Speed:
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={settings.speed}
                    onChange={handleSpeedChange}
                />
            </label>
            <label>
                Fire Rate:
                <input
                    type="range"
                    min="500"
                    max="3000"
                    value={settings.fireRate}
                    onChange={handleFireRateChange}
                />
            </label>
        </div>
    );
}

export default HeroSettings;
