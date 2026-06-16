import { ApiResponse, PaginatedResponse } from "./types";

export interface AiUsageDTO {
  userId: number;
  period: string;
  chatRequests: number;
  quizGenerations: number;
  flashcardGenerations: number;
  estimatedTokens: number;
}

const mockAiUsage: AiUsageDTO[] = [
  {
    userId: 1,
    period: "2026-06",
    chatRequests: 32,
    quizGenerations: 5,
    flashcardGenerations: 3,
    estimatedTokens: 18500
  },
  {
    userId: 2,
    period: "2026-06",
    chatRequests: 12,
    quizGenerations: 1,
    flashcardGenerations: 0,
    estimatedTokens: 4200
  },
  {
    userId: 3,
    period: "2026-06",
    chatRequests: 56,
    quizGenerations: 10,
    flashcardGenerations: 8,
    estimatedTokens: 45000
  }
];

export const analyticsService = {
  adminGetAiUsage: async (): Promise<ApiResponse<PaginatedResponse<AiUsageDTO>>> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Success",
          data: {
            items: mockAiUsage,
            page: 0,
            size: 10,
            totalElements: mockAiUsage.length,
            totalPages: 1
          }
        });
      }, 500);
    });
  }
};
