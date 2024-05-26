import OpenAI from "openai";
import {config} from "firebase-functions";
import usersService from "../modules/users/users.service";
import promptsService from "../modules/chattings/prompts/prompts.service";
import {FireStorePromptType, PROMPTS} from "../modules/chattings/prompts/prompts.interface";
import {ChattingStage, FireStoreChattingItemType, FireStoreChattingItemsType, getNextStage} from "../modules/chattings/chatting-items/chatting.items.interface";
import {PsychologicalIndexes, ServeyProblemItem} from "../modules/servey-results/servey-result.interface";
import template from "string-template";

const NODE_ENV = "DEV";

class OpenAIService {
  client = new OpenAI({apiKey: config().openai.apikey});

  async getResponseMessage(uid: string, prevSystemQuestion: string, patientsResponse: string, stage: ChattingStage) {
    const user = await usersService.findUserById(uid);

    if (!user) {
      return null;
    }

    const defaultPrompt = (await promptsService.getDocData(PROMPTS.counselDefaultPrompt)) as FireStorePromptType;

    const promptData = (await promptsService.getDocData(PROMPTS.responseMessagePrompt)) as FireStorePromptType;

    return this.getResponse(defaultPrompt.contents + template(promptData.contents, {stage: getNextStage(stage), config: user.config, prevSystemQuestion, patientsResponse}), "Please reponse appropriate for the purpose of the step. for the patient");
  }

  async getTitleMessage(uid: string, chattingItems: FireStoreChattingItemType[]) {
    const user = await usersService.findUserById(uid);

    if (!user) {
      return null;
    }

    const promptData = (await promptsService.getDocData(PROMPTS.titleMessagePrompt)) as FireStorePromptType;

    return this.getResponse(
      template(promptData.contents, {
        chattings: JSON.stringify(chattingItems),
        config: user.config,
      }),
      "What's the psychological disease that the patient is experiencing?",
    );
  }

  async getResultMessage(uid: string, chattingItems: FireStoreChattingItemType[]) {
    const user = await usersService.findUserById(uid);

    if (!user) {
      return null;
    }

    const defaultPrompt = (await promptsService.getDocData(PROMPTS.counselDefaultPrompt)) as FireStorePromptType;

    const promptData = (await promptsService.getDocData(PROMPTS.resultMessagePrompt)) as FireStorePromptType;

    return this.getResponse(
      defaultPrompt.contents +
        template(promptData.contents, {
          chattings: JSON.stringify(chattingItems),
          config: user.config,
        }),
      "Tell me about the tasks the patient needs to perform to improve.",
    );
  }

  async getStartMessage(uid: string) {
    const user = await usersService.findUserById(uid);

    if (!user) {
      return null;
    }

    const defaultPrompt = (await promptsService.getDocData(PROMPTS.counselDefaultPrompt)) as FireStorePromptType;

    const promptData = (await promptsService.getDocData(PROMPTS.counselStartMessagePrompt)) as FireStorePromptType;

    return this.getResponse(defaultPrompt.contents + promptData.contents + user.config, "I'd like to start a consultation. Please ask me your concerns");
  }

  async getServeyResultMessage(serveyResult: ServeyProblemItem[]) {
    const promptData = (await promptsService.getDocData(PROMPTS.serveyResultMessagePrompt)) as FireStorePromptType;

    const defaultPrompt = (await promptsService.getDocData(PROMPTS.counselDefaultPrompt)) as FireStorePromptType;

    return this.getResponse(defaultPrompt.contents + promptData.contents + serveyResult.map(({question, answer}) => question + " " + answer).join(), "Give the patient an appropriate answer");
  }

