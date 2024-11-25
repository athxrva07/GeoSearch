document.getElementById('searchBtn').addEventListener('click', () => {
  // get the value entered in the search bar and remove any extra spaces
  const query = document.getElementById('searchBar').value.trim();
  
  // get the div element where country info will be displayed
  const countryInfoDiv = document.getElementById('countryInfo');
  
  // get the export button
  const exportBtn = document.getElementById('exportBtn');

  // check if the search bar is empty
  if (query === '') {
    // display a message asking for a country name
    countryInfoDiv.innerHTML = '<p>Please enter a country name.</p>';
    return;
  }

  // fetch country data from the API 
  fetch(`https://restcountries.com/v3.1/name/${query}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Country not found');  // error if country is not found
      }
      return response.json();  // parse the JSON data from the response
    })
    .then(data => {
      // extract the country data from the response
      const country = data[0];
      
      // get the capital
      const capital = country.capital ? country.capital[0] : 'N/A';

      // display the country information
      countryInfoDiv.innerHTML = `
        <h2>${country.name.common}</h2>  <!-- display the country name -->
        <div class="info-block"><strong>Region:</strong> ${country.region}</div>  <!-- display the region -->
        <div class="info-block"><strong>Population:</strong> ${country.population.toLocaleString()}</div>  <!-- display the population -->
        <div class="info-block"><strong>Capital:</strong> ${capital}</div>  <!-- display the capital -->
        <img src="${country.flags.png}" alt="Flag of ${country.name.common}">  <!-- display the flag -->
      `;

      // show the export button after the country info is fetched
      exportBtn.style.display = 'inline-block';

      // export to PDF when the Export button is clicked
      exportBtn.addEventListener('click', () => {
        // create a new jsPDF instance
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // font size for the title
        doc.setFontSize(16);
        doc.text(`Country Information: ${country.name.common}`, 10, 10);

        // font size for the details
        doc.setFontSize(12);
        doc.text(`Region: ${country.region}`, 10, 20);
        doc.text(`Population: ${country.population.toLocaleString()}`, 10, 30);
        doc.text(`Capital: ${capital}`, 10, 40);

        // add the flag image to the PDF
        doc.addImage(country.flags.png, 'PNG', 10, 50, 50, 30);

        // save the PDF file with the country name as the filename
        doc.save(`${country.name.common}.pdf`);
      });
    })
    .catch(error => {
      // display the error message
      countryInfoDiv.innerHTML = `<p>${error.message}</p>`;
    });
});
