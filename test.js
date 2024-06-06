const subjects = [
  { subject: "Mathematics", duration: 30 },
  { subject: "English", duration: 30 },
  { subject: "Mathematics", duration: 40 },
  { subject: "English", duration: 40 },
];
const validSubjects = ["Mathematics", "Science", "English"];
// Group subjects and sum durations
const groupedSubjects = subjects.reduce((acc, current) => {
  const { subject, duration } = current;
  if (!acc[subject]) {
    acc[subject] = { subject, duration: 0 };
  }
  acc[subject].duration += duration;
  return acc;
}, {});
validSubjects.forEach((subject) => {
  if (!groupedSubjects[subject]) {
    groupedSubjects[subject] = { subject, duration: 0 };
  }
});

console.log(Object.values(groupedSubjects));
