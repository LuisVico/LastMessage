const express = require('express');
const story = require('./story.json');
const cors = require('cors');
const IntentClassifier = require('./intentClassifier');
const leoAI = require('./leoCharacterAI');
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
        transcript: [],
        time: 0
    };
}

function processChoice(choice) {
    gameState.panic = Math.max(0, Math.min(2, gameState.panic + (choice.panic || 0)));
    if (choice.setFlag && !gameState.flags.includes(choice.setFlag)) {
        gameState.flags.push(choice.setFlag);
    }
    gameState.time += choice.timeCost || 1; // Default to 1 if not specified
    gameState.currentNodeId = choice.target;
}

app.get('/game/start', async (req, res) => {
    initializeGame();
    let initialNode = { ...story[gameState.currentNodeId] };

    // Process messages through the AI
    initialNode.messages = await Promise.all(
        initialNode.messages.map(msg => leoAI.generateResponse(msg, gameState))
    );

    res.json({ node: initialNode, state: gameState });
});

app.post('/game/choice', async (req, res) => {
    const { choice } = req.body;
    if (!choice || !choice.target) {
        return res.status(400).json({ error: 'Invalid choice' });
    }

    // Update game state based on choice
    processChoice(choice);
    
    let nextNode = { ...story[gameState.currentNodeId] };
    if (!nextNode) {
        return res.status(404).json({ error: 'Story node not found' });
    }

    // Process messages through the AI
    nextNode.messages = await Promise.all(
        nextNode.messages.map(msg => leoAI.generateResponse(msg, gameState))
    );
    
    res.json({ node: nextNode, state: gameState });
});

app.post('/game/free-text', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Invalid text input' });
    }

    const currentNode = story[gameState.currentNodeId];
    if (!currentNode || !currentNode.choices) {
        return res.status(400).json({ error: 'No choices available at this node' });
    }

    const classifier = new IntentClassifier(currentNode.choices);
    const matchedChoice = classifier.match(text, gameState.panic);

    if (matchedChoice) {
        processChoice(matchedChoice);
        let nextNode = { ...story[gameState.currentNodeId] };
        if (!nextNode) {
            return res.status(404).json({ error: 'Story node not found' });
        }
        
        // Process messages through the AI
        nextNode.messages = await Promise.all(
            nextNode.messages.map(msg => leoAI.generateResponse(msg, gameState))
        );

        res.json({ node: nextNode, state: gameState, matchedChoiceText: matchedChoice.text });
    } else {
        res.status(404).json({ error: 'No matching choice found' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
}); 