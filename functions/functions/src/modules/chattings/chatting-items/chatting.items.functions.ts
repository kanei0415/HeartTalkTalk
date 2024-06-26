import * as functions from "firebase-functions";
import {FUNCTUONS_REGION} from "../../../config/config";
import resultsService from "../results/results.service";
import {CHATTING_CALLECTIONS} from "../chatting.interface";
import {CHATTING_ITEMS_MAKE_RESULT_UNIT, CHATTING_ITEM_COLLECTIONS, CHATTING_STAGES, FireStoreChattingItemType, FireStoreChattingItemsType, getNextStage} from "./chatting.items.interface";
import {FireStoreResultsTypes} from "../results/results.interface";
import openaiService from "../../../lib/openai.service";
import usersService from "../../users/users.service";
import {FireStoreUserType} from "../../users/user.interface";
import {FieldValue, PartialWithFieldValue} from "firebase-admin/firestore";
import titlesService from "../titles/titles.service";
import {FireStoreTitleType} from "../titles/titles.interface";
import chattingItemsService from "./chatting.items.service";

export const ChattingItemOnUpdated = functions
  .region(FUNCTUONS_REGION)
  .runWith({timeoutSeconds: 120})
  .firestore.document(`${CHATTING_CALLECTIONS}/{uid}/${CHATTING_ITEM_COLLECTIONS}/{day}`)
  .onUpdate(async (change, context) => {
    const {uid, day} = context.params;

    const afterChattingItem = change.after.data() as FireStoreChattingItemsType;

    const resultRef = resultsService.getResultDocRef(uid, Number(day));

    const resultData = (await resultRef.get()).data() as FireStoreResultsTypes;

    if (!resultData) {
      return {
        success: false,
        message: `No Result Exist uid: ${uid} day: ${day}`,
      };
    }

    const systemSendItems = afterChattingItem.items.filter((item) => item.sender === "SYSTEM");

    if (afterChattingItem.items.length && afterChattingItem.items[afterChattingItem.items.length - 1].sender === "SYSTEM") {
      const configMessage = (await openaiService.getUserConfig(afterChattingItem)).choices[0].message.content;

      const userDocRef = usersService.getDocRefById(uid);

      userDocRef.set(
        {
          config: configMessage || "No config exists",
        } satisfies Partial<FireStoreUserType>,
        {merge: true},
      );
    }

    if (systemSendItems.length % CHATTING_ITEMS_MAKE_RESULT_UNIT === 0) {
      if (systemSendItems.length > resultData.items.length * CHATTING_ITEMS_MAKE_RESULT_UNIT) {
        const resultItems: FireStoreChattingItemType[] = [];

        while (resultItems.filter((item) => item.sender === "SYSTEM").length === CHATTING_ITEMS_MAKE_RESULT_UNIT) {
          const poppdItem = afterChattingItem.items.pop();

          if (!poppdItem) {
            break;
          }

          resultItems.push(poppdItem);
        }

        const resultCompletion = await openaiService.getResultMessage(uid, resultItems.reverse());

        if (!resultCompletion) {
          return {
            success: false,
            message: "No Completon Result Message From OpenAI",
          };
        }

        const resultMessage = resultCompletion.choices[0].message.content;

        if (!resultMessage) {
          return {
            success: false,
            message: "Nothing Is Completed Results Message Content From OpenAI",
          };
        }

        resultRef.set(
          {
            items: FieldValue.arrayUnion(resultMessage),
          },
          {merge: true},
        );

        const titleCompletion = await openaiService.getTitleMessage(uid, resultItems);

        if (!titleCompletion) {
          return {
            success: false,
            message: "No Completon Title Message From OpenAI",
          };
        }

        const titleMessage = titleCompletion.choices[0].message.content;

        if (!titleMessage) {
          return {
            success: false,
            message: "Nothing Is Completed Ttile Message Content From OpenAI",
          };
        }

        const titleDocRef = titlesService.getTitleDocRef(uid, Number(day));

        titleDocRef.set(
          {
            label: titleMessage,
          } satisfies Partial<FireStoreTitleType>,
          {merge: true},
        );

        return {
          success: true,
          message: "Result Has Been Added And User Config Updated",
        };
      }
    }

    return {
      success: true,
      message: "Nothing Is Needed",
    };
  });

