import {binarize} from "./binarizer";
import {BitMatrix} from "./BitMatrix";
import {Chunks, StructuredAppendTag} from "./decoder/decodeData";
import {decode} from "./decoder/decoder";
import {extract} from "./extractor";
import {locate, Point} from "./locator";

export interface QRCode {
  binaryData: number[];
  data: string;
  chunks: Chunks;
  structuredAppend?: StructuredAppendTag;
  location: {
    topRightCorner: Point;
    topLeftCorner: Point;
    bottomRightCorner: Point;
    bottomLeftCorner: Point;

    topRightFinderPattern: Point;
    topLeftFinderPattern: Point;
    bottomLeftFinderPattern: Point;

    bottomRightAlignmentPattern?: Point;
  };
}

function scan(matrix: BitMatrix): QRCode | null {
  const location = locate(matrix);
  if (!location) {
    return null;
  }
  const extracted = extract(matrix, location);
  const decoded = decode(extracted.matrix);

  if (!decoded) {
    return null;
  }

  return {
    binaryData: decoded.bytes,
    data: decoded.text,
    chunks: decoded.chunks,
    structuredAppend: decoded.structuredAppend,
    location: {
      topRightCorner: extracted.mappingFunction(location.dimension, 0),
      topLeftCorner: extracted.mappingFunction(0, 0),
      bottomRightCorner: extracted.mappingFunction(location.dimension, location.dimension),
      bottomLeftCorner: extracted.mappingFunction(0, location.dimension),

      topRightFinderPattern: location.topRight,
      topLeftFinderPattern: location.topLeft,
      bottomLeftFinderPattern: location.bottomLeft,

      bottomRightAlignmentPattern: location.alignmentPattern,
    },
  };
}

export interface Options {
  inversionAttempts?: "dontInvert" | "onlyInvert" | "attemptBoth" | "invertFirst";
  canOverwriteImage?: boolean;
}

const defaultOptions: Options = {
  inversionAttempts: "attemptBoth",
  canOverwriteImage: true,
};

function mergeObject(target: any, src: any) {
  Object.keys(src).forEach(opt => { // Sad implementation of Object.assign since we target es5 not es6
    target[opt] = src[opt];
  });
}

function jsQR(data: Uint8ClampedArray, width: number, height: number, providedOptions: Options = {}): QRCode | null {
  const options = Object.create(null);
  mergeObject(options, defaultOptions);
  mergeObject(options, providedOptions);

  const tryInvertedFirst = options.inversionAttempts === "onlyInvert" || options.inversionAttempts === "invertFirst";
  const shouldInvert = options.inversionAttempts === "attemptBoth" || tryInvertedFirst;
  const {binarized, inverted} = binarize(data, width, height, shouldInvert, options.canOverwriteImage);
  let result = scan(tryInvertedFirst ? inverted : binarized);
  if (!result && (options.inversionAttempts === "attemptBoth" || options.inversionAttempts === "invertFirst")) {
    result = scan(tryInvertedFirst ? binarized : inverted);
  }
  return result;
}

(jsQR as any).default = jsQR;
export default jsQR;
