async function fetchDataAndRenderChart(
    apiEndpoint,
    chartElementId,
    chartConfig
  ) {
    try {
      let response = await fetch(apiEndpoint);
      let data = await response.json();
      const ctx = document.getElementById(chartElementId).getContext("2d");
      new Chart(ctx, chartConfig(data));
    } catch (error) {
      console.error("Error fetching or rendering chart:", error);
    }
  }
  
  fetchDataAndRenderChart("/api/orders_over_time", "ordersChart", (data) => ({
    type: "line",
    data: {
      labels: data.dates,
      datasets: [
        {
          label: "Number of Orders",
          data: data.counts,
          // ... other configPython
        },
      ],
    },
    // ... other options
  }));
  
  fetchDataAndRenderChart("/api/low_stock_levels", "stockChart", (data) => ({
    type: "bar",
    data: {
      labels: data.products,
      datasets: [
        {
          label: "Low Stock",
          data: data.quantities,
          // ... other config
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
        x: {
          display: false, // This will hide the x-axis labels
        },
      },
    },
  }));
  
  fetchDataAndRenderChart(
    "/api/most_popular_products",
    "popularProductsChart",
    (data) => ({
      type: "bar",
      data: {
        labels: data.products,
        datasets: [
          {
            label: "Quantity Sold",
            data: data.quantities,
            borderColor: "rgba(214, 129, 129, 0.89)",
            backgroundColor: "rgba(200, 0, 192, 0.2)",
            fill: false,
            // ... other config
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
          x: {
            display: false, // This will hide the x-axis labels
          },
        },
      },
    })
  );
  
  // Revenue Generation Over Time Chart
  fetchDataAndRenderChart(
    "api/revenue_generation",
    "revgen",
    (data) => ({
        type:"line",
        data: {
            labels: data.dates,
            datasets: [
                {
                    label: "Total Revenue Generated",
                    data: data.revenues,
                    borderColor: "rgba(132, 240, 98, 1)",
            backgroundColor: "rgba(0, 200, 7, 0.2)",
            fill: false,
                },
            ],
        },
    }));

// Product Category Popularity Chart
fetchDataAndRenderChart(
    "/api/product_category_popularity",
    "categoryPopularityChart",
    (data) => ({
      type: "pie",
      data: {
        labels: data.categories,
        datasets: [
          {
            label: "Total Sales",
            data: data.sales,
            // ... other config
          },
        ],
      },
    })
  );
  
  // Payment Method Popularity Chart
  fetchDataAndRenderChart(
    "/api/payment_method_popularity",
    "paymentMethodChart",
    (data) => ({
      type: "pie",
      data: {
        labels: data.methods,
        datasets: [
          {
            label: "Transaction Count",
            data: data.counts,
            // ... other config
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: false, // This will hide the x-axis labels
          },
        },
      },
    })
  );
  
  // Temperature Over Time Chart
  fetchDataAndRenderChart(
    "/api/temperature_over_time",
    "temperatureChart",
    (data) => ({
      type: "line",
      data: {
        labels: data.daily.time,
        datasets: [
          {
            label: "Temperature (°C)",
            data: data.daily.temperature_2m_max,
            borderColor: "rgba(255, 0, 0, 1)",
            backgroundColor: "rgba(200, 0, 192, 0.2)",
            fill: false,
          },
        ],
      },
      // ... other options can be added as needed
    })
  );