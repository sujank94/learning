const express = require('express');
const healthRouter = require('./routes/health');

const app = express();
app.use(express.json());

app.use('/health', healthRouter);

const port = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`sample-node-app listening on port ${port}`);
  });
}

module.exports = app;
