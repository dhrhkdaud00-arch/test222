const courses = [
  { id: 'CSE101', name: '컴퓨터개론', department: '컴퓨터공학과', grade: 1, credit: 3, professor: '김현수', time: '월 09:00-10:30, 수 09:00-10:30', capacity: 40, enrolled: 28 },
  { id: 'CSE203', name: '자료구조', department: '컴퓨터공학과', grade: 2, credit: 3, professor: '박지훈', time: '화 10:30-12:00, 목 10:30-12:00', capacity: 35, enrolled: 35 },
  { id: 'CSE301', name: '데이터베이스', department: '컴퓨터공학과', grade: 3, credit: 3, professor: '이서연', time: '월 13:30-15:00, 수 13:30-15:00', capacity: 40, enrolled: 31 },
  { id: 'CSE315', name: '웹프로그래밍', department: '컴퓨터공학과', grade: 3, credit: 3, professor: '정민재', time: '화 13:30-15:00, 목 13:30-15:00', capacity: 35, enrolled: 22 },
  { id: 'CSE402', name: '인공지능', department: '컴퓨터공학과', grade: 4, credit: 3, professor: '최유진', time: '금 09:00-12:00', capacity: 30, enrolled: 29 },
  { id: 'STA201', name: '통계학개론', department: '통계학과', grade: 2, credit: 3, professor: '오정민', time: '월 10:30-12:00, 수 10:30-12:00', capacity: 45, enrolled: 36 },
  { id: 'BUS110', name: '경영학원론', department: '경영학과', grade: 1, credit: 3, professor: '한지수', time: '화 09:00-10:30, 목 09:00-10:30', capacity: 50, enrolled: 42 },
  { id: 'KOR205', name: '논리적 글쓰기', department: '국어국문학과', grade: 2, credit: 2, professor: '윤가람', time: '금 13:30-15:30', capacity: 25, enrolled: 18 },
  { id: 'ENG120', name: '대학영어', department: '교양학부', grade: 1, credit: 2, professor: 'Emma Lee', time: '목 15:00-17:00', capacity: 30, enrolled: 27 },
  { id: 'MAT202', name: '선형대수학', department: '수학과', grade: 2, credit: 3, professor: '장도현', time: '월 15:00-16:30, 수 15:00-16:30', capacity: 35, enrolled: 20 }
];

const MAX_CREDITS = 21;
const DAYS = ['월', '화', '수', '목', '금'];
let registered = JSON.parse(localStorage.getItem('registeredCourses') || '[]');

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function save() {
  localStorage.setItem('registeredCourses', JSON.stringify(registered));
}

function parseTimes(timeText) {
  return timeText.split(',').map(part => {
    const match = part.trim().match(/^([월화수목금])\s(\d{2}:\d{2})-(\d{2}:\d{2})$/);
    if (!match) return null;
    const toMinutes = value => {
      const [h, m] = value.split(':').map(Number);
      return h * 60 + m;
    };
    return { day: match[1], start: toMinutes(match[2]), end: toMinutes(match[3]), startText: match[2], endText: match[3] };
  }).filter(Boolean);
}

function hasConflict(course) {
  const targetTimes = parseTimes(course.time);
  return registered.some(item => {
    const other = courses.find(c => c.id === item);
    return parseTimes(other.time).some(a => targetTimes.some(b => a.day === b.day && a.start < b.end && b.start < a.end));
  });
}

function totalCredits() {
  return registered.reduce((sum, id) => sum + (courses.find(c => c.id === id)?.credit || 0), 0);
}

function showToast(message, isError = false) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.className = `toast show${isError ? ' error' : ''}`;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.className = 'toast', 2400);
}

function registerCourse(id) {
  const course = courses.find(c => c.id === id);
  if (!course || registered.includes(id)) return;
  if (course.enrolled >= course.capacity) return showToast('정원이 마감된 과목입니다.', true);
  if (totalCredits() + course.credit > MAX_CREDITS) return showToast('최대 신청 학점을 초과합니다.', true);
  if (hasConflict(course)) return showToast('이미 신청한 과목과 강의 시간이 겹칩니다.', true);
  registered.push(id);
  save();
  course.enrolled += 1;
  renderAll();
  showToast(`${course.name} 과목을 신청했습니다.`);
}

function cancelCourse(id) {
  const course = courses.find(c => c.id === id);
  registered = registered.filter(courseId => courseId !== id);
  if (course) course.enrolled = Math.max(0, course.enrolled - 1);
  save();
  renderAll();
  showToast(`${course?.name || '과목'} 신청을 취소했습니다.`);
}

