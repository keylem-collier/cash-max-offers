const AUTOCOMPLETE_URL = "https://places.googleapis.com/v1/places:autocomplete";

// Downtown Atlanta. locationBias only ranks results, it never filters them, so a
// seller in Savannah still finds their address — just lower in the list.
const BIAS_CENTER = { latitude: 33.749, longitude: -84.388 };
const BIAS_RADIUS_METERS = 50000;

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY?.trim() ?? "";

export const MIN_QUERY_LENGTH = 4;
export const DEBOUNCE_MS = 200;
export const addressSuggestEnabled = Boolean(API_KEY);

export type TextMatch = { startOffset?: number; endOffset?: number };

export type AddressSuggestion = {
  placeId: string;
  main: string;
  mainMatches: TextMatch[];
  secondary: string;
  value: string;
};

export type HighlightSegment = { text: string; match: boolean };

export function autocompleteRequestBody(input: string) {
  return {
    input,
    includedPrimaryTypes: ["street_address", "premise", "subpremise"],
    includedRegionCodes: ["us"],
    locationBias: {
      circle: { center: BIAS_CENTER, radius: BIAS_RADIUS_METERS },
    },
    languageCode: "en",
  };
}

type RawSuggestion = {
  placePrediction?: {
    placeId?: string;
    structuredFormat?: {
      mainText?: { text?: string; matches?: TextMatch[] };
      secondaryText?: { text?: string };
    };
  };
};

export function parseAutocompleteResponse(payload: unknown): AddressSuggestion[] {
  const suggestions = (payload as { suggestions?: unknown })?.suggestions;

  if (!Array.isArray(suggestions)) {
    return [];
  }

  return (suggestions as RawSuggestion[]).flatMap((entry) => {
    const prediction = entry?.placePrediction;
    const format = prediction?.structuredFormat;
    const main = format?.mainText?.text?.trim() ?? "";

    if (!prediction?.placeId || !main) {
      return [];
    }

    // Google returns "Atlanta, GA, USA"; the country is noise on a Georgia-only site.
    const secondary = (format?.secondaryText?.text?.trim() ?? "").replace(
      /,\s*USA$/,
      "",
    );

    return [
      {
        placeId: prediction.placeId,
        main,
        mainMatches: Array.isArray(format?.mainText?.matches)
          ? format.mainText.matches
          : [],
        secondary,
        value: secondary ? `${main}, ${secondary}` : main,
      },
    ];
  });
}

export function highlightSegments(
  text: string,
  matches: TextMatch[],
): HighlightSegment[] {
  const ranges = matches
    .map((match) => ({
      // proto3 omits startOffset entirely when it is 0.
      start: Math.max(0, match.startOffset ?? 0),
      end: Math.min(text.length, match.endOffset ?? 0),
    }))
    .filter((range) => range.end > range.start)
    .sort((a, b) => a.start - b.start);

  const segments: HighlightSegment[] = [];
  let cursor = 0;

  for (const range of ranges) {
    if (range.end <= cursor) {
      continue;
    }

    if (range.start > cursor) {
      segments.push({ text: text.slice(cursor, range.start), match: false });
    }

    segments.push({
      text: text.slice(Math.max(range.start, cursor), range.end),
      match: true,
    });
    cursor = range.end;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), match: false });
  }

  return segments;
}

export async function fetchAddressSuggestions(
  input: string,
  signal: AbortSignal,
): Promise<AddressSuggestion[]> {
  const query = input.trim();

  if (!API_KEY || query.length < MIN_QUERY_LENGTH) {
    return [];
  }

  const response = await fetch(AUTOCOMPLETE_URL, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask":
        "suggestions.placePrediction.placeId,suggestions.placePrediction.structuredFormat",
    },
    body: JSON.stringify(autocompleteRequestBody(query)),
  });

  if (!response.ok) {
    throw new Error(`Places autocomplete failed with ${response.status}`);
  }

  return parseAutocompleteResponse(await response.json());
}
