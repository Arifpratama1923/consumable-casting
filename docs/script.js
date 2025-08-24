async function getData() {
  const spreadsheetId = '17wvHJODwxePGHcjZQWKh_CKUp3gl9ZopRHUGyjHS5I4'
  const apiKey = 'AIzaSyB565bEsLwPtyiKXaQYH73T8u68N32Y-JE';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/?key=${apiKey}&includeGridData=true`;
  const result = await fetch(url)
  const { sheets } = await result.json();
  const data = []
  for (const sheet of sheets) {
    if (sheet.properties.title === 'originalsheet') {
      continue; // skip this sheet
    } else {
      const rowData = sheet.data[0].rowData;
      for (const [index, row] of rowData.entries()) {
        if (index === 0) continue; // skip header row
        const { values } = row;
        data.push({
          consumable: values[0]?.formattedValue || '',
          isi: values[1]?.formattedValue || '',
          tanggal: values[2]?.formattedValue || '',
          inputIsi: values[3]?.formattedValue || '',
          mesin: sheet.properties.title.split(' ')[1] || '' // get mesin number from sheet title
        });
      }
    }
  }
  return data;
}

const mesinSelect = document.getElementById("consumable-mesin");

  // loop from 1 to 65 and add options
for (let i = 1; i <= 65; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    mesinSelect.appendChild(option);
}

const searchMesinSelect = document.getElementById("consumable-search-mesin");

  // loop from 1 to 65 and add options
for (let i = 1; i <= 65; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    searchMesinSelect.appendChild(option);
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

const webAppUrl = "https://script.google.com/macros/s/AKfycbwa_E0U4XuqyAmINjtsYcL7QbOcWZqlihMBWh4m51hwqxoXiOIAGZtLHx3oFvy11Qpl-w/exec"
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

    $("form").trigger("reset");
});
});

// handle search
btnSearch.addEventListener("click", async () => {
  const selectedMesin = searchMesinSelect.value;
  if (!selectedMesin) {
    alert("⚠️ Pilih mesin dulu!");
    return;
  }

  // get data from Google Sheet
  const data = await getData(); // this already returns all data
  console.log('all data', data);

  // filter by mesin
  console.log('selectedMesin', selectedMesin);
  const filtered = data.filter(row => row.mesin === selectedMesin.toString());

  if (filtered.length === 0) {
    searchResult.innerHTML = `<div class="alert alert-warning">❌ Tidak ada data untuk Mesin ${selectedMesin}</div>`;
    return;
  }

  // build table
  let html = `<h5>Data Mesin ${selectedMesin}</h5>
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Consumable</th>
                    <th>ISI</th>
                    <th>Tanggal</th>
                    <th>Input ISI</th>
                  </tr>
                </thead>
                <tbody>`;
  filtered.forEach((row, idx) => {
    html += `<tr>
              <td>${idx + 1}</td>
              <td>${row.consumable}</td>
              <td>${row.isi}</td>
              <td>${row.tanggal}</td>
              <td>${row.inputIsi}</td>
            </tr>`;
  });
  html += `</tbody></table>`;

  searchResult.innerHTML = html;
});