function filteredCourses() {
  const department = $('#departmentFilter').value;
  const grade = $('#gradeFilter').value;
  const keyword = $('#searchInput').value.trim().toLowerCase();
  return courses.filter(course => {
    const departmentOk = department === 'all' || course.department === department;
    const gradeOk = grade === 'all' || String(course.grade) === grade;
    const keywordOk = !keyword || `${course.name} ${course.professor} ${course.id}`.toLowerCase().includes(keyword);
    return departmentOk && gradeOk && keywordOk;
  });
}

function renderCourses() {
  const list = filteredCourses();
  $('#resultCount').textContent = list.length;
  $('#courseTableBody').innerHTML = list.map(course => {
    const full = course.enrolled >= course.capacity;
    const selected = registered.includes(course.id);
    return `
      <tr>
        <td>${course.id}</td>
        <td class="course-name">${course.name}</td>
        <td>${course.department}</td>
        <td>${course.grade}</td>
        <td>${course.credit}</td>
        <td>${course.professor}</td>
        <td>${course.time}</td>
        <td class="capacity ${full ? 'full' : ''}">${course.enrolled} / ${course.capacity}</td>
        <td><button class="action-btn" ${full || selected ? 'disabled' : ''} onclick="registerCourse('${course.id}')">${selected ? '신청완료' : full ? '마감' : '신청'}</button></td>
      </tr>`;
  }).join('');
}

function renderRegistered() {
  const selected = registered.map(id => courses.find(c => c.id === id)).filter(Boolean);
  $('#registeredCount').textContent = selected.length;
  $('#registeredEmpty').classList.toggle('hidden', selected.length > 0);
  $('#registeredTableWrap').classList.toggle('hidden', selected.length === 0);
  $('#registeredTableBody').innerHTML = selected.map(course => `
    <tr>
      <td>${course.id}</td><td class="course-name">${course.name}</td><td>${course.credit}</td>
      <td>${course.professor}</td><td>${course.time}</td>
      <td><button class="action-btn cancel" onclick="cancelCourse('${course.id}')">취소</button></td>
    </tr>`).join('');
}

function renderCredits() {
  const credits = totalCredits();
  $('#currentCredits').textContent = credits;
  $('#creditProgress').style.width = `${Math.min(100, credits / MAX_CREDITS * 100)}%`;
}

function renderTimetable() {
  const start = 9 * 60;
  const end = 18 * 60;
  const unit = 30;
  const rows = (end - start) / unit;
  let html = '<div class="day-cell"></div>' + DAYS.map(day => `<div class="day-cell">${day}</div>`).join('');
  for (let r = 0; r < rows; r++) {
    const minutes = start + r * unit;
    const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
    const mm = String(minutes % 60).padStart(2, '0');
    html += `<div class="time-cell">${hh}:${mm}</div>`;
    DAYS.forEach(day => {
      const found = registered.map(id => courses.find(c => c.id === id)).find(course =>
        parseTimes(course.time).some(t => t.day === day && minutes >= t.start && minutes < t.end)
      );
      html += `<div class="class-cell">${found ? `${found.name}<br><small>${found.professor}</small>` : ''}</div>`;
    });
  }
  $('#timetable').innerHTML = html;
}

function renderAll() {
  renderCourses();
  renderRegistered();
  renderCredits();
  renderTimetable();
}

function initializeFilters() {
  [...new Set(courses.map(c => c.department))].sort().forEach(dept => {
    const option = document.createElement('option');
    option.value = option.textContent = dept;
    $('#departmentFilter').appendChild(option);
  });
}

function switchView(view) {
  $$('.view').forEach(el => el.classList.remove('active-view'));
  $$('.nav-item').forEach(el => el.classList.remove('active'));
  $(`#${view}View`).classList.add('active-view');
  $(`.nav-item[data-view="${view}"]`).classList.add('active');
}

$$('.nav-item').forEach(btn => btn.addEventListener('click', () => switchView(btn.dataset.view)));
['departmentFilter', 'gradeFilter'].forEach(id => $(`#${id}`).addEventListener('change', renderCourses));
$('#searchInput').addEventListener('input', renderCourses);
$('#resetBtn').addEventListener('click', () => {
  $('#departmentFilter').value = 'all';
  $('#gradeFilter').value = 'all';
  $('#searchInput').value = '';
  renderCourses();
});
$('#logoutBtn').addEventListener('click', () => showToast('데모 페이지에서는 로그아웃이 비활성화되어 있습니다.'));

function updateClock() {
  $('#clock').textContent = new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date());
}

initializeFilters();
renderAll();
updateClock();
setInterval(updateClock, 1000);

window.registerCourse = registerCourse;
window.cancelCourse = cancelCourse;
