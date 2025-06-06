
export const State = {
  currentNodeId: 'NODE_1',
  panic: 0,
  flags: new Set(),
  subscribers: new Set(),
  update(fn){
    fn(this);
    this.subscribers.forEach(cb=>cb(this));
  },
  subscribe(cb){ this.subscribers.add(cb); },
};
