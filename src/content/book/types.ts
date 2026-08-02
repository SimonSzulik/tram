import type { ComponentType } from "react";

export type PartId = "foundations" | "frontend" | "backend" | "analysis" | "advanced";

export interface Part {
  id: PartId;
  title: string;
  blurb: string;
}

export interface Chapter {
  /** URL slug, e.g. "lexical-analysis". */
  id: string;
  /** 1-based sequence number across the whole book. */
  number: number;
  part: PartId;
  title: string;
  /** One-line summary shown in the TOC and chapter header. */
  summary: string;
  /** "What you'll be able to do" bullets, shown at the top of the chapter. */
  objectives: string[];
  /** Fully written vs. an aligned outline placeholder. */
  status: "complete" | "outline";
  /** Where this maps in the Trier UAP lecture / projects. */
  lectureRef?: string;
  /** The chapter body. */
  Content: ComponentType;
}

export const PARTS: Part[] = [
  {
    id: "foundations",
    title: "Foundations",
    blurb: "What a compiler is, and the machine we ultimately translate to.",
  },
  {
    id: "frontend",
    title: "The Front End",
    blurb: "Turning source text into a structured, checked program representation.",
  },
  {
    id: "backend",
    title: "The Back End",
    blurb: "Generating code and running it with a real calling convention.",
  },
  {
    id: "analysis",
    title: "Analysis & Optimization",
    blurb: "Reasoning about programs to make them faster and smaller.",
  },
  {
    id: "advanced",
    title: "Advanced Topics",
    blurb: "Where compiler technology goes beyond a single translation.",
  },
];
