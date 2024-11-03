// Arrays to store questions and students, initialized from localStorage or as empty arrays
let questions = JSON.parse(localStorage.getItem('questions')) || [];
let students = JSON.parse(localStorage.getItem('students')) || [];

// Function to setup and create a new wheel
function setupWheel(items, canvasId) {
    // If items array is empty, create a default segment
    const segments = items.length > 0
        ? items.map(item => ({
            fillStyle: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            text: item
        }))
        : [{ fillStyle: '#ccc', text: 'No Items' }];

    console.log(`Setting up ${canvasId} with segments:`, segments);

    // Create and return a new Winwheel instance
    return new Winwheel({
        canvasId: canvasId,
        numSegments: segments.length,
        segments: segments,
        animation: {
            type: 'spinToStop',
            duration: 5,
            spins: 8,
            callbackFinished: alertSelection
        }
    });
}

// Initialize wheels
let questionWheel = setupWheel(questions, 'questionWheel');
let studentWheel = setupWheel(students, 'studentWheel');

// Display selected segment in an alert
function alertSelection(selectedSegment) {
    alert(`Selected: ${selectedSegment.text}`);
}

// Save data to local storage
function saveToLocalStorage() {
    localStorage.setItem('questions', JSON.stringify(questions));
    localStorage.setItem('students', JSON.stringify(students));
}

// Render the question and student lists
function renderList(listId, items) {
    const list = $(listId);
    list.empty();
    items.forEach(item => list.append(`<li class="list-group-item">${item}</li>`));
}

// Initial rendering of question and student lists
renderList('#questionList', questions);
renderList('#studentList', students);

// Functions to reinitialize wheels after updating questions or students
function updateQuestionWheel() {
    questionWheel = setupWheel(questions, 'questionWheel');
}

function updateStudentWheel() {
    studentWheel = setupWheel(students, 'studentWheel');
}

// Add new question
$('#addQuestion').click(() => {
    const question = $('#newQuestion').val();
    if (question) {
        questions.push(question);
        updateQuestionWheel();
        renderList('#questionList', questions);
        $('#newQuestion').val('');
        saveToLocalStorage();
    }
});

// Add new student
$('#addStudent').click(() => {
    const student = $('#newStudent').val();
    if (student) {
        students.push(student);
        updateStudentWheel();
        renderList('#studentList', students);
        $('#newStudent').val('');
        saveToLocalStorage();
    }
});

// Reset the animation settings for consistent spin speed
function resetAndStartAnimation(wheel) {
    // Reset animation properties to desired initial state
    wheel.animation = {
        type: 'spinToStop',
        duration: 5,  // Desired duration for fast spin
        spins: 8,     // Number of spins for fast initial rotation
        callbackFinished: alertSelection,
        callbackAfter: function() {}  // Empty callback to avoid residual animations
    };
    
    // Reinitialize segments (this can help clear any lingering states)

    // Redraw the wheel and start fresh animation
    wheel.draw();
    wheel.startAnimation();
}

// Event listeners for question wheel
$('#startQuestionSpin').click(() => resetAndStartAnimation(questionWheel));
$('#stopQuestionSpin').click(() => questionWheel.stopAnimation(false));

// Event listeners for student wheel
$('#startStudentSpin').click(() => resetAndStartAnimation(studentWheel));
$('#stopStudentSpin').click(() => studentWheel.stopAnimation(false));


