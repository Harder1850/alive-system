/**
 * ALIVE System - Canonical Message Types
 * This file is THE LAW.
 */

export type ClientRole = 'host' | 'body';

export interface Observation {
  type: 'observation';
  source: string;
  modality: 'text' | 'voice' | 'url' | 'file';
  raw: any;
  meta?: Record<string, any>;
}

export interface RenderInstruction {
  type: 'render';
  canvas: 'text' | 'document' | 'dashboard' | 'viz' | 'blank';
  content: any;
}

export type InboundMessage = Observation;
export type OutboundMessage = RenderInstruction;
