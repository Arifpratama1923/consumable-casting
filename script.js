async function getData() {
  const spreadsheetId = '17wvHJODwxePGHcjZQWKh_CKUp3gl9ZopRHUGyjHS5I4'
  const apiKey = 'AIzaSyB565bEsLwPtyiKXaQYH73T8u68N32Y-JE';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/?key=${apiKey}&includeGridData=true`;
  const result = await fetch(url)
  const { sheets } = await result.json();
  console.log('sheets', sheets);
  const firstSheet = sheets[1];
  const data = firstSheet.data[0].rowData
      .filter((_, index) => index !== 0) // Mulai dari index 1 (menghindari nama kolom)
      .map(row => {
          const { values } = row;
          return {
              name: values[0].formattedValue,
              email: values[1].formattedValue,
          }
      })
  return data;
}


function dataItemTemplate(item) {
  return (
    `<li>
      <p>${item.name}</p>
      <p>${item.email}</p>
    </li>`
  )
}

async function renderData() {
  const wrapperDOM = document.getElementById('wrapper');
  try {
    const data = await getData();
    wrapperDOM.innerHTML = data.map(item => dataItemTemplate(item)).join('');
  } catch (error) {
    wrapperDOM.innerHTML = error
  }
}

// renderData();

const mesinSelect = document.getElementById("consumable-mesin");

  // loop from 1 to 65 and add options
  for (let i = 1; i <= 65; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    mesinSelect.appendChild(option);
  }

$("form").on("submit", function(e) {
  e.preventDefault();

  const data = {
    consumable: $("#consumable").val(),
    isi: $("#consumable-isi").val(),   // 🔥 ambil dari select ISI
    date: $("#date").val(),
    mesin: $("#consumable-mesin").val(),
    inputIsi: $("#input-isi").val()    // 🔥 ambil dari input number
  };

  console.log('data', data);

//   const webAppUrl = "https://script.google.com/macros/s/AKfycbxrt96YRFQV2pahMqL0RJigabZuOYfTVZTnOfWA8uHLjKCPgqVATq7fDpR8yZR0F9HyPQ/exec";
const webAppUrl = "https://script.google.com/macros/s/AKfycbw-hIj5bfdbe9TJhrSG7zQFgjFEslj1sL64qmNADzedHPS6aCxtfZ2A8CzQ1R-Yz2lUIg/exec"  
$.post(webAppUrl, data, function(response) {
  // Remove old alerts
  $(".alert").remove();

  // Add new alert message
  const alertBox = $(`
    <div class="alert alert-success text-center" role="alert">
      ✅ Insert data success
    </div>
  `);

  $(".card").prepend(alertBox); // Show inside your card

  // Auto close after 2 seconds
  setTimeout(() => {
    alertBox.fadeOut(500, function() {
      $(this).remove();
    });
  }, 2000);
});

});
