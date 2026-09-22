import { students } from "./students.js";
const searchInput = document.querySelector("#searchInput");
const sectionFilter = document.querySelector("#sectionFilter");
const statusFilter = document.querySelector("#statusFilter");
const studentTableBody = document.querySelector("#studentTableBody");
const resultCount = document.querySelector("#resultCount");
const classAverageText = document.querySelector("#classAverage");

const passingSummary = document.querySelector("#passingSummary");
const studentIdInput = document.querySelector("#studentIdInput");
const findStudentBtn = document.querySelector("#findStudentBtn");
const lookupResult = document.querySelector("#lookupResult");
const calculateAverage = (scores) => {
  const total = scores.reduce((sum, score) => sum + score, 0);
  return total / scores.length;
};
const studentRecords = students.map((student) => {
  const average = calculateAverage(student.scores);
  return {
    ...student,
    average,
    isPassed: average >= 75,
  };
});

const renderStudents = (items) => {
  resultCount.textContent = `${items.length} student(s) shown`;
  studentTableBody.innerHTML = items
    .map((student) => {
      const { id, name, section, scores, average, isPassed } = student;
      return `
 <tr>
 <td>${id}</td>
 <td>${name}</td>
 <td>${section}</td>
 <td>${scores.join(", ")}</td>
 <td>${average.toFixed(2)}</td>
 <td class="${isPassed ? "status-pass" : "status-fail"}">
 ${isPassed ? "Passed" : "Needs Improvement"}
 </td>
 </tr>
 `;
    })
    .join("");
};
const renderSummary = () => {
  const totalAverage = studentRecords.reduce(
    (sum, student) => sum + student.average,
    0,
  );
  const classAverage = totalAverage / studentRecords.length;
  const passedCount = studentRecords.filter(
    (student) => student.isPassed,
  ).length;
  classAverageText.textContent = `Class Average: ${classAverage.toFixed(2)}`;
  passingSummary.textContent = `Passing Students: ${passedCount} of ${studentRecords.length}`;
};

const applyFilters = () => {
  const keyword = searchInput.value.trim().toLowerCase();
  const section = sectionFilter.value;
  const status = statusFilter.value;
  const results = studentRecords.filter((student) => {
    const matchesName = student.name.toLowerCase().includes(keyword);
    const matchesSection = section === "all" || student.section === section;
    const matchesStatus =
      status === "all" ||
      (status === "passed" && student.isPassed) ||
      (status === "failed" && !student.isPassed);
    return matchesName && matchesSection && matchesStatus;
  });
  renderStudents(results);
};
const findStudentById = (id) => {
  return studentRecords.find((student) => student.id === id);
};

searchInput.addEventListener("input", applyFilters);
sectionFilter.addEventListener("change", applyFilters);
statusFilter.addEventListener("change", applyFilters);
findStudentBtn.addEventListener("click", () => {
  const id = Number(studentIdInput.value);
  const student = findStudentById(id);
  if (!student) {
    lookupResult.textContent = "Student not found.";
    return;
  }
  lookupResult.textContent =
    `${student.name} | Section ${student.section} | ` +
    `Average: ${student.average.toFixed(2)} | ` +
    `${student.isPassed ? "Passed" : "Needs Improvement"}`;
});
renderStudents(studentRecords);
renderSummary();

const topStudent = studentRecords.reduce((best, student) => {
  return student.average > best.average ? student : best;
});


const studentNameEl = document.getElementById("studnameHighest");
const studentAvgEl = document.getElementById("studaverageHighest");

studentNameEl.textContent = `Student: ${topStudent.name}`;
studentAvgEl.textContent = `Average: ${topStudent.average.toFixed(2)}`;

console.log(
  `Top Student: ${topStudent.name} - ${topStudent.average.toFixed(2)}`,
);

const getSectionAverage = (section) => {
  if (section === "all") return null;

  const sectionStudents = studentRecords.filter(
    (student) => student.section === section,
  );

  if (sectionStudents.length === 0) return 0;

  const total = sectionStudents.reduce(
    (sum, student) => sum + student.average,
    0,
  );

  return total / sectionStudents.length;
};


const sectionSelect = document.getElementById("sectionFilter");
const sectionIdEl = document.getElementById("sectionID");
const sectionAvgEl = document.getElementById("sectionAverage00");


function updateSectionAverageDisplay() {
  const selectedSection = sectionSelect.value;

  if (selectedSection === "all") {
    sectionIdEl.textContent = "Section: All Sections Selected";
    sectionAvgEl.textContent = "Average: N/A";
    return;
  }

  const average = getSectionAverage(selectedSection);

  sectionIdEl.textContent = `Section: ${selectedSection}`;
  sectionAvgEl.textContent = `Average: ${average.toFixed(2)}`;
  console.log(getSectionAverage(selectedSection).toFixed(2));
}
sectionSelect.addEventListener("change", updateSectionAverageDisplay);
updateSectionAverageDisplay();
