const { isExpired } = require("../../src/jobs/verificationJob");

describe("Payment Expiration Date", () => {
  it("Year not expired", () => {
    const newDate = Date.now();
    const paymentDate = Date.parse("2021-10-10 13:07:23.898 +0800");
    const dateResult = paymentDate + 31556926000;
    console.log("Date Result: " + dateResult);

    const message = "Test Year: (Not Expired) ";
    const actual = isExpired(newDate, paymentDate);
    expect(actual).toBe(false);
    results(actual, message);
  });

  it("Year expired", () => {
    const newDate = 1665399369898;
    const paymentDate = Date.parse("2021-10-10 13:07:23.898 +0800");
    const dateResult = paymentDate + 31556926000;
    console.log("Date Result: " + dateResult);

    const message = "Test Year: (Expired) ";
    const actual = isExpired(newDate, paymentDate);
    expect(actual).toBe(true);
    results(actual, message);
  });
});

const results = (actual, message) => {
  const mark = "✔";
  console.log(message, mark);
};
