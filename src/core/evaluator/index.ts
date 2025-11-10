export { Environment } from '@core/evaluator/runtime/environment.js';
export {
  evaluateProgram,
  type EvaluateOptions,
  type EvaluateResult,
} from '@core/evaluator/exec/runner.js';
export {
  type RuntimeValue,
  type FunctionValue,
  isFunctionValue,
} from '@core/evaluator/runtime/values.js';
export { EvaluatorError } from '@core/evaluator/errors/errors.js';
