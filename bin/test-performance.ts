#!/usr/bin/env yarn node --import tsx

import c from "ansi-colors";

import { generatePlayableLevel } from "../src/game/level-creation/tactics";
import {
  getHard2Settings,
  getHardSettings,
} from "../src/game/level-settings/hardSettings";
import { LEVEL_SCALE } from "../src/game/level-settings/levelSettings";
import {
  getNormal2Settings,
  getNormal3Settings,
  getNormalSettings,
} from "../src/game/level-settings/normalSettings";
import {
  getSpecial1Settings,
  getSpecial2Settings,
  getSpecial3Settings,
  getSpecial4Settings,
  getSpecial5Settings,
} from "../src/game/level-settings/specialSettings";
import { SettingsProducer } from "../src/game/types";
import { mulberry32 } from "../src/support/random";

type Producer = {
  name: string;
  producer: SettingsProducer;
};

type TestResult = {
  runId: number;
  moves: number;
  attempts: number;
  cost: number;
  duration: number;
};

const TEST_RUNS = 10;

const SEED = 123456789123;

const random = mulberry32(SEED);

const average = (results: TestResult[], key: keyof TestResult) => {
  const sum = results.reduce((acc, r) => acc + r[key], 0);
  return sum / results.length;
};

const formatter = new Intl.NumberFormat("en-US");

const colorFormat = (
  value: number,
  { slow, postfix = "" }: { slow: number; postfix?: string }
) => {
  if (value > slow) {
    return c.red(formatter.format(value) + postfix);
  }
  return c.green(formatter.format(value) + postfix);
};

const testProducer = async (producer: SettingsProducer) => {
  const scale: number[] = [0, ...LEVEL_SCALE];

  for (let difficulty = 0; difficulty < scale.length; difficulty++) {
    const results: TestResult[] = [];

    for (let testRun = 0; testRun < TEST_RUNS; testRun++) {
      const start = Date.now();
      const settings = producer(difficulty + 1);
      const lvl = await generatePlayableLevel(settings, random);

      const end = Date.now();
      const duration = end - start;
      results.push({
        runId: testRun,
        moves: lvl.moves.length,
        cost: lvl.generationInformation?.cost || 0,
        attempts: lvl.generationInformation?.attempts || 0,
        duration,
      });
    }
    console.log(
      `  diff ${difficulty + 1} moves: ${average(results, "moves")}, attempts: ${colorFormat(average(results, "attempts"), { slow: 15 })}, duration: ${colorFormat(average(results, "duration"), { slow: 10_000, postfix: "ms" })}`
    );
  }
};

const main = async () => {
  console.log("Testing solver performance");

  const producers: Producer[] = [
    { name: "Normal1", producer: getNormalSettings },
    { name: "Normal2", producer: getNormal2Settings },
    { name: "Normal3", producer: getNormal3Settings },
    { name: "Special1", producer: getSpecial1Settings },
    { name: "Special2", producer: getSpecial2Settings },
    { name: "Special3", producer: getSpecial3Settings },
    { name: "Special4", producer: getSpecial4Settings },
    { name: "Special5", producer: getSpecial5Settings },
    { name: "Hard", producer: getHardSettings },
    { name: "Hard2", producer: getHard2Settings },
  ];

  for (const { name, producer } of producers) {
    console.log(c.bold(`Testing ${name}`));
    await testProducer(producer);
  }
};

main();
