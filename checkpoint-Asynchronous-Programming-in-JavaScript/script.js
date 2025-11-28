// Task 01: Iterating with Async/Await

async function iterateWithAsyncAwait(values) {
  for (const value of values) {
    await new Promise((resolve, reject) =>
      setTimeout(() => {
        resolve(value);
      }, 1000)
    ); // Delay for 1 second
    console.log("Value: ", value);
  }
}

const values = [1, 2, 3, 4, 5];
iterateWithAsyncAwait(values);

// Task 02: Awaiting a Call

// Simulated function that fetches data from an API
async function fetchDataFromAPI() {
  // Simulate API call with a delay
  await new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve();
    }, 3000)
  ); // Simulate a 3-second delay
  return { data: "Some data fetched from the API" };
}

// Asynchronous function to await the API call and log the data
async function awaitCall() {
  try {
    const response = await fetchDataFromAPI(); // Wait for the API response
    console.log("Data received:", response.data);
  } catch (error) {
    console.error("Error fetching data from the API:", error);
  }
}

awaitCall();

// Task 03: Handling Errors with Async/Await

async function fetchDaTaFromAPI2() {
  // Simulate API call with a delay
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      reject(new Error("Failed to fetch data from the API"));
    }, 3000)
  ); // Simulate a 3-second delay
}

async function awaitCall2() {
  try {
    const response = await fetchDaTaFromAPI2(); // Wait for the API response
    return "Data received:", response.data;
  } catch (error) {
    console.error("Error received:", error.message);
  }
}

awaitCall2();

// Chained Async/Await Functions
async function chainedAsyncFunctions() {
  try {
    await firstAsyncFunction();
    await secondAsyncFunction();
    await thirdAsyncFunction();
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}
chainedAsyncFunctions();

// Sample async functions
async function firstAsyncFunction() {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(console.log("First async function completed."));
    }, 1000)
  );
}

async function secondAsyncFunction() {
  await new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve();
    }, 1000)
  );
  console.log("Second async function completed.");
}

async function thirdAsyncFunction() {
  await new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve();
    }, 1000)
  );
  console.log("Third async function completed.");
}

// Task 04: Awaiting Concurrent Requests

// Function simulating an asynchronous network request to API
function fetchDataFromAPI1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("API 1");
    }, 2000); // Simulate a 2-second delay for the response
  });
}

function fetchDataFromAPI2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("API 2");
    }, 3000); // Simulate a 3-second delay for the response
  });
}

// Using Promise.all to perform requests concurrently
async function fetchFromMultipleAPIs() {
  try {
    const [data1, data2] = await Promise.all([
      fetchDataFromAPI1(),
      fetchDataFromAPI2(),
    ]);

    console.log("Data from API :", data1);
    console.log("Data from API :", data2);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

fetchFromMultipleAPIs();

// Task 05: Awaiting Parallel Calls

async function parallelCalls(urls) {
  try {
    // Create an array of promises, each representing a fetch call to a URL
    const promises = urls.map((url) => fetch(url));

    // Use Promise.all() to wait for all promises to resolve
    const responses = await Promise.all(promises);
    console.log("Responses from parallel calls:", responses);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

const urls = [
  "https://jsonplaceholder.typicode.com/users",
  "https://jsonplaceholder.typicode.com/albums",
  "https://jsonplaceholder.typicode.com/photos",
];

parallelCalls(urls);
