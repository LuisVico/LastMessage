export const State = {
  // Transcript of all messages
  transcript: [],
  // Current story node ID
  currentNodeId: 'NODE_1',
  // Flags for story branching
  flags: new Set(),
  // Numeric panic level
  panic: 0,
  // Cumulative time cost
  time: 0,
  // For analytics
  timeline: [],
  subscribers: new Set(),
  update(fn){
    fn(this);
    this.subscribers.forEach(cb=>cb(this));
  },
  subscribe(cb){ this.subscribers.add(cb); },
};
