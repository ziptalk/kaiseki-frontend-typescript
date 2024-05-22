import { MongoClient } from "mongodb";
import BigNumber from "bignumber.js";

// MongoDB connection URI and database name
const mongoUri =
  "mongodb+srv://0xshadyr6:8s87LlNQwPLSq6Is@memcluster0.gritk35.mongodb.net/MemCluster0?retryWrites=true&w=majority";
const dbName = "MemCluster0";

// Interfaces for the events and BondInfo
interface MintEvent {
  receiver: string;
  token: string;
  amountMinted: { _hex: string };
}

interface BurnEvent {
  receiver: string;
  token: string;
  amountBurned: { _hex: string };
}

interface BondInfo {
  token: string;
  currentSupply: string;
}

// Function to fetch mint events by receiver address from the database
async function fetchMintEventsByReceiver(
  receiverAddress: string,
): Promise<MintEvent[]> {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const mintCollection = db.collection<MintEvent>("mintEvents");
    const query = { receiver: receiverAddress };
    const mintEvents = await mintCollection.find(query).toArray();
    return mintEvents;
  } finally {
    await client.close();
  }
}

// Function to fetch burn events by receiver address from the database
async function fetchBurnEventsByReceiver(
  receiverAddress: string,
): Promise<BurnEvent[]> {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const burnCollection = db.collection<BurnEvent>("burnEvents");
    const query = { receiver: receiverAddress };
    const burnEvents = await burnCollection.find(query).toArray();
    return burnEvents;
  } finally {
    await client.close();
  }
}

// Function to fetch unique receivers from both mint and burn events
async function fetchUniqueReceivers(): Promise<string[]> {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const mintCollection = db.collection<MintEvent>("mintEvents");
    const burnCollection = db.collection<BurnEvent>("burnEvents");
    const mintReceivers = await mintCollection.distinct("receiver");
    const burnReceivers = await burnCollection.distinct("receiver");
    const uniqueReceivers = [...new Set([...mintReceivers, ...burnReceivers])];
    return uniqueReceivers;
  } finally {
    await client.close();
  }
}

// Function to fetch current supply for each token from BondInfoAllTokns collection
async function fetchCurrentSupply(): Promise<{ [token: string]: BigNumber }> {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const bondInfoCollection = db.collection<BondInfo>("BondInfoAllTokns");
    const currentSupplies = await bondInfoCollection.find({}).toArray();
    const supplyMap: { [token: string]: BigNumber } = {};
    currentSupplies.forEach((info) => {
      supplyMap[info.token] = new BigNumber(info.currentSupply);
    });
    return supplyMap;
  } finally {
    await client.close();
  }
}

// Main function to calculate percentages of mint amounts held by each receiver after accounting for burns
export default async function main() {
  const uniqueReceivers = await fetchUniqueReceivers();
  const eventsByReceiver: {
    [receiver: string]: { mintEvents: MintEvent[]; burnEvents: BurnEvent[] };
  } = {};

  for (const receiver of uniqueReceivers) {
    const mintEvents = await fetchMintEventsByReceiver(receiver);
    const burnEvents = await fetchBurnEventsByReceiver(receiver);
    eventsByReceiver[receiver] = { mintEvents, burnEvents };
  }

  const currentSupplyMap = await fetchCurrentSupply();
  const totalMintAmounts: { [token: string]: BigNumber } = {};
  const totalBurnAmounts: { [token: string]: BigNumber } = {};
  const remainingAmounts: {
    [token: string]: { [receiver: string]: BigNumber };
  } = {};

  for (const receiver in eventsByReceiver) {
    const { mintEvents, burnEvents } = eventsByReceiver[receiver];

    for (const event of mintEvents) {
      const token = event.token;
      let amountMinted = new BigNumber(0);

      if (
        event.amountMinted &&
        typeof event.amountMinted === "object" &&
        event.amountMinted._hex
      ) {
        amountMinted = new BigNumber(event.amountMinted._hex);
      }

      if (!totalMintAmounts[token]) {
        totalMintAmounts[token] = new BigNumber(0);
      }
      totalMintAmounts[token] = totalMintAmounts[token].plus(amountMinted);

      if (!remainingAmounts[token]) {
        remainingAmounts[token] = {};
      }
      if (!remainingAmounts[token][receiver]) {
        remainingAmounts[token][receiver] = new BigNumber(0);
      }
      remainingAmounts[token][receiver] =
        remainingAmounts[token][receiver].plus(amountMinted);
    }

    for (const event of burnEvents) {
      const token = event.token;
      let amountBurned = new BigNumber(0);

      if (
        event.amountBurned &&
        typeof event.amountBurned === "object" &&
        event.amountBurned._hex
      ) {
        amountBurned = new BigNumber(event.amountBurned._hex);
      }

      if (!totalBurnAmounts[token]) {
        totalBurnAmounts[token] = new BigNumber(0);
      }
      totalBurnAmounts[token] = totalBurnAmounts[token].plus(amountBurned);

      if (!remainingAmounts[token]) {
        remainingAmounts[token] = {};
      }
      if (!remainingAmounts[token][receiver]) {
        remainingAmounts[token][receiver] = new BigNumber(0);
      }
      remainingAmounts[token][receiver] =
        remainingAmounts[token][receiver].minus(amountBurned);
    }
  }

  const percentages: { [token: string]: { [receiver: string]: string } } = {};

  for (const token in remainingAmounts) {
    percentages[token] = {};
    const totalMint = totalMintAmounts[token] || new BigNumber(0);
    const totalBurn = totalBurnAmounts[token] || new BigNumber(0);
    const currentSupply = currentSupplyMap[token] || new BigNumber(0);
    const totalSupply = currentSupply.plus(totalMint).minus(totalBurn);

    for (const receiver in remainingAmounts[token]) {
      const remainingAmount = remainingAmounts[token][receiver];
      const percentage = remainingAmount
        .multipliedBy(100)
        .dividedBy(totalSupply)
        .toFixed(18); // Use 18 decimal places for higher precision
      percentages[token][receiver] = percentage;
    }
  }

  console.log(
    "Percentages of mint amounts held by each receiver after accounting for burns:",
    percentages,
  );

  return percentages;
}

// Calling the main function
main().catch(console.error);
