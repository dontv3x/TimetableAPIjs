const express = require('express');
const app = express();
const port = 3000;

// Define subjects, times, counts, and days
const subjects = [
  "Mathematics", "Further Mathematics", "English Grammar",
  "English Composition", "English Comprehension", "English Summary",
  "Geography / Literature", "ICT", "Vocational", "Trade",
  "Biology", "Chemistry", "Physics", "Civics", "Economics", "Language", "Elocution"
];

const times = [
  "08:05 - 08:45", "08:45 - 09:25", "09:25 - 10:05",
  "10:05 - 10:45", "11:10 - 11:50", "11:50 - 12:30",
  "12:30 - 1:10", "1:10 - 1:50", "1:50 - 2:30", "2:50 - 3:30"
];

const count = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Current counts
  [5, 4, 1, 1, 1, 1, 3, 2, 3, 3, 3, 4, 4, 2, 4, 2, 1]  // Weekly limits
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
let cachedTimetable = null;

// Function to generate the timetable
function generateTimetable() {
  const timetable = {};

  days.forEach(day => {
    const dailySchedule = {};

    times.forEach(time => {
      let subjectIndex;
      let attempts = 0;

      // Try to find a subject that hasn't reached its weekly limit
      do {
        subjectIndex = Math.floor(Math.random() * subjects.length);
        attempts++;
      } while (count[0][subjectIndex] >= count[1][subjectIndex] && attempts < subjects.length * 2);

      // If max attempts reached, add "Free Period" as fallback
      if (attempts < subjects.length * 2) {
        dailySchedule[time] = subjects[subjectIndex];
        count[0][subjectIndex]++;
      } else {
        dailySchedule[time] = "Free Period";
      }
    });

    timetable[day] = dailySchedule;
  });
  return timetable;
}

// Endpoint to get the timetable
app.get('/generateTimetable', (req, res) => {
  if (!cachedTimetable) {
    cachedTimetable = generateTimetable();
  }
  res.json(cachedTimetable);
});

// Endpoint to reset the timetable counts
app.get('/resetTimetable', (req, res) => {
  cachedTimetable = null; // Reset cached timetable to trigger new generation
  resetCounts(); // Reset subject counts
  res.send("Timetable reset successfully!");
});

// Reset subject counts to zero for a fresh timetable generation
function resetCounts() {
  for (let i = 0; i < count[0].length; i++) {
    count[0][i] = 0;
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Timetable API is running at http://localhost:${port}`);
});
