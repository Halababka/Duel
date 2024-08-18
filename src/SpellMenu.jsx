import React, { useState } from "react";

const SpellMenu = ({ hero, onClose, onColorChange }) => {
    const [selectedColor, setSelectedColor] = useState(hero.color);

    const handleColorChange = (event) => {
        setSelectedColor(event.target.value);
    };

    const handleSave = () => {
        onColorChange(selectedColor);
        onClose();
    };

    return (
        <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            border: "1px solid black",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)"
        }}>
            <h4>Choose Spell Color</h4>
            <input
                type="color"
                value={selectedColor}
                onChange={handleColorChange}
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
};

export default SpellMenu;