#!/usr/bin/env node

const fs = require("fs");
const readlineSync = require("readline-sync");
const _ = require("lodash");

// Function to load JSON files
function loadJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading file from disk: ${err}`);
    process.exit(1);
  }
}

// Function to check answer using regex (case insensitive)
function checkAnswer(userAnswer, correctAnswer) {
  const regex = new RegExp(`^${correctAnswer}$`, "i");
  return regex.test(userAnswer);
}

// Load riddles and answers
const riddles = loadJsonFile("./riddles/riddles.json");
const answers = loadJsonFile("./riddles/answers.json");

// Shuffle riddles
const shuffledRiddleIds = _.shuffle(Object.keys(riddles));

// Game variables
let score = 0;
let answered = 0;

// Dynamically import chalk
async function importChalk() {
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
