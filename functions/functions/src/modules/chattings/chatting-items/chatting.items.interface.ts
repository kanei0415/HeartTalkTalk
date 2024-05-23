import {CHATTING_CALLECTIONS} from "../chatting.interface";

export const CHATTING_ITEM_COLLECTIONS = "ChattingItems";

export const chattingCollections = (uid: string) => `${CHATTING_CALLECTIONS}/${uid}/${CHATTING_ITEM_COLLECTIONS}`;

export interface FireStoreChattingItemType {
  contents: string;
  sender: "SYSTEM" | "USER";
}

export interface FireStoreChattingItemsType {
  items: FireStoreChattingItemType[];
  createdAt: number;
  problems: string[];
  keywords: string[];
  solutions: string[];
  validSolutions: string[];
  externalHelp: string[];
  subjects: string[];
  stage: ChattingStage;
}

export const CHATTING_ITEMS_MAKE_RESULT_UNIT = 10;

export const CHATTING_STAGES = {
  COUNSEL_START_STAGE: "COUNSEL_START_STAGE",
  FIND_PROBLEM_STAGE: "FIND_PROBLEM_STAGE",
  FIND_PROBLEM_KEYWORD_STAGE: "FIND_PROBLEM_KEYWORD_STAGE",
  FIND_SOLUTION_STAGE: "FIND_SOLUTION_STAGE",
  FIND_VALID_SOLUTION_STAGE: "FIND_VALID_SOLUTION_STAGE",
  FIND_EXTERNAL_HELP_STAGE: "FIND_EXTERNAL_HELP_STAGE",
  FIND_SUBJECT_STAGE: "FIND_SUBJECT_STAGE",
  COUNSEL_STAGE: "COUNSEL_STAGE",
} as const;

// prettier-ignore
export const getNextStage = (prev: ChattingStage): ChattingStage => {
  switch (prev) {
  case CHATTING_STAGES.COUNSEL_START_STAGE:
    return CHATTING_STAGES.FIND_PROBLEM_STAGE;

  case CHATTING_STAGES.FIND_PROBLEM_STAGE:
    return CHATTING_STAGES.FIND_PROBLEM_KEYWORD_STAGE;

  case CHATTING_STAGES.FIND_PROBLEM_KEYWORD_STAGE:
    return CHATTING_STAGES.FIND_SOLUTION_STAGE;

  case CHATTING_STAGES.FIND_SOLUTION_STAGE:
    return CHATTING_STAGES.FIND_VALID_SOLUTION_STAGE;

  case CHATTING_STAGES.FIND_VALID_SOLUTION_STAGE:
    return CHATTING_STAGES.FIND_EXTERNAL_HELP_STAGE;

  case CHATTING_STAGES.FIND_EXTERNAL_HELP_STAGE:
    return CHATTING_STAGES.FIND_SUBJECT_STAGE;

  case CHATTING_STAGES.FIND_SUBJECT_STAGE:
    return CHATTING_STAGES.COUNSEL_STAGE;

  default:
    return CHATTING_STAGES.COUNSEL_STAGE;
  }
};

export type ChattingStage = (typeof CHATTING_STAGES)[keyof typeof CHATTING_STAGES];
