const Fuse = require('fuse.js');

class IntentClassifier {
    constructor(choices) {
        this.choices = choices;
        const options = {
            includeScore: true,
            keys: ['text']
        };
        this.fuse = new Fuse(choices, options);
    }

    match(text, panic = 0) {
        // Base threshold is strict. Higher panic makes it looser.
        // Panic level goes from 0 to 2. Let's map this to a threshold.
        // Panic 0: 0.4 (fairly strict)
        // Panic 1: 0.6 (more lenient)
        // Panic 2: 0.8 (very lenient)
        const threshold = 0.4 + (panic * 0.2);

        const results = this.fuse.search(text);
        
        if (results.length > 0 && results[0].score < threshold) {
            return results[0].item;
        }
        return null;
    }
}

module.exports = IntentClassifier; 