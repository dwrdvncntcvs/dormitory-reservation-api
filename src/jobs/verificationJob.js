const cron = require("node-cron");
const db = require("../../models");

exports.scheduler = () => {
  cron.schedule(
    "0 0 */6 * * *",
    async () => {
      const user = await db.User.findAll({ where: { isEmailVerified: false } });
      const currentDate = Date.now();
      const currentDay = parseInt(
        new Intl.DateTimeFormat("en", { day: "numeric" }).format(currentDate)
      );
      console.log("Current Date: ", currentDate.toString());

      for (let acc of user) {
        const dateCreated = new Date(acc.createdAt);
        const dayCreated = parseInt(
          new Intl.DateTimeFormat("en", { day: "numeric" }).format(
            dateCreated
          )
        );
        console.log("Date Created: ", dateCreated.toString());
        const timeToExpire = dayCreated + 1;

        if (currentDay >= timeToExpire) {
          await db.User.destroy({ where: { id: acc.id } });
          console.log("User Deleted");
        }
      }
    },
    { scheduled: true, timezone: "Asia/Kuala_Lumpur",  }
  );
};
