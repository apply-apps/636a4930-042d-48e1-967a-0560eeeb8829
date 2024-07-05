// Filename: index.js
// Combined code from all files

import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Dimensions, TouchableWithoutFeedback } from 'react-native';

const { width, height } = Dimensions.get('window');
const shipWidth = 50;
const shipHeight = 20;
const bulletWidth = 5;
const bulletHeight = 10;
const invaderWidth = 40;
const invaderHeight = 20;

const App = () => {
    const [shipPosition, setShipPosition] = useState(width / 2 - shipWidth / 2);
    const [bullets, setBullets] = useState([]);
    const [invaders, setInvaders] = useState([]);
    const [invadersDirection, setInvadersDirection] = useState('right');
    const [gameOver, setGameOver] = useState(false);
    const intervalRef = useRef();

    useEffect(() => {
        spawnInvaders();
        intervalRef.current = setInterval(gameLoop, 50);
        return () => clearInterval(intervalRef.current);
    }, []);

    const spawnInvaders = () => {
        let newInvaders = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 3; j++) {
                newInvaders.push({
                    x: i * (invaderWidth + 10),
                    y: j * (invaderHeight + 10),
                });
            }
        }
        setInvaders(newInvaders);
    };

    const gameLoop = () => {
        moveBullets();
        moveInvaders();
        detectCollisions();
    };

    const moveBullets = () => {
        setBullets(bullets.map(bullet => ({ ...bullet, y: bullet.y - bulletHeight })));
    };

    const moveInvaders = () => {
        let direction = invadersDirection;
        let dx = direction === 'right' ? 5 : -5;
        const newInvaders = invaders.map(invader => {
            if (invader.x + dx > width - invaderWidth || invader.x + dx < 0) {
                direction = direction === 'right' ? 'left' : 'right';
            }
            return { x: invader.x + dx, y: invader.y };
        });
        setInvaders(newInvaders);
        setInvadersDirection(direction);
    };

    const detectCollisions = () => {
        const remainingInvaders = [];
        const remainingBullets = [];
        invaders.forEach(invader => {
            let hit = false;
            bullets.forEach(bullet => {
                if (bullet.x > invader.x && bullet.x < invader.x + invaderWidth &&
                    bullet.y > invader.y && bullet.y < invader.y + invaderHeight) {
                    hit = true;
                }
                if (!hit) remainingBullets.push(bullet);
            });
            if (!hit) remainingInvaders.push(invader);
        });
        setInvaders(remainingInvaders);
        setBullets(remainingBullets);

        if (remainingInvaders.length === 0) {
            setGameOver(true);
            clearInterval(intervalRef.current);
        }
    };

    const handleTouch = (event) => {
        const touchX = event.nativeEvent.locationX;
        if (touchX < width / 2) {
            setShipPosition(shipPosition - 20);
        } else {
            setShipPosition(shipPosition + 20);
        }
    };

    const handleShoot = () => {
        setBullets([...bullets, { x: shipPosition + shipWidth / 2 - bulletWidth / 2, y: height - shipHeight }]);
    };

    return (
        < SafeAreaView style={styles.container} >
            {gameOver ? <Text style={styles.gameOver}>You Win!</Text> : null}
            <View style={styles.gameArea}>
                {invaders.map((invader, index) => (
                    <View key={index} style={[styles.invader, { left: invader.x, top: invader.y }]} />
                ))}
                <View style={[styles.ship, { left: shipPosition, bottom: 20 }]} />
                {bullets.map((bullet, index) => (
                    <View key={index} style={[styles.bullet, { left: bullet.x, top: bullet.y }]} />
                ))}
            </View>
            <TouchableWithoutFeedback onPress={handleTouch} onLongPress={handleShoot}>
                <View style={styles.controlArea}>
                    <Text style={styles.instructions}>Tap left/right to move, hold to shoot</Text>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    gameArea: {
        position: 'relative',
        width: width,
        height: height,
    },
    ship: {
        position: 'absolute',
        width: shipWidth,
        height: shipHeight,
        backgroundColor: 'blue',
    },
    bullet: {
        position: 'absolute',
        width: bulletWidth,
        height: bulletHeight,
        backgroundColor: 'red',
    },
    invader: {
        position: 'absolute',
        width: invaderWidth,
        height: invaderHeight,
        backgroundColor: 'green',
    },
    controlArea: {
        height: 80,
        backgroundColor: '#222',
        justifyContent: 'center',
        alignItems: 'center',
    },
    instructions: {
        color: '#fff',
    },
    gameOver: {
        position: 'absolute',
        top: height / 2 - 50,
        left: width / 2 - 50,
        fontSize: 30,
        fontWeight: 'bold',
    },
});

export default App;