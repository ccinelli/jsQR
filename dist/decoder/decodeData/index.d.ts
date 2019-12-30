export interface StructuredAppendTag {
    M: number;
    N: number;
    parity: number;
}
export interface Chunk {
    type: Mode;
    text: string;
}
export interface StructuredAppendChunk extends StructuredAppendTag {
    type: Mode.StructuredAppend;
}
export interface ByteChunk {
    type: Mode.Byte | Mode.Kanji;
    bytes: number[];
}
export interface ECIChunk {
    type: Mode.ECI;
    assignmentNumber: number;
}
export declare type Chunks = Array<Chunk | StructuredAppendChunk | ByteChunk | ECIChunk>;
export interface DecodedQR {
    text: string;
    bytes: number[];
    chunks: Chunks;
    structuredAppend?: StructuredAppendTag;
}
export declare enum Mode {
    Numeric = "numeric",
    Alphanumeric = "alphanumeric",
    StructuredAppend = "structuredappend",
    Byte = "byte",
    Kanji = "kanji",
    ECI = "eci"
}
export declare function decode(data: Uint8ClampedArray, version: number): DecodedQR;
