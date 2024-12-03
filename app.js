// Arrays to store questions and students, initialized from localStorage or as empty arrays
let questions = JSON.parse(localStorage.getItem('questions')) || [];
let students = JSON.parse(localStorage.getItem('students')) || [];

// Function to setup and create a new wheel
function setupWheel(items, canvasId) {
    // If items array is empty, create a default segment
    const segments = items.length > 0
        ? items.map((item, ind) => ({
            fillStyle: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            text: `${ind}`
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
function renderList(listId, items, haveScore = false) {
    const list = $(listId);
    list.empty();
    items.forEach((item, ind) => list.append(`<li class="list-group-item item-right">
        <div class="question-num">
            <span>${ind + 1}</span>
         <span> ${item}</span>
        </div>
       ${haveScore ? ' <div class="score btn btn-primary" data-isInput="false" >30</div>': ''}
        </li>`));

    if (haveScore) {
        $('.score').click((e) => {
            const isInput = e.target.attributes[1].value
            let value = e.target.textContent

            if (isInput) {
                e.target.innerHTML = `<input type="text" data-isInput="true" value="${value}" id="score-input"/>`

                
            }
        })
    }
}

function updateScore() {
    let score = 0
    return function(score) {
        this.score = score
        console.log(score)
    }
}

// Initial rendering of question and student lists
renderList('#questionList', questions, false);
renderList('#studentList', students, true)

// Functions to reinitialize wheels after updating questions or students
function updateQuestionWheel() {
    questionWheel = setupWheel(questions, 'questionWheel');
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

$('#addStudent').click(() => {
    const student = $('#newStudent').val();
    if (student) {
        students.push(student);
        renderList('#studentList', students);
        $('#newStudent').val('');
        saveToLocalStorage();
        renderList2(students)
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

$('#startStudentsSpin').click(() => startRandomiser())



// 
let  usedNums = []
function startRandomiser() {
    const studentList = document.querySelectorAll('.student-item')
    studentList.forEach((item, ind) => {
        if (usedNums.includes(ind)) {
            item.classList.add('nonActive')
        }
    })
 
    let randomNum = Math.floor(Math.random() * studentList.length) 
    if (usedNums.length === studentList.length) {
       usedNums = []
       studentList.forEach(item => item.classList.remove('nonActive'))
    }
    while (usedNums.includes(randomNum)) {
        randomNum = Math.floor(Math.random() * studentList.length) 
    }
    if (!usedNums.includes(randomNum)){
        usedNums.push(randomNum)
    }
    let count = 0
    let loop = 0
    
    const interval = setInterval(() => {
        if (count === studentList.length) {
            count = 0
        }
        if (count === studentList.length - 1) {
            loop++
        }
        if (loop === 3 && count === randomNum ) {
            clearInterval(interval)
        }
        studentList.forEach(item => item.classList.remove('active-student'))
        studentList[count].classList.add('active-student')
        count++
    }, 50)

}

function renderList2( items) {
    const list = $('.students-container');
    list.empty();
    items.forEach((item, ind) => list.append(`<li class="list-group-item student-item">${ind + 1}</li>`));
}

renderList2(students)

