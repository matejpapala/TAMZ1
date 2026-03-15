const cards = document.querySelectorAll('.card');

const date = new Date();
const htmlTodaysDate = document.getElementById("todays-date");
const formattedDate = date.toLocaleDateString('cs-CZ');
htmlTodaysDate.textContent = `Dnesni datum je: ${formattedDate}`;

const htmlDateChoosing = document.getElementById("date-choosing-div");

const ionicCalendar = document.getElementById('my-calendar');

ionicCalendar.addEventListener('ionChange', (event) => {
  const date = event.detail.value;
  const chosenDate = new Date(date);
  const formattedDateChosen = chosenDate.toLocaleDateString('cs-CZ');

  const dateText = document.getElementById('smaller-text');
  dateText.textContent = `Zvolene datum: ${formattedDateChosen}`;
});

const semestrZacatek = new Date('2026-02-16').getTime();
const konecSemestru = new Date('2026-05-16').getTime();

const today = new Date().getTime();

const overallTime = konecSemestru - semestrZacatek;
const ubehloCasu = today - semestrZacatek;

const progressBar = document.getElementById("semestr-progress-bar");
let progres = ubehloCasu / overallTime;
progressBar.value = progres;

const udalosti = [
  { nazev: 'Zkouška z Matiky', datum: '2026-03-4' },
  { nazev: 'Odevzdání projektu', datum: '2026-04-10' },
  { nazev: 'Konec zkouškového', datum: '2026-06-30' }
];

const upcoming = [];

const divUdalosti = document.getElementById("column-with-dates")
udalosti.forEach((event) => {
  const casUdalosti = new Date(event.datum).getTime();
  const daysRemaining = Math.ceil((casUdalosti - today) / (1000 * 60 * 24 * 60));

  divUdalosti.innerHTML += `<div class = "event-row">
    <span id = "smaller-text">${event.nazev}:</span>
    <span class = "event-days">${daysRemaining} dni</span>
  </div>`;

  if(daysRemaining <= 7 && daysRemaining >= 0) {
    upcoming.push(event.nazev);
  }
});

if(upcoming.length > 0) {
  showToastNotification(`Blizi se: ${upcoming.join(", ")}`);
}

async function showToastNotification(messageText) {
  await customElements.whenDefined('ion-toast');
  const toast = document.createElement('ion-toast');
  
  toast.message = messageText;
  toast.duration = 4000; 
  toast.color = 'warning'; 
  toast.position = 'bottom';
  toast.buttons = [
    {
      text: 'Zavřít',
      role: 'cancel'
    }
  ];

  document.body.appendChild(toast);
  await toast.present();
}