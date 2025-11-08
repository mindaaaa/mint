export interface ProgramNode {
  type: 'Program';
  body: StatementNode[];
}

export type StatementNode =
  | VariableDeclarationNode
  | FunctionDeclarationNode
  | IfStatementNode
  | WhileStatementNode
  | ReturnStatementNode
  | SparkleStatementNode
  | ExpressionStatementNode
  | BlockStatementNode;

export type ExpressionNode =
  | IdentifierExpressionNode
  | LiteralExpressionNode
  | BinaryExpressionNode
  | AssignmentExpressionNode
  | CallExpressionNode
  | GroupingExpressionNode
  | UnaryExpressionNode;

export interface VariableDeclarationNode {
  type: 'VariableDeclaration';
  identifier: IdentifierExpressionNode;
  initializer?: ExpressionNode;
}

export interface FunctionDeclarationNode {
  type: 'FunctionDeclaration';
  name: IdentifierExpressionNode;
  params: IdentifierExpressionNode[];
  body: BlockStatementNode;
}

export interface IfStatementNode {
  type: 'IfStatement';
  condition: ExpressionNode;
  consequent: BlockStatementNode;
  alternate?: BlockStatementNode;
}

export interface WhileStatementNode {
  type: 'WhileStatement';
  condition: ExpressionNode;
  body: BlockStatementNode;
}

export interface ReturnStatementNode {
  type: 'ReturnStatement';
  argument?: ExpressionNode;
}

export interface SparkleStatementNode {
  type: 'SparkleStatement';
  expression: ExpressionNode;
}

export interface ExpressionStatementNode {
  type: 'ExpressionStatement';
  expression: ExpressionNode;
}

export interface BlockStatementNode {
  type: 'BlockStatement';
  body: StatementNode[];
}

export interface IdentifierExpressionNode {
  type: 'IdentifierExpression';
  name: string;
}

export interface LiteralExpressionNode {
  type: 'LiteralExpression';
  value: string | number | boolean | null;
}

export interface BinaryExpressionNode {
  type: 'BinaryExpression';
  operator: string;
  left: ExpressionNode;
  right: ExpressionNode;
}

export interface AssignmentExpressionNode {
  type: 'AssignmentExpression';
  identifier: IdentifierExpressionNode;
  value: ExpressionNode;
}

export interface CallExpressionNode {
  type: 'CallExpression';
  callee: ExpressionNode;
  args: ExpressionNode[];
}

export interface GroupingExpressionNode {
  type: 'GroupingExpression';
  expression: ExpressionNode;
}

export interface UnaryExpressionNode {
  type: 'UnaryExpression';
  operator: string;
  argument: ExpressionNode;
}
