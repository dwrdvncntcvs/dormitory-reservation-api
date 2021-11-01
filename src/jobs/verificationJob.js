const cron = require("node-cron");
const db = require("../../models");

var active = "active";
var notActive = "not active";

exports.scheduler = () => {
  console.log(" Job Schedules :");
  notVerifiedUserDeleteSchedule(true);
  paymentExpirationDate(true);
};

const notVerifiedUserDeleteSchedule = (status) => {
  if (status === true) {
    status = active;
    console.log(`  - Delete User with not verified email (${status})`);
    cron.schedule(
      "0 0 */6 * * *",
      async () => {
        const user = await db.User.findAll({
          where: { isEmailVerified: false },
        });
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
      { scheduled: true, timezone: "Asia/Kuala_Lumpur" }
    );
  } else if (status === false) {
    status = notActive;
    console.log(`  - Delete User with not verified email (${status})`);
  }
};

const paymentExpirationDate = (status) => {
  if (status === true) {
    status = active;
    console.log(`  - Update dormitory payment status (${status})`);
    cron.schedule(
      "0 0 */6 * * *",
      async () => {
        const dormitoryData = await db.Dormitory.findAll({
          where: { isPayed: true },
        });

        for (let dormitory of dormitoryData) {
          const paymentData = await db.Payment.findAll({
            where: { dormitoryId: dormitory.id },
          });

          const paymentDate = new Date(
            Math.max.apply(
              null,
              paymentData.map((obj) => {
                return obj.updatedAt;
              })
            )
          );

          const epoch = 31556926000;
          const currentDateEpoch = Date.now();
          const paymentDateEpoch = Date.parse(paymentDate);
          const paymentExpirationDate = paymentDateEpoch + epoch;

          const actualCurrentDate = new Date(currentDateEpoch).toString();
          const actualPaymentDate = new Date(paymentDateEpoch).toString();

          console.log("Payment Epoch Date: ", paymentDateEpoch);

          console.log("Current Epoch Date: ", currentDateEpoch);

          console.log("EXPIRATION Epoch DATE: ", paymentExpirationDate);

          console.log("Current Date: ", actualCurrentDate);

          console.log("Payement Date: ", actualPaymentDate);

          if (currentDateEpoch >= paymentExpirationDate) {
            await db.Dormitory.update(
              {
                isPayed: false,
              },
              {
                where: { id: dormitory.id },
              }
            );

            console.log("Dormitory Payment Expired.");
          } else {
            console.log("Nothing to show");
          }
        }
      },
      { scheduled: true }
    );
  } else if (status === false) {
    status = notActive;
    console.log(`  - Update dormitory payment status (${status})`);
  }
};

const newDate = (date) => {
  const paymentYear = parseInt(
    new Intl.DateTimeFormat("en", { year: "numeric" }).format(date)
  );
  const paymentMonth = parseInt(
    new Intl.DateTimeFormat("en", { month: "numeric" }).format(date)
  );
  const paymentDay = parseInt(
    new Intl.DateTimeFormat("en", { day: "numeric" }).format(date)
  );
  const paymentHour = parseInt(
    new Intl.DateTimeFormat("en", { hour: "numeric" }).format(date)
  );
  const paymentMinute = parseInt(
    new Intl.DateTimeFormat("en", { minute: "numeric" }).format(date)
  );

  const payment = {
    paymentYear,
    paymentMonth,
    paymentDay,
    paymentHour,
    paymentMinute,
  };

  return payment;
};

exports.isExpired = (current, lastPaymentDate) => {
  const epoch = 31556926000;
  const paymentExpirationDate = lastPaymentDate + epoch;
  const currentDate = new Date(current).toDateString();
  const paymentDate = new Date(lastPaymentDate).toDateString();
  const expirationDate = new Date(paymentExpirationDate).toDateString();

  console.log("Current Date: ", currentDate);
  console.log("Payement Date: ", paymentDate);
  console.log("Expiration Date", expirationDate);
  return current >= paymentExpirationDate;
};