  async getServeyResultIndexes(serveyResult: ServeyProblemItem[]) {
    const promptData = (await promptsService.getDocData(PROMPTS.serveyResultIndexPrompt)) + serveyResult.map(({question, answer}) => question + " " + answer).join();

    const resultString = (await this.getResponse(promptData, "The format of the data is {anxietyIndex: number of the level of anxiety, depressionIndex: number of the level of depression, suicideIndex: number of the level of suicide} Please answer just only JSON in this format.")).choices[0].message.content;

    const res = resultString?.replace(/(```)|(json)/g, "") || "{anxietyIndex: 0, depressionIndex: 0, suicideIndex: 0}";

    try {
      return JSON.parse(res) as PsychologicalIndexes;
    } catch {
      return JSON.parse("{anxietyIndex: 30, depressionIndex: 30, suicideIndex: 10}") as PsychologicalIndexes;
    }
  }

  async findProblem(chattingItems: FireStoreChattingItemType[]) {
    const promptData = (await promptsService.getDocData(PROMPTS.findProblemPrompt)) as FireStorePromptType;

    return this.getResponse(template(promptData.contents, {chattings: chattingItems.map((c) => c.contents).join(" ")}), "Please answer the patient's difficulties in one sentence");
  }

  async findProblemKeyword(chattingItems: FireStoreChattingItemType[], problems: string[]) {
    const promptData = (await promptsService.getDocData(PROMPTS.findProblemKeywordPrompt)) as FireStorePromptType;

    return this.getResponse(template(promptData.contents, {chattings: chattingItems.map((c) => c.contents).join(" "), problems: problems.join(" ")}), "'Please answer the patient's difficulties in several keywords");
  }

  async findSolution(chattingItems: FireStoreChattingItemType[], problems: string[], keywords: string[]) {
    const promptData = (await promptsService.getDocData(PROMPTS.findSolutionPrompt)) as FireStorePromptType;

    return this.getResponse(template(promptData.contents, {chattings: chattingItems.map((c) => c.contents).join(" "), problems: problems.join(" "), keywords: keywords.join(" ")}), "'Please answer the patient's solution in one sentence");
  }

  async findValidSolution(chattingItems: FireStoreChattingItemType[], problems: string[], keywords: string[], solutions: string[]) {
    const promptData = (await promptsService.getDocData(PROMPTS.findValidSolutionPrompt)) as FireStorePromptType;

    return this.getResponse(template(promptData.contents, {chattings: chattingItems.map((c) => c.contents).join(" "), problems: problems.join(" "), keywords: keywords.join(" "), solutions: solutions.join(" ")}), "'Please answer the patient's valid solution in one sentence");
  }

  async findExternalHelp(chattingItems: FireStoreChattingItemType[], problems: string[], keywords: string[], solutions: string[], validSolutions: string[]) {
    const promptData = (await promptsService.getDocData(PROMPTS.findExternalHelpPrompt)) as FireStorePromptType;

    return this.getResponse(template(promptData.contents, {chattings: chattingItems.map((c) => c.contents).join(" "), problems: problems.join(" "), keywords: keywords.join(" "), solutions: solutions.join(" "), validSolutions: validSolutions.join(" ")}), "'Please answer the patient's external help in one sentence");
  }

  async findSubject(chattingItems: FireStoreChattingItemType[], problems: string[], keywords: string[], solutions: string[], validSolutions: string[], externalHelp: string[]) {
    const promptData = (await promptsService.getDocData(PROMPTS.findSubjectPrompt)) as FireStorePromptType;

    return this.getResponse(template(promptData.contents, {chattings: chattingItems.map((c) => c.contents).join(" "), problems: problems.join(" "), keywords: keywords.join(" "), solutions: solutions.join(" "), validSolutions: validSolutions.join(" "), externalHelp: externalHelp.join(" ")}), "'Please answer the patient's goal in three sentences");
  }

  async getUserConfig(chattingItems: FireStoreChattingItemsType) {
    const promptData = (await promptsService.getDocData(PROMPTS.userConfigPrompt)) as FireStorePromptType;

    return this.getResponse(template(promptData.contents, {chattings: chattingItems.items.map((c) => c.contents).join(" "), problems: chattingItems.problems.join(" "), keywords: chattingItems.keywords.join(" "), solutions: chattingItems.solutions.join(" "), validSolutions: chattingItems.validSolutions.join(" "), externalHelp: chattingItems.externalHelp.join(" "), subjects: chattingItems.subjects.join(" ")}), "Organize the patient's current status with 6 sentences");
  }

  getResponse(systemPrompt: string, message: string) {
    return this.client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });
  }
}

export default new OpenAIService();
