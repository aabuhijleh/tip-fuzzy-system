import type { Input } from "./interface";

// 1. Fuzzification
function gaussianServiceQuality(x: number): {
  poor: number;
  good: number;
  excellent: number;
} {
  const sigma = 1.7;
  const poor = Math.exp(-Math.pow(x - 0, 2) / (2 * sigma * sigma));
  const good = Math.exp(-Math.pow(x - 5, 2) / (2 * sigma * sigma));
  const excellent = Math.exp(-Math.pow(x - 10, 2) / (2 * sigma * sigma));

  return { poor, good, excellent };
}

function trapezoidalFoodQuality(x: number) {
  let rancid = 0;
  let delicious = 0;

  if (x <= 3) {
    rancid = 1;
  } else if (x > 3 && x < 6) {
    rancid = (6 - x) / (6 - 3);
  }

  if (x > 4 && x < 7) {
    delicious = (x - 4) / (7 - 4);
  } else if (x >= 7 && x <= 10) {
    delicious = 1;
  }

  return { rancid, delicious };
}

// 2. Rule Evaluation
function evaluateRules(
  foodQuality: { rancid: number; delicious: number },
  serviceQuality: { poor: number; good: number; excellent: number }
) {
  const cheap = Math.max(serviceQuality.poor, foodQuality.rancid);
  const average = serviceQuality.good;
  const generous = Math.max(serviceQuality.excellent, foodQuality.delicious);

  return { cheap, average, generous };
}

// 3. Defuzzification
function defuzzify(output: {
  cheap: number;
  average: number;
  generous: number;
}): number {
  const cheapVertices = [0, 5, 10] as const;
  const averageVertices = [10, 15, 20] as const;
  const generousVertices = [20, 25, 30] as const;

  const xRange = Array.from({ length: 1000 }, (_, i) => (i * 30) / 999);

  const triangularMembership = (
    x: number,
    a: number,
    b: number,
    c: number
  ): number => {
    return Math.max(Math.min((x - a) / (b - a), (c - x) / (c - b)), 0);
  };

  let combinedMembership = xRange.map((x) => {
    const cheapMembership =
      triangularMembership(x, ...cheapVertices) * output.cheap;
    const averageMembership =
      triangularMembership(x, ...averageVertices) * output.average;
    const generousMembership =
      triangularMembership(x, ...generousVertices) * output.generous;
    return Math.max(cheapMembership, averageMembership, generousMembership);
  });

  const numerator = combinedMembership.reduce(
    (acc, membership, index) => acc + membership * xRange[index],
    0
  );
  const denominator = combinedMembership.reduce(
    (acc, membership) => acc + membership,
    0
  );

  return numerator / denominator;
}

export function calculateTip(input: Input): number {
  const serviceQuality = gaussianServiceQuality(input.serviceQuality);
  const foodQuality = trapezoidalFoodQuality(input.foodQuality);
  const output = evaluateRules(foodQuality, serviceQuality);
  const tip = defuzzify(output);
  return tip;
}
