
import Fuse from 'fuse.js';

export class IntentMatcher {
  constructor(choices){
    this.choices = choices;
    this.fuse = new Fuse(choices, {
      keys:['text'],
      threshold:0.4,
    });
  }
  match(input){
    const res = this.fuse.search(input, {limit:1});
    return res.length ? res[0].item : null;
  }
}
