import React, { useRef, useState, useEffect } from "react";
import SpellMenu from "./SpellMenu"; // Импортируем компонент меню

const Game = ({hero1Settings, hero2Settings}) => {
    const canvasRef = useRef(null);
    const hero1Ref = useRef({x: 50, y: 100, radius: 20, dy: hero1Settings.speed, color: hero1Settings.color});
    const hero2Ref = useRef({x: 450, y: 100, radius: 20, dy: hero2Settings.speed, color: hero2Settings.color});
    const spellsRef = useRef([]);
    const scoreRef = useRef({hero1: 0, hero2: 0});
    const isRunning = useRef(false);
    const mousePosRef = useRef({x: 0, y: 0});
    const [showMenu, setShowMenu] = useState(null); // State to track which hero's menu is shown

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = 500;
        canvas.height = 300;

        const update = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const mousePos = mousePosRef.current;

            // Move heroes away from cursor if needed
            const moveHeroAwayFromCursor = (heroRef) => {
                const dx = heroRef.current.x - mousePos.x;
                const dy = heroRef.current.y - mousePos.y;
                const distance = Math.hypot(dx, dy);
                const range = heroRef.current.radius;

                if (distance <= range) {
                    heroRef.current.dy = -heroRef.current.dy;
                }
            };

            moveHeroAwayFromCursor(hero1Ref);
            moveHeroAwayFromCursor(hero2Ref);

            hero1Ref.current.y += hero1Ref.current.dy;
            hero2Ref.current.y += hero2Ref.current.dy;

            // Bounce heroes off edges
            if (hero1Ref.current.y <= 0 || hero1Ref.current.y >= canvas.height - hero1Ref.current.radius) hero1Ref.current.dy *= -1;
            if (hero2Ref.current.y <= 0 || hero2Ref.current.y >= canvas.height - hero2Ref.current.radius) hero2Ref.current.dy *= -1;

            // Render heroes
            ctx.beginPath();
            ctx.arc(hero1Ref.current.x, hero1Ref.current.y, hero1Ref.current.radius, 0, Math.PI * 2);
            ctx.fillStyle = hero1Ref.current.color;
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(hero2Ref.current.x, hero2Ref.current.y, hero2Ref.current.radius, 0, Math.PI * 2);
            ctx.fillStyle = hero2Ref.current.color;
            ctx.fill();
            ctx.closePath();

            // Render spells and detect collisions
            spellsRef.current.forEach((spell, index) => {
                spell.x += spell.dx;

                ctx.beginPath();
                ctx.arc(spell.x, spell.y, spell.radius, 0, Math.PI * 2);
                ctx.fillStyle = spell.color;
                ctx.fill();
                ctx.closePath();

                // Check collision with hero if the spell has traveled a minimum distance
                const distanceHero2 = Math.hypot(spell.x - hero2Ref.current.x, spell.y - hero2Ref.current.y);
                const distanceHero1 = Math.hypot(spell.x - hero1Ref.current.x, spell.y - hero1Ref.current.y);

                if (spell.dx > 0 && distanceHero2 < hero2Ref.current.radius + spell.radius && spell.x > hero1Ref.current.x + hero1Ref.current.radius) {
                    spellsRef.current.splice(index, 1);
                    scoreRef.current.hero1++;
                }

                if (spell.dx < 0 && distanceHero1 < hero1Ref.current.radius + spell.radius && spell.x < hero2Ref.current.x - hero2Ref.current.radius) {
                    spellsRef.current.splice(index, 1);
                    scoreRef.current.hero2++;
                }
            });

            // Display score
            ctx.font = "20px Arial";
            ctx.fillStyle = "black";
            ctx.fillText(`Hero 1: ${scoreRef.current.hero1}`, 20, 30);
            ctx.fillText(`Hero 2: ${scoreRef.current.hero2}`, 380, 30);

            requestAnimationFrame(update);
        };

        if (!isRunning.current) {
            isRunning.current = true;
            update();
        }

        const shootSpell = (heroRef, color) => {
            spellsRef.current.push({
                x: heroRef.current.x + (heroRef === hero1Ref ? 20 : -20),
                y: heroRef.current.y,
                radius: 5,
                dx: heroRef === hero1Ref ? 4 : -4,
                color
            });
        };

        // Shooting intervals
        const hero1ShootInterval = setInterval(() => {
            shootSpell(hero1Ref, hero1Settings.color);
        }, hero1Settings.fireRate);

        const hero2ShootInterval = setInterval(() => {
            shootSpell(hero2Ref, hero2Settings.color);
        }, hero2Settings.fireRate);

        return () => {
            clearInterval(hero1ShootInterval);
            clearInterval(hero2ShootInterval);
        };
    }, [hero1Settings, hero2Settings]);

    useEffect(() => {
        // Update hero speeds when hero1Settings or hero2Settings change
        hero1Ref.current.dy = hero1Settings.speed;
        hero2Ref.current.dy = hero2Settings.speed;
    }, [hero1Settings.speed, hero2Settings.speed]);

    useEffect(() => {
        // Update hero colors when hero1Settings or hero2Settings change
        hero1Ref.current.color = hero1Settings.color;
        hero2Ref.current.color = hero2Settings.color;
    }, [hero1Settings.color, hero2Settings.color]);

    useEffect(() => {
        const handleMouseMove = (event) => {
            mousePosRef.current = {
                x: event.clientX - canvasRef.current.offsetLeft,
                y: event.clientY - canvasRef.current.offsetTop
            };
        };

        const canvas = canvasRef.current;
        canvas.addEventListener("mousemove", handleMouseMove);

        return () => {
            canvas.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const handleCanvasClick = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Check if click is within hero1 or hero2
        if (Math.hypot(x - hero1Ref.current.x, y - hero1Ref.current.y) <= hero1Ref.current.radius) {
            setShowMenu({
                hero: hero1Ref.current, updateColor: (color) => {
                    hero1Ref.current.color = color;
                    hero1Settings.color = color; // Update prop if needed
                }
            });
        } else if (Math.hypot(x - hero2Ref.current.x, y - hero2Ref.current.y) <= hero2Ref.current.radius) {
            setShowMenu({
                hero: hero2Ref.current, updateColor: (color) => {
                    hero2Ref.current.color = color;
                    hero2Settings.color = color; // Update prop if needed
                }
            });
        }
    };

    const handleCloseMenu = () => {
        setShowMenu(null);
    };

    return (
        <div>
            <canvas ref={canvasRef} onClick={handleCanvasClick}></canvas>
            {showMenu && (
                <SpellMenu
                    hero={showMenu.hero}
                    onClose={handleCloseMenu}
                    onColorChange={showMenu.updateColor}
                />
            )}
        </div>
    );
};

export default Game;
