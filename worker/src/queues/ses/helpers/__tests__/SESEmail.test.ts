// test("buildSendEmailArgs returns valid raw email", async () => {
//   const fields = {
//     ...fieldHashMap,
//     favouriteEgg: {
//       answer: "somewhere/123",
//       key: "favouriteEgg",
//       title: "Favourite egg",
//       type: "file",
//     },
//   };
//
//   const email = await emailService.buildSendEmailArgs(fields, "oath", "1234");
//   expect(email.RawMessage.data.includes("Date:")).toBeTruthy();
//   expect(email.includes("From:")).toBeTruthy();
//   expect(email.includes("Message-ID")).toBeTruthy();
//   expect(email.includes("Content-Type: text/html; charset=UTF-8")).toBeTruthy();
//   expect(email.includes('Content-Type: image/jpeg; name="Favourite egg')).toBeTruthy();
//   expect(email.includes('Content-Disposition: attachment; filename="Favourite egg"')).toBeTruthy();
// });
