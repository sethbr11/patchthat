// renderer.js
window.addEventListener("DOMContentLoaded", () => {
  const scanBtn = document.getElementById("scanBtn");
  const tableBody = document.querySelector("#servicesTable tbody");
  const tableHead = document.querySelector("#servicesTable thead tr");

  scanBtn.addEventListener("click", async () => {
    try {
      // Fetch the JSON string from the main process and parse it
      const jsonString = await window.electronAPI.getServices();
      const services = JSON.parse(jsonString);

      // Clear existing rows
      tableHead.innerHTML = "";
      tableBody.innerHTML = "";

      // Dynamically generate table headers based on the first service object
      if (services.length > 0) {
        Object.keys(services[0]).forEach((key) => {
          const th = document.createElement("th");
          th.textContent = key.charAt(0).toUpperCase() + key.slice(1);
          tableHead.appendChild(th);
        });
      }

      // Populate table rows based on the services array
      services.forEach((service) => {
        const row = document.createElement("tr");
        Object.values(service).forEach((value) => {
          const cell = document.createElement("td");
          cell.textContent = value;
          row.appendChild(cell);
        });
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error("Error fetching services:", error);
      const errorRow = document.createElement("tr");
      const errorCell = document.createElement("td");
      errorCell.colSpan = Object.keys(services[0] || {}).length;
      errorCell.textContent = `Error fetching services: ${error}`;
      errorRow.appendChild(errorCell);
      tableBody.appendChild(errorRow);
    }
  });
});
