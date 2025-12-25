import app from "./app";
import { cleanupJob } from "./jobs/cleanup.job";

setInterval(cleanupJob, 30 * 60 * 1000);

app.listen(4000, () => {
  console.log("Backend running on 4000");
});
