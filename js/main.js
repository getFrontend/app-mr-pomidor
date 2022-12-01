// TIMER
// Variables
/*  */
let pomodoroTime = localStorage.getItem('pomodoroTime') || 25,
    shortTime = localStorage.getItem('shortTime') || 5,
    longTime = localStorage.getItem('longTime') || 15,
    actualTime = localStorage.getItem('actualTime'),
    timeActiveTab = localStorage.getItem('timeActiveTab'),
    interval;

const audio = new Audio("./audio/timer.wav");

// Dom elements and options
const timeELem = document.getElementById('time'),
    minutesText = document.querySelector('[data-time="minutes"]'),
    secondsText = document.querySelector('[data-time="seconds"]'),
    switchBtn = document.getElementById('timeBtn'),
    tabs = document.querySelectorAll('.tab'),
    activeTab = document.getElementById(localStorage.getItem('tab'))
        || document.getElementById('timer'),
    circle = document.querySelector('.progress-ring__circle'),
    radiusCircle = parseInt(getComputedStyle(circle).r),
    circumference = 2 * Math.PI * radiusCircle;


// Funсtions
// Render actual time
const renderTime = (time) => {
    const minutes = Math.trunc(time / 60);
    const seconds = time - (minutes * 60);

    const minutesRender = minutes < 10 ? "0" + minutes : minutes;
    const secondsRender = seconds < 10 ? "0" + seconds : seconds;

    minutesText.innerText = minutesRender;
    secondsText.innerText = secondsRender;

    const timeInTitle = `${minutesRender}:${secondsRender}`;
    document.title = `${timeInTitle} - pomodoro timer Mr.Pomidor`;

    // timeELem.innerText = minutesRender + secondsRender;
};

// render progress bar
const renderProgressBar = (percent) => {
    const offset = circumference - percent / 100 * circumference;
    circle.style.strokeDashoffset = offset;
};

// set percent for progress bar
const setPercentBar = (actualSeconds) => {
    const percent = ((actualSeconds / 60) / timeActiveTab) * 100;
    renderProgressBar(percent);
};

// decrease actual time
const decreaseTime = () => {
    if (actualTime === 0) {
        audio.play();
        localStorage.removeItem('actualTime');
        switchBtn.innerText = 'restart';
        clearInterval(interval);
        renderProgressBar(100);

        return;
    }

    actualTime--;
    localStorage.setItem('actualTime', actualTime);

    setPercentBar(actualTime);
    renderTime(actualTime);
};

// set active time by active tab
const setActiveTime = () => {
    tabs.forEach((tab, index) => {
        if (tab.classList.contains('tab-active')) {
            actualTime = (index === 0) ? pomodoroTime :
                (index === 1) ? shortTime : longTime;
            timeActiveTab = actualTime;
            actualTime *= 60;
            localStorage.setItem('timeActiveTab', timeActiveTab);
        }
    });
};

// set active tab
const setActiveTab = (newTab) => {
    tabs.forEach(tab => tab.classList.remove('tab-active'));
    newTab.classList.add('tab-active');
};

// Progress bar start
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

// start position
setActiveTab(activeTab);
if (!actualTime) {
    setActiveTime();
}
setPercentBar(actualTime);
renderTime(actualTime);

// start, pause, restart
switchBtn.addEventListener('click', (event) => {
    const currentValue = event.target.innerText.toLowerCase();

    if (currentValue === 'start') {
        switchBtn.innerText = 'pause';
        interval = setInterval(decreaseTime, 1000);
    } else if (currentValue === 'pause') {
        switchBtn.innerText = 'start';
        clearInterval(interval);
    } else {
        switchBtn.innerText = 'pause';
        setActiveTime();
        interval = setInterval(decreaseTime, 1000);
    }
});

// tabs: pomodoro, short and long break
tabs.forEach(tab => {
    tab.addEventListener('click', (event) => {
        const current = event.target;

        localStorage.removeItem('actualTime');
        localStorage.setItem('tab', current.id);

        switchBtn.innerText = 'start';
        clearInterval(interval);
        setActiveTab(current);
        setActiveTime();
        renderTime(actualTime);
        renderProgressBar(100);
    });
});