export const ChattingResponseAdd = functions.region(FUNCTUONS_REGION).https.onCall(async (req) => {
  const {uid, day} = req as {uid: string; day: number};

  const chattingItemsDocRef = chattingItemsService.getDocRef(uid, day);

  const chattingItemsDocData = (await chattingItemsDocRef.get()).data();

  if (!chattingItemsDocData) {
    return {
      success: false,
      message: `No Such ChattingItems uid: ${uid} day: ${day}`,
    };
  }

  const chattingItems = chattingItemsDocData as FireStoreChattingItemsType;

  if (chattingItems.items[chattingItems.items.length - 1].sender === "SYSTEM") {
    return {
      success: false,
      message: `User's Response Messege Not Exist uid: ${uid} day: ${day}`,
    };
  }

  const userResponse: FireStoreChattingItemType[] = [];

  while (chattingItems.items.length > 0) {
    const lastItem = chattingItems.items.pop();

    if (lastItem === undefined) {
      break;
    }

    userResponse.push(lastItem);

    if (lastItem.sender === "SYSTEM") {
      break;
    }
  }

  const prevSenderMessage = userResponse.reverse().pop();

  if (!prevSenderMessage) {
    return {
      success: false,
      message: `User's Response Messege Not Exist uid: ${uid} day: ${day}`,
    };
  }

  let passedNextStage = true;

  if (chattingItems.stage === CHATTING_STAGES.FIND_PROBLEM_STAGE) {
    const problem = (await openaiService.findProblem(userResponse)).choices[0].message.content;

    if (problem) {
      passedNextStage = true;

      chattingItemsDocRef.set(
        {
          problems: FieldValue.arrayUnion(problem),
        } satisfies PartialWithFieldValue<FireStoreChattingItemsType>,
        {merge: true},
      );
    }
  }

  if (chattingItems.stage === CHATTING_STAGES.FIND_PROBLEM_KEYWORD_STAGE) {
    const keyword = (await openaiService.findProblemKeyword(userResponse, chattingItems.problems)).choices[0].message.content;

    if (keyword) {
      passedNextStage = true;

      chattingItemsDocRef.set(
        {
          keywords: FieldValue.arrayUnion(keyword),
        } satisfies PartialWithFieldValue<FireStoreChattingItemsType>,
        {merge: true},
      );
    }
  }

  if (chattingItems.stage === CHATTING_STAGES.FIND_SOLUTION_STAGE) {
    const solution = (await openaiService.findSolution(userResponse, chattingItems.problems, chattingItems.keywords)).choices[0].message.content;

    if (solution) {
      passedNextStage = true;

      chattingItemsDocRef.set(
        {
          solutions: FieldValue.arrayUnion(solution),
        } satisfies PartialWithFieldValue<FireStoreChattingItemsType>,
        {merge: true},
      );
    }
  }

  if (chattingItems.stage === CHATTING_STAGES.FIND_VALID_SOLUTION_STAGE) {
    const validSolution = (await openaiService.findValidSolution(userResponse, chattingItems.problems, chattingItems.keywords, chattingItems.solutions)).choices[0].message.content;

    if (validSolution) {
      passedNextStage = true;

      chattingItemsDocRef.set(
        {
          validSolutions: FieldValue.arrayUnion(validSolution),
        } satisfies PartialWithFieldValue<FireStoreChattingItemsType>,
        {merge: true},
      );
    }
  }

  if (chattingItems.stage === CHATTING_STAGES.FIND_EXTERNAL_HELP_STAGE) {
    const externalHelp = (await openaiService.findExternalHelp(userResponse, chattingItems.problems, chattingItems.keywords, chattingItems.solutions, chattingItems.validSolutions)).choices[0].message.content;

    if (externalHelp) {
      passedNextStage = true;

      chattingItemsDocRef.set(
        {
          externalHelp: FieldValue.arrayUnion(externalHelp),
        } satisfies PartialWithFieldValue<FireStoreChattingItemsType>,
        {merge: true},
      );
    }
  }

  if (chattingItems.stage === CHATTING_STAGES.FIND_SUBJECT_STAGE) {
    const subject = (await openaiService.findSubject(userResponse, chattingItems.problems, chattingItems.keywords, chattingItems.solutions, chattingItems.validSolutions, chattingItems.externalHelp)).choices[0].message.content;

    if (subject) {
      passedNextStage = true;

      chattingItemsDocRef.set(
        {
          subjects: FieldValue.arrayUnion(subject),
        } satisfies PartialWithFieldValue<FireStoreChattingItemsType>,
        {merge: true},
      );
    }
  }

  const responseCompletion = await openaiService.getResponseMessage(uid, prevSenderMessage.contents, userResponse.map((item) => item.contents).join("."), chattingItems.stage);

  if (!responseCompletion) {
    return {
      success: false,
      message: "Nothing Has Completed From OpenAI",
    };
  }

  const responseMessageContent = responseCompletion.choices[0].message.content;

  if (!responseMessageContent) {
    return {
      success: false,
      message: "No Such Choiced Response Message From OpenAI",
    };
  }

  chattingItemsDocRef.set(
    {
      items: FieldValue.arrayUnion({
        sender: "SYSTEM",
        contents: responseMessageContent,
      } satisfies FireStoreChattingItemType),
      stage: passedNextStage ? getNextStage(chattingItems.stage ?? CHATTING_STAGES.FIND_PROBLEM_STAGE) : chattingItems.stage,
    } satisfies PartialWithFieldValue<FireStoreChattingItemsType>,
    {merge: true},
  );

  return {
    success: true,
    message: "Add Message From OpenAI Is Successed",
  };
});
