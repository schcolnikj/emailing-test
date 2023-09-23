const app = require("./src/app");
const sequelize = require("./src/db");

const { PORT } = process.env

app.listen(PORT, async () => {
    await sequelize.sync({ force: true});
    console.log(`Server up in port ${PORT}`);
});


