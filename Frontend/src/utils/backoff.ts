export async function retry(fn: () => Promise<void>, retries = 3) {
  let delay = 500;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch {
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
}
