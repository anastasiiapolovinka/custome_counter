const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let saveCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set date input min with tody's date
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

// Populate countdown / Complete UI
function updateDOM() {
   countdownActive = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownValue - now;
      const days = Math.floor(distance / day);
      const hours = Math.floor((distance % day) / hour);
      const minutes = Math.floor((distance % hour) / minute);
      const seconds = Math.floor((distance % minute) / second);

      // Hide input
      inputContainer.hidden = true;

      // If the countdown has ended, show complete
      if (distance < 0) {
         countdownEl.hidden = true;
         clearInterval(countdownActive);
         completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
         completeEl.hidden = false;
      } else {
         // Else, show the countdown progress
         countdownElTitle.textContent = `${countdownTitle}`;
         timeElements[0].textContent = `${days}`;
         timeElements[1].textContent = `${hours}`;
         timeElements[2].textContent = `${minutes}`;
         timeElements[3].textContent = `${seconds}`;
         completeEl.hidden = true;
         countdownEl.hidden = false;
      }
   }, second);
}

// Take values from form input
function updateCountdown(e) {
   e.preventDefault();
   countdownTitle = e.srcElement[0].value;
   countdownDate = e.srcElement[1].value;
   saveCountdown = {
      title: countdownTitle,
      date: countdownDate,
   };
   localStorage.setItem('coutdown', JSON.stringify(saveCountdown));
   // Check for valid date
   if (countdownDate === '') {
      alert('Please select a  date for the countdown.');  
   } else {
      // Get number version of current Date, updateDOM
      countdownValue = new Date(countdownDate).getTime();
      updateDOM();
   }
}

// Reset all values
function reset() {
   // Hide Countdowns, show Input
   countdownEl.hidden = true;
   completeEl.hidden = true;
   inputContainer.hidden = false;
   clearInterval(countdownActive);
   countdownTitle = '';
   countdownDate = '';
   localStorage.removeItem('countdown');
}

function restorePreviousCountdown() {
   // Get countdown from localStorage if availaable
   if (localStorage.getItem('countdown')) {
      inputContainer.hidden = true;
      saveCountdown = JSON.parse(localStorage.getItem('countdown'));
      countdownTitle = saveCountdown.title;
      countdownDate = saveCountdown.date;
      countdownValue = new Date(countdownDate).getTime();
      updateDOM();
   }
}

// Event listener
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// On load.check localStorage
restorePreviousCountdown();