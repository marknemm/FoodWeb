async function sleep(durationMs) {
  return new Promise((res) => setTimeout(res, durationMs));
}

module.exports = sleep;
