import OpenAI from "openai";
import {config} from "firebase-functions";
import usersService from "../modules/users/users.service";
import promptsService from "../modules/chattings/prompts/prompts.service";
import {DEFAULT_PROMPTS, FireStorePromptType, PROMPTS} from "../modules/chattings/prompts/prompts.interface";
import {FireStoreChattingItemType} from "../modules/chattings/chatting-items/chatting.items.interface";

class OpenAIService {
  client = new OpenAI({apiKey: config().openai.apikey});

  async getResponseMessage(uid: string, prevSystemQuestion: string, patientsResponse: string) {
    const user = await usersService.findUserById(uid);

    if (!user) {
      return null;
    }

    const promptData = (await promptsService.getDocData(PROMPTS.responseMessagePrompt)) as FireStorePromptType;

    if (promptData) {
      return this.getResponse(`${promptData.contents} 환자의 특성: ${user.config} 이전의 질문: ${prevSystemQuestion} 환자의 대답: ${patientsResponse}`, "환자의 심리적 고통에 대한 원인과 해결방안을 알 수 있도록 질문해주세요");
    } else {
      return this.getResponse(`${DEFAULT_PROMPTS[PROMPTS.responseMessagePrompt]} 환자의 특성: ${user.config} 이전의 질문: ${prevSystemQuestion} 환자의 대답: ${patientsResponse}`, "환자의 심리적 고통에 대한 원인과 해결방안을 알 수 있도록 질문해주세요");
    }
  }

  async getTitleMessage(uid: string, chattingItems: FireStoreChattingItemType[]) {
    const user = await usersService.findUserById(uid);

    if (!user) {
      return null;
    }

    const promptData = (await promptsService.getDocData(PROMPTS.titleMessagePrompt)) as FireStorePromptType;

    if (promptData) {
      return this.getResponse(`${promptData.contents} 대화: ${JSON.stringify(chattingItems)} 환자의 특성: ${user.config}`, "환자가 겪는 증상의 정확한 심리학적 병명은 뭐지?");
    } else {
      return this.getResponse(`${DEFAULT_PROMPTS[PROMPTS.resultMessagePrompt]} 대화: ${JSON.stringify(chattingItems)} 환자의 특성: ${user.config}`, "환자가 겪는 증상의 정확한 심리학적 병명은 뭐지?");
    }
  }

  async getResultMessage(uid: string, chattingItems: FireStoreChattingItemType[]) {
    const user = await usersService.findUserById(uid);

    if (!user) {
      return null;
    }

    const promptData = (await promptsService.getDocData(PROMPTS.resultMessagePrompt)) as FireStorePromptType;

    if (promptData) {
      return this.getResponse(`${promptData.contents} 대화: ${JSON.stringify(chattingItems)} 환자의 특성: ${user.config}`, "환자의 증상에 대한 결론과 대처방안은 뭐지?");
    } else {
      return this.getResponse(`${DEFAULT_PROMPTS[PROMPTS.resultMessagePrompt]} 대화: ${JSON.stringify(chattingItems)} 환자의 특성: ${user.config}`, "환자의 증상에 대한 결론과 대처방안은 뭐지?");
    }
  }

  async getStartMessage(uid: string) {
    const user = await usersService.findUserById(uid);

    if (!user) {
      return null;
    }

    const promptData = await promptsService.getDocData(PROMPTS.counselStartMessagePrompt);

    if (!promptData) {
      return this.getResponse(DEFAULT_PROMPTS[PROMPTS.counselStartMessagePrompt] + user.config, "상담을 시작하고 싶어요. 고민을 물어봐 주세요");
    } else {
      const prompt = promptData as FireStorePromptType;

      return this.getResponse(prompt.contents + user.config, "상담을 시작하고 싶어요. 고민을 물어봐 주세요");
    }
  }

  getResponse(systemPrompt: string, message: string) {
    return this.client.chat.completions.create({
      model: "gpt-3.5-turbo",
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
