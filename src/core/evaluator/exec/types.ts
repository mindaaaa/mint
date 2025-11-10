import type { BlockStatementNode } from '@core/ast/nodes.js';
import type { Environment } from '@core/evaluator/runtime/environment.js';
import type { RuntimeValue } from '@core/evaluator/runtime/values.js';

export interface ExecutionContext {
  inFunction: boolean;
}

export interface EvaluationState {
  environment: Environment;
  context: ExecutionContext;
}

export interface PrintFn {
  (value: string): void;
}

export interface ReturnSignal {
  type: 'return';
  value: RuntimeValue;
}

export type BlockExecutor = (
  block: BlockStatementNode,
  environment: Environment,
  context: ExecutionContext
) => ReturnSignal | undefined;
