// Your CryptoCompare API key
export const apiKey =
  "5b24e0e8e8909e6716bf79e031748d9665f59b5e987ec09aa24336b87e7d0e22";

// Makes requests to CryptoCompare API
export async function makeApiRequest(path) {
  try {
    const url = new URL(`https://min-api.cryptocompare.com/${path}`);
    url.searchParams.append("api_key", apiKey);
    const response = await fetch(url.toString());
    return response.json();
  } catch (error) {
    throw new Error(`CryptoCompare request error: ${error.status}`);
  }
}

// Generates a symbol ID from a pair of the coins
export function generateSymbol(exchange, fromSymbol, toSymbol) {
  const short = `${fromSymbol}/${toSymbol}`;
  return {
    short,
  };
}

// Returns all parts of the symbol
export function parseFullSymbol(fullSymbol) {
  const match = fullSymbol.match(/^(\w+)\/(\w+)$/);
  if (!match) {
    return null;
  }
  return { fromSymbol: match[1], toSymbol: match[2] };
}
