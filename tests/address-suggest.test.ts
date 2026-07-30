import assert from "node:assert/strict";
import test from "node:test";
import {
  autocompleteRequestBody,
  highlightSegments,
  parseAutocompleteResponse,
} from "../src/lib/address-suggest.ts";

const placesResponse = {
  suggestions: [
    {
      placePrediction: {
        placeId: "ChIJ_courtland",
        structuredFormat: {
          mainText: {
            text: "255 Courtland Street Northeast",
            matches: [{ endOffset: 3 }],
          },
          secondaryText: { text: "Atlanta, GA, USA" },
        },
      },
    },
    {
      placePrediction: {
        placeId: "ChIJ_park_place",
        structuredFormat: {
          mainText: { text: "25 Park Place", matches: [{ endOffset: 2 }] },
          secondaryText: { text: "Park Place Northeast, Atlanta, GA, USA" },
        },
      },
    },
  ],
};

test("parses address predictions and drops the country suffix", () => {
  const results = parseAutocompleteResponse(placesResponse);

  assert.equal(results.length, 2);
  assert.equal(results[0]!.main, "255 Courtland Street Northeast");
  assert.equal(results[0]!.secondary, "Atlanta, GA");
  assert.equal(results[0]!.value, "255 Courtland Street Northeast, Atlanta, GA");
  assert.equal(
    results[1]!.secondary,
    "Park Place Northeast, Atlanta, GA",
  );
});

test("ignores malformed predictions instead of rendering blank rows", () => {
  const results = parseAutocompleteResponse({
    suggestions: [
      { queryPrediction: { text: { text: "coffee near me" } } },
      { placePrediction: { placeId: "ChIJ_no_text" } },
      { placePrediction: { structuredFormat: { mainText: { text: "No id" } } } },
    ],
  });

  assert.deepEqual(results, []);
});

test("survives a response shape it does not recognize", () => {
  assert.deepEqual(parseAutocompleteResponse(null), []);
  assert.deepEqual(parseAutocompleteResponse({}), []);
  assert.deepEqual(parseAutocompleteResponse({ suggestions: "nope" }), []);
});

test("bolds the matched prefix when startOffset is omitted at zero", () => {
  const segments = highlightSegments("255 Courtland Street Northeast", [
    { endOffset: 3 },
  ]);

  assert.deepEqual(segments, [
    { text: "255", match: true },
    { text: " Courtland Street Northeast", match: false },
  ]);
});

test("highlights a match that starts mid-string", () => {
  const segments = highlightSegments("125 Peachtree", [
    { startOffset: 4, endOffset: 9 },
  ]);

  assert.deepEqual(segments, [
    { text: "125 ", match: false },
    { text: "Peach", match: true },
    { text: "tree", match: false },
  ]);
});

test("clamps overlapping and out-of-range match offsets", () => {
  const segments = highlightSegments("25 Park", [
    { startOffset: 0, endOffset: 2 },
    { startOffset: 1, endOffset: 2 },
    { startOffset: 3, endOffset: 999 },
  ]);

  assert.equal(segments.map((segment) => segment.text).join(""), "25 Park");
  assert.deepEqual(segments, [
    { text: "25", match: true },
    { text: " ", match: false },
    { text: "Park", match: true },
  ]);
});

test("returns the whole string unmatched when there are no matches", () => {
  assert.deepEqual(highlightSegments("25 Park", []), [
    { text: "25 Park", match: false },
  ]);
});

test("requests only street addresses biased to Atlanta", () => {
  const body = autocompleteRequestBody("255 court");

  assert.equal(body.input, "255 court");
  assert.deepEqual(body.includedRegionCodes, ["us"]);
  assert.deepEqual(body.includedPrimaryTypes, [
    "street_address",
    "premise",
    "subpremise",
  ]);
  assert.equal(body.locationBias.circle.center.latitude, 33.749);
});
