export const PROMPT_COLLECTIONS = "Prompts";

export interface FireStorePromptType {
  contents: string;
  id: string;
}

export const PROMPTS = {
  counselStartMessagePrompt: "COUNSEL_START_MESSAGE_PROMPT",
  resultMessagePrompt: "RESULT_MESSAGE_PROMPT",
  titleMessagePrompt: "TITLE_MESSAGE_PROMPT",
  responseMessagePrompt: "RESPONSE_MESSAGE_PROMPT",
  serveyResultMessagePrompt: "SERVEY_RESULT_MESSAGE_PROMPT",
  serveyResultIndexPrompt: "SERVEY_RESULT_INDEX_PROMPT",
  counselDefaultPrompt: "COUNSEL_DEFAULT_PROMPT",
  findProblemPrompt: "FIND_PROBLEM_PROMPT",
  findProblemKeywordPrompt: "FIND_PROBLEM_KEYWORD_PROMPT",
  findSolutionPrompt: "FIND_SOLUTION_PROMPT",
  findValidSolutionPrompt: "FIND_VALID_SOLUTION_PROMPT",
  findExternalHelpPrompt: "FIND_EXTERNAL_HELP_PROMPT",
  findSubjectPrompt: "FIND_SUBJECT_PROMPT",
  userConfigPrompt: "USER_CONFIG_PROMPT",
} as const;

export type PromptType = (typeof PROMPTS)[keyof typeof PROMPTS];
