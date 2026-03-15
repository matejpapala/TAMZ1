document.addEventListener('DOMContentLoaded', () => {
  loadHistory();
});

function switchTab(tabName) {
  const calcView = document.getElementById('view-calculator');
  const histView = document.getElementById('view-history');

  if (tabName === 'calculator') {
    calcView.style.display = 'block';
    histView.style.display = 'none';
  } else if (tabName === 'history') {
    calcView.style.display = 'none';
    histView.style.display = 'block';
    loadHistory();
  }
}

function calculateBMI() {
  const name = document.getElementById('nameInput').value || 'Anonym';
  const age = document.getElementById('ageInput').value || '-';
  const gender = document.getElementById('genderInput').value;
  const height = document.getElementById('heightInput').value;
  const weight = document.getElementById('weightInput').value;

  const heightInMeters = height / 100;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

  let status = '';
  let colorHex = ''; 

  if (bmi < 18.5) {
    status = 'Podváha';
    colorHex = '#ffc409';
  } else if (bmi >= 18.5 && bmi < 25) {
    status = 'Zdravá váha';
    colorHex = '#2dd36f';
  } else {
    status = 'Nadváha / Obezita';
    colorHex = '#eb445a';
  }

  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = `
    <p><strong>Jméno:</strong> ${name}</p>
    <p><strong>Věk:</strong> ${age}</p>
    <p><strong>Pohlaví:</strong> ${gender === 'male' ? 'Muž' : 'Žena'}</p>
    <p><strong>Výška:</strong> ${height} cm</p>
    <p><strong>Váha:</strong> ${weight} kg</p>
    
    <div class="bmi-result" style="color: ${colorHex};">
      Your BMI is ${bmi}
      <span class="status-text" style="color: ${colorHex};">${status}</span>
    </div>
  `;

  const dateStr = new Date().toLocaleDateString('cs-CZ') + ' ' + new Date().toLocaleTimeString('cs-CZ', {hour: '2-digit', minute:'2-digit'});
  const record = { date: dateStr, name, bmi, status, colorHex };
  
  let history = JSON.parse(localStorage.getItem('bmiHistory') || '[]');
  history.unshift(record);
  localStorage.setItem('bmiHistory', JSON.stringify(history));

  loadHistory();

  const modal = document.getElementById('resultModal');
  modal.present();
}

function loadHistory() {
  const historyList = document.getElementById('historyList');
  const history = JSON.parse(localStorage.getItem('bmiHistory') || '[]');
  
  if (history.length === 0) {
    historyList.innerHTML = '<ion-item><ion-label color="medium">Historie je prázdná</ion-label></ion-item>';
    return;
  }

  historyList.innerHTML = '';
  history.forEach(item => {
    historyList.innerHTML += `
      <ion-item>
        <ion-label>
          <h2>${item.name}</h2>
          <p>${item.date}</p>
        </ion-label>
        <ion-note slot="end" class="${item.colorClass}" style="font-weight: bold; font-size: 1.2rem;">
          ${item.bmi}
        </ion-note>
      </ion-item>
    `;
  });
}