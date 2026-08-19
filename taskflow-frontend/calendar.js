const API_URL = 'http://localhost:8080/api/tasks';

const calendar = document.getElementById('calendar');
const monthTitle = document.getElementById('monthTitle');

let currentDate = new Date();
let tasks = [];


async function loadTasks() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        tasks = await response.json();

        renderCalendar();

    } catch (error) {

        console.error('Could not load tasks:', error);

    }
}


function renderCalendar() {

    calendar.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthTitle.textContent =
        currentDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });


    let firstDay =
        new Date(year, month, 1).getDay();

    // Make Monday the first day
    firstDay = firstDay === 0 ? 6 : firstDay - 1;


    const daysInMonth =
        new Date(year, month + 1, 0).getDate();


    const previousMonthDays =
        new Date(year, month, 0).getDate();


    const totalCells =
        Math.ceil((firstDay + daysInMonth) / 7) * 7;


    for (let i = 0; i < totalCells; i++) {

        let date;
        let dayNumber;
        let otherMonth = false;


        if (i < firstDay) {

            dayNumber =
                previousMonthDays - firstDay + i + 1;

            date =
                new Date(year, month - 1, dayNumber);

            otherMonth = true;

        } else if (i >= firstDay + daysInMonth) {

            dayNumber =
                i - firstDay - daysInMonth + 1;

            date =
                new Date(year, month + 1, dayNumber);

            otherMonth = true;

        } else {

            dayNumber =
                i - firstDay + 1;

            date =
                new Date(year, month, dayNumber);
        }


        const cell = document.createElement('div');

        cell.className = 'day';


        if (otherMonth) {
            cell.classList.add('other-month');
        }


        if (isToday(date)) {
            cell.classList.add('today');
        }


        const number = document.createElement('div');

        number.className = 'day-number';
        number.textContent = dayNumber;

        cell.appendChild(number);


        const dateString = formatDate(date);


        const dayTasks = tasks.filter(task =>
            task.dueDate === dateString
        );


        dayTasks.forEach(task => {

            const taskElement =
                document.createElement('div');

            taskElement.className = 'task';

            taskElement.textContent = task.title;

            taskElement.title = task.title;

            cell.appendChild(taskElement);
        });


        calendar.appendChild(cell);
    }
}


function formatDate(date) {

    const year = date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, '0');

    const day =
        String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}


function isToday(date) {

    const today = new Date();

    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
}


document.getElementById('prevBtn')
    .addEventListener('click', () => {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );

        renderCalendar();
    });


document.getElementById('nextBtn')
    .addEventListener('click', () => {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );

        renderCalendar();
    });


document.getElementById('todayBtn')
    .addEventListener('click', () => {

        currentDate = new Date();

        renderCalendar();
    });


loadTasks();