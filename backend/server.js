const express = require('express');
const story = require('./story.json');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// In-memory game state storage
let gameState = {};

function initializeGame() {
    gameState = {
        currentNodeId: 'NODE_1',
        panic: 0,
        flags: [],
        transcript: []
    };
}

app.get('/game/start', (req, res) => {
    initializeGame();
    const initialNode = story[gameState.currentNodeId];
    res.json({ node: initialNode, state: gameState });
});

app.post('/game/choice', (req, res) => {
    const { choice } = req.body;
    if (!choice || !choice.target) {
        return res.status(400).json({ error: 'Invalid choice' });
    }

    // Update game state based on choice
    gameState.panic = Math.max(0, Math.min(2, gameState.panic + (choice.panic || 0)));
    if (choice.setFlag && !gameState.flags.includes(choice.setFlag)) {
        gameState.flags.push(choice.setFlag);
    }
    gameState.currentNodeId = choice.target;
    
    const nextNode = story[gameState.currentNodeId];
    if (!nextNode) {
        return res.status(404).json({ error: 'Story node not found' });
    }
    
    res.json({ node: nextNode, state: gameState });
});

app.post('/game/free-text', (req, res) => {
    // Placeholder for intent classification
    res.status(501).json({ error: 'Not Implemented' });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
}); 