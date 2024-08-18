import React, { useState } from 'react';
import Game from './Game';
import HeroSettings from './HeroSettings';

function App() {
    const [hero1Settings, setHero1Settings] = useState({
        speed: 2,
        fireRate: 1000,
        color: '#ff0000',
    });

    const [hero2Settings, setHero2Settings] = useState({
        speed: 2,
        fireRate: 1000,
        color: '#0000ff',
    });

    const handleHero1SettingsChange = (newSettings) => {
        setHero1Settings(newSettings);
    };

    const handleHero2SettingsChange = (newSettings) => {
        setHero2Settings(newSettings);
    };

    return (
        <div>
            <h1>Дуэль</h1>
            <Game hero1Settings={hero1Settings} hero2Settings={hero2Settings} />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <HeroSettings
                    hero="Hero 1"
                    settings={hero1Settings}
                    onChange={handleHero1SettingsChange}
                />
                <HeroSettings
                    hero="Hero 2"
                    settings={hero2Settings}
                    onChange={handleHero2SettingsChange}
                />
            </div>
        </div>
    );
}

export default App;
