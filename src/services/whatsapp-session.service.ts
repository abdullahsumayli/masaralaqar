/**
 * WhatsApp Session Service — خدمة إدارة جلسات الواتساب
 */

import { WhatsAppSessionRepository } from "@/repositories/whatsapp-session.repo";
import type {
    WhatsAppSession,
    WhatsAppSessionCreateInput,
} from "@/types/whatsapp-session";

export class WhatsAppSessionService {
  /** Connect a WhatsApp number to an office */
  static async connectPhone(
    input: WhatsAppSessionCreateInput,
  ): Promise<WhatsAppSession | null> {
    return WhatsAppSessionRepository.create(input);
  }

  /** Get session by office */
  static async getSessionByOffice(
    officeId: string,
  ): Promise<WhatsAppSession | null> {
    return WhatsAppSessionRepository.getByOfficeId(officeId);
  }

  /** Get session by phone number (used for incoming message routing) */
  static async getSessionByPhone(
    phone: string,
  ): Promise<WhatsAppSession | null> {
    return WhatsAppSessionRepository.getByPhone(phone);
  }

  /** Mark session as connected */
  static async markConnected(
    sessionId: string,
  ): Promise<WhatsAppSession | null> {
    return WhatsAppSessionRepository.updateStatus(sessionId, "connected");
  }

  /** Mark session as disconnected */
  static async markDisconnected(
    sessionId: string,
  ): Promise<WhatsAppSession | null> {
    return WhatsAppSessionRepository.updateStatus(sessionId, "disconnected");
  }

  /** Get all sessions (admin) */
  static async getAllSessions(filters?: {
    status?: string;
  }): Promise<WhatsAppSession[]> {
    return WhatsAppSessionRepository.getAll(filters);
  }

  /** Disconnect and remove session */
  static async disconnect(sessionId: string): Promise<boolean> {
    return WhatsAppSessionRepository.delete(sessionId);
  }

  /** Resolve office_id from incoming WhatsApp number */
  static async resolveOfficeFromPhone(phone: string): Promise<string | null> {
    const session = await WhatsAppSessionRepository.getByPhone(phone);
    return session?.officeId ?? null;
  }
}
