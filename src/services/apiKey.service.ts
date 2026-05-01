import { ApiKeyRepository } from "@/repositories/apiKey.repo";
import { generateApiKey, hashApiKey } from "@/lib/hash";

export class ApiKeyService {
  static async createApiKey(userId: string, name: string) {
    const { key, maskedKey } = generateApiKey();
    const keyHash = hashApiKey(key);

    const apiKey = await ApiKeyRepository.create({
      keyHash,
      maskedKey,
      name,
      userId,
    });

    return {
      apiKey: key, // ONLY TIME THIS IS SHOWN
      id: apiKey.id,
      name: apiKey.name,
      maskedKey: apiKey.maskedKey,
      createdAt: apiKey.createdAt,
    };
  }

  static async getUserApiKeys(userId: string) {
    return ApiKeyRepository.findByUserId(userId);
  }

  static async revokeApiKey(id: string, userId: string) {
    // Basic authorization check could be done here if needed
    return ApiKeyRepository.revoke(id, userId);
  }

  static async validateApiKey(key: string) {
    const keyHash = hashApiKey(key);
    const apiKey = await ApiKeyRepository.findByHash(keyHash);

    if (!apiKey || !apiKey.isActive) {
      return null;
    }

    return apiKey;
  }
}