// SETTINGS
// variables
let color = localStorage.getItem('color') || '#FF715B',
    newColor;

const settingsBtn = document.getElementById('settings'),
    modalWrapper = document.getElementById('modalWrapper'),
    closeBtn = document.getElementById('cross'),
    resetBtn = document.getElementById('reset'),
    modal = document.getElementById('modal'),
    inputPomodoro = document.getElementById('inputPomodoro'),
    inputShort = document.getElementById('inputShort'),
    inputLong = document.getElementById('inputLong'),
    plus = document.querySelectorAll('.number-plus'),
    minus = document.querySelectorAll('.number-minus'),
    colorElements = document.querySelectorAll('.color__item'),
    applyBtn = document.getElementById('modalBtn'),
    allElements = document.documentElement;

const closeModal = () => {
    modalWrapper.classList.remove('visible');
};

const increaseValue = (event) => {
    const input = event.target.parentElement.nextElementSibling;
    if (input?.className === 'time__input') {
        input.stepUp();
    }
};

const decreaseValue = (event) => {
    const input = event.target.parentElement.previousElementSibling;
    if (input?.className === 'time__input') {
        input.stepDown();
    }
};

const setActiveColor = (event) => {
    colorElements.forEach(elem =>
        elem.classList.remove('color__item-active'));
    event.target.classList.add('color__item-active');
    newColor = event.target.dataset.color;

    allElements.style.setProperty('--main-color', newColor);
};

const applySettings = () => {
    pomodoroTime = +inputPomodoro.value;
    shortTime = +inputShort.value;
    longTime = +inputLong.value;

    [color] = [newColor || color];

    localStorage.setItem('color', color);
    localStorage.setItem('pomodoroTime', pomodoroTime);
    localStorage.setItem('shortTime', shortTime);
    localStorage.setItem('longTime', longTime);

    localStorage.removeItem('actualTime');

    clearInterval(interval);

    allElements.style.setProperty('--main-color', color);
};

// start settings
inputPomodoro.value = pomodoroTime;
inputShort.value = shortTime;
inputLong.value = longTime;


document.querySelector(`[data-color="${color}"]`).classList.add('color__item-active');
applySettings();
localStorage.setItem("actualTime", actualTime);

// listeners
settingsBtn.addEventListener('click', () => {
    modalWrapper.classList.add('visible');
});

closeBtn.addEventListener('click', closeModal);

modalWrapper.addEventListener('click', (event) => {
    if (event.target === modalWrapper) {
        closeModal();
    }
});

window.addEventListener('keydown', (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
});

document.querySelectorAll('.time__input').forEach(input => {
    input.addEventListener('change', (event) => {
        const current = event.target;

        if (current.value > 60) {
            current.value = 60;
        }
        if (current.value < 1) {
            current.value = 1;
        }
    });
});

plus.forEach(elem => {
    elem.addEventListener('click', increaseValue);
});

minus.forEach(elem => {
    elem.addEventListener('click', decreaseValue);
});

colorElements.forEach(elem => {
    elem.addEventListener('click', setActiveColor);
});

applyBtn.addEventListener('click', () => {
    switchBtn.innerText = 'start';
    applySettings();
    setActiveTime();
    renderTime(actualTime);
    setPercentBar(actualTime);
    closeModal();
});


/* Reset localstorage settings */
const resetSettings = () => {
    localStorage.removeItem('pomodoroTime');
    localStorage.removeItem('shortTime');
    localStorage.removeItem('longTime');
    localStorage.removeItem('actualTime');
    localStorage.removeItem('color');

    // console.log('delete ' + pomodoroTime);
    // console.log('delete ' + shortTime);
    // console.log('delete ' + longTime);
    // console.log('delete ' + actualTime);
    // console.log('delete ' + color);

    closeModal();
    document.location.reload();
}

resetBtn.addEventListener('click', resetSettings);


// window.addEventListener('blur', () => {
//     window.focus();
//     console.log('Братишка вернись!')
// });