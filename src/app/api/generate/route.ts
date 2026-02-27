import { NextRequest, NextResponse } from "next/server";
import { buildPrompt } from "@/lib/prompt";
import { QuestData } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { problem } = await req.json();

    if (!problem || typeof problem !== "string") {
      return NextResponse.json(
        { error: "Please provide a problem description." },
        { status: 400 }
      );
    }

    const endpoint = process.env.AZURE_INFERENCE_ENDPOINT?.replace(/\/$/, "");
    const credential = process.env.AZURE_INFERENCE_CREDENTIAL;
    const model = process.env.LLM_MODEL || "gpt-4o";

    if (!endpoint || !credential) {
      return NextResponse.json(
        { error: "Server missing Azure OpenAI configuration. Check .env file." },
        { status: 500 }
      );
    }

    const prompt = buildPrompt(problem);
    const apiVersion = "2024-12-01-preview";
    const url = `${endpoint}/deployments/${model}/chat/completions?api-version=${apiVersion}`;

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": credential,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are an expert DSA teacher. You MUST respond with valid JSON only — no markdown, no commentary.",
          },
          { role: "user", content: prompt },
        ],
        max_completion_tokens: 16000,
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      const message =
        err?.error?.message || `Azure API returned ${resp.status}`;
      return NextResponse.json({ error: message }, { status: resp.status });
    }

    const data = await resp.json();
    const text: string | undefined = data.choices?.[0]?.message?.content;
    if (!text) {
      return NextResponse.json(
        { error: "Empty response from Azure OpenAI" },
        { status: 502 }
      );
    }

    let parsed: QuestData;
    try {
      const m = text.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("No JSON found");
      parsed = JSON.parse(m[0]);
    } catch {
      console.error("Raw LLM output:", text);
      return NextResponse.json(
        { error: "Failed to parse response. Try again." },
        { status: 502 }
      );
    }

    if (!parsed.title || !parsed.levels?.length) {
      return NextResponse.json(
        { error: "Invalid response structure. Try again." },
        { status: 502 }
      );
    }

    // Normalise sections
    parsed.levels.forEach((l) => {
      if (!Array.isArray(l.sections)) l.sections = [];
    });

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
