export default () => async (ctx, next) => {
  ctx.state.serverTiming = {
    counter: 0,
    all: new Map(),
    convertToMs(hrtime) {
      const ms = hrtime[0] * 1e3 + hrtime[1] * 1e-6;
      return ms.toFixed(3);
    },
    startTimer(desc) {
      const generatedId = this.counter++ || 'total';
      this.all.set(generatedId, { start: process.hrtime(), desc });
      return generatedId;
    },
    stopTimer(id) {
      const timing = this.all.get(id);
      timing.stop = process.hrtime(timing.start);
    },
    async profile(callback, desc) {
      const generatedId = this.startTimer(desc);
      await callback();
      this.stopTimer(generatedId);
    }
  };

  await ctx.state.serverTiming.profile(async () => next(), 'Complete SSR');

  ctx.state.serverTiming.all.forEach(timing => {
    if (!timing.stop) timing.stop = process.hrtime(timing.start);
  });

  const metrics = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, { stop, desc }] of ctx.state.serverTiming.all) {
    metrics.push(`${key};dur=${ctx.state.serverTiming.convertToMs(stop)};desc="${desc}"`);
  }

  ctx.append('Server-Timing', metrics.join(', '));
};
