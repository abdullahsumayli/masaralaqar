/**
 * Unanswered Questions Repository — طبقة الوصول لأسئلة بدون إجابة
 */

import { supabaseAdmin } from "@/lib/supabase";

export type UnansweredQuestionStatus = "pending" | "answered" | "ignored";

export interface UnansweredQuestion {
  id: string;
  officeId: string;
  question: string;
  askedByPhone: string | null;
  timesAsked: number;
  status: UnansweredQuestionStatus;
  answer: string | null;
  answeredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

function escapeLike(input: string): string {
  // Escape % and _ for SQL LIKE/ILIKE patterns
  return input.replace(/[%_]/g, "\\$&");
}

function normalizeQuestion(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[“”«»]/g, '"')
    .toLowerCase();
}

export class UnansweredQuestionsRepo {
  static format(row: Record<string, unknown>): UnansweredQuestion {
    return {
      id: row.id as string,
      officeId: row.office_id as string,
      question: row.question as string,
      askedByPhone: (row.asked_by_phone as string) || null,
      timesAsked: (row.times_asked as number) || 1,
      status: (row.status as UnansweredQuestionStatus) || "pending",
      answer: (row.answer as string) || null,
      answeredAt: (row.answered_at as string) || null,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }

  /**
   * saveQuestion:
   * - إذا وجد سؤال مشابه لنفس المكتب → increment times_asked
   * - وإلا → insert كسجل جديد
   */
  static async saveQuestion(
    officeId: string,
    question: string,
    phone?: string | null,
  ): Promise<UnansweredQuestion | null> {
    const cleaned = normalizeQuestion(question);
    if (!cleaned) return null;

    // محاولة إيجاد سؤال "مشابه" بشكل بسيط (ILIKE) داخل نفس المكتب
    const pattern = `%${escapeLike(cleaned)}%`;
    const { data: existing, error: findError } = await supabaseAdmin
      .from("unanswered_questions")
      .select("*")
      .eq("office_id", officeId)
      .ilike("question", pattern)
      .order("times_asked", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (findError) {
      console.error("Error finding unanswered question:", findError);
      // Fall through to insert a new row
    }

    if (existing?.id) {
      const { data: updated, error: updateError } = await supabaseAdmin
        .from("unanswered_questions")
        .update({
          times_asked: ((existing.times_asked as number) || 1) + 1,
          asked_by_phone: phone || (existing.asked_by_phone as string) || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (updateError || !updated) {
        console.error("Error updating unanswered question:", updateError);
        return null;
      }
      return this.format(updated);
    }

    const { data, error } = await supabaseAdmin
      .from("unanswered_questions")
      .insert({
        office_id: officeId,
        question: question.trim(),
        asked_by_phone: phone || null,
        times_asked: 1,
        status: "pending",
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Error inserting unanswered question:", error);
      return null;
    }
    return this.format(data);
  }

  static async getByOffice(
    officeId: string,
    status?: UnansweredQuestionStatus,
  ): Promise<UnansweredQuestion[]> {
    let query = supabaseAdmin
      .from("unanswered_questions")
      .select("*")
      .eq("office_id", officeId)
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error || !data) return [];
    return data.map((row) => this.format(row));
  }

  static async addAnswer(id: string, answer: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from("unanswered_questions")
      .update({
        answer,
        status: "answered",
        answered_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    return !error;
  }

  static async ignore(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from("unanswered_questions")
      .update({
        status: "ignored",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    return !error;
  }

  static async getAnsweredQuestions(officeId: string): Promise<
    Array<Pick<UnansweredQuestion, "id" | "question" | "answer">>
  > {
    const { data, error } = await supabaseAdmin
      .from("unanswered_questions")
      .select("id, question, answer")
      .eq("office_id", officeId)
      .eq("status", "answered")
      .not("answer", "is", null)
      .order("answered_at", { ascending: false });

    if (error || !data) return [];
    return (data as Array<Record<string, unknown>>).map((row) => ({
      id: row.id as string,
      question: row.question as string,
      answer: row.answer as string,
    }));
  }
}

