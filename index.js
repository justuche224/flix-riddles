#!/usr/bin/env node

const readlineSync = require("readline-sync");
const axios = require("axios");
const _ = require("lodash");

// Function to fetch JSON data from a URL
async function fetchJsonData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}: ${error}`);
    process.exit(1);
  }
}

// Function to load riddles and answers data from GitHub
async function loadGameData() {
  const riddlesUrl =
    "https://raw.githubusercontent.com/justuche224/flix-riddles/main/riddles/riddles.json";
  const answersUrl =
    "https://raw.githubusercontent.com/justuche224/flix-riddles/main/riddles/answers.json";

  const riddles = await fetchJsonData(riddlesUrl);
  const answers = await fetchJsonData(answersUrl);

  return { riddles, answers };
}

// Function to check answer using regex (case insensitive)
function checkAnswer(userAnswer, correctAnswer) {
  const regex = new RegExp(`^${correctAnswer}$`, "i");
  return regex.test(userAnswer);
}

// Game variables
let score = 0;
let answered = 0;

// Dynamically import chalk
async function importChalk() {
  // Load riddles and answers
  const { riddles, answers } = await loadGameData();

  // Shuffle riddles
  const shuffledRiddleIds = _.shuffle(Object.keys(riddles));

  const { default: chalk } = await import("chalk");

  // Display welcome message
  console.log(chalk.cyan("Welcome to the Riddle Game!"));
  console.log(chalk.cyan("You will be presented with a series of riddles."));
  console.log(chalk.cyan("Try to guess the correct answer. Good luck!\n"));

  // Game logic
  for (const id of shuffledRiddleIds) {
    const riddle = riddles[id];
    const correctAnswer = answers[id];

    console.log(chalk.blue(`Riddle: ${riddle}`));

    // User answer input
    const userAnswer = readlineSync.question("Your answer: ");
    answered++;

    // Check answer
    if (checkAnswer(userAnswer, correctAnswer)) {
      console.log(chalk.green("Correct!\n"));
      score++;
    } else {
      console.log(
        chalk.red(`Incorrect. The correct answer is: ${correctAnswer}\n`)
      );
    }

    // Display current score
    console.log(chalk.magenta(`Current score: ${score}/${answered}\n`));
  }

  // Display final score
  console.log(
    chalk.magenta(`Game Over! Your final score is ${score} out of ${answered}`)
  );
  console.log("Thanks for playing!");
}

// Run the game
importChalk();
