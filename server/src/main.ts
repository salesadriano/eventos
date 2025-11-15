import { createApp } from "./app";
import { environment } from "./config/environment";
import { buildContainer } from "./container";

const { controllers } = buildContainer();
const app = createApp({ controllers });

app.listen(environment.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${environment.port}`);
});
