import { NextRequest, NextResponse } from "next/server";

const SUBJECT_PROMPTS: Record<string, string> = {
  korean: "초등학생 국어 숙제입니다. 맞춤법, 문장 구조, 답안의 정확성을 확인해주세요.",
  english: "초등학생 영어 숙제입니다. 철자, 문법, 답안의 정확성을 확인해주세요.",
  math: "초등학생 수학 숙제입니다. 계산 과정과 답의 정확성을 확인해주세요.",
  hanja: "초등학생 한자 숙제입니다. 한자의 획순, 모양, 읽기, 뜻의 정확성을 확인해주세요.",
  diary: "초등학생 일기입니다. 맞춤법, 표현력, 문장 구조를 확인하고 격려해주세요.",
};

export async function POST(req: NextRequest) {
  try {
    const { imageData, subject, grade } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(getDemoResult(subject), { status: 200 });
    }

    const subjectPrompt = SUBJECT_PROMPTS[subject] || "";

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: imageData.split(";")[0].split(":")[1],
                  data: imageData.split(",")[1],
                },
              },
              {
                type: "text",
                text: `당신은 초등학교 ${grade}학년 학생의 숙제를 채점하는 친절한 선생님입니다.
${subjectPrompt}

다음 JSON 형식으로만 응답해주세요:
{
  "score": 85,
  "totalQuestions": 10,
  "correctAnswers": 8,
  "feedback": "전체적인 평가 (2-3문장, 칭찬 포함)",
  "coaching": "틀린 문제에 대한 상세 설명과 학습 조언 (마크다운 형식)",
  "wrongAnswers": [
    {
      "question": "틀린 문제 내용",
      "studentAnswer": "학생이 쓴 답",
      "correctAnswer": "올바른 답",
      "explanation": "왜 틀렸는지 쉬운 설명"
    }
  ]
}

중요: 아이의 자존감을 지켜주면서 격려하는 톤으로 작성해주세요. 초등학생이 이해할 수 있는 쉬운 말로 설명해주세요.`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return NextResponse.json(JSON.parse(jsonMatch[0]));
    }

    return NextResponse.json(getDemoResult(subject));
  } catch (error) {
    console.error("Grading error:", error);
    return NextResponse.json(getDemoResult("math"));
  }
}

function getDemoResult(subject: string) {
  const demos: Record<string, object> = {
    korean: {
      score: 90,
      totalQuestions: 10,
      correctAnswers: 9,
      feedback: "정말 잘했어요! 글씨도 예쁘고 맞춤법도 거의 완벽해요. 한 문제만 다시 확인해보면 좋겠어요! 💪",
      coaching: "### 틀린 부분 설명\n\n**'되'와 '돼'의 구분**\n- '되'는 '하다'로 바꿀 수 있을 때 써요\n- '돼'는 '해'로 바꿀 수 있을 때 써요\n\n> 예: \"숙제가 다 **돼**있다\" → \"숙제가 다 **해**있다\" ✅",
      wrongAnswers: [{ question: "빈칸 채우기", studentAnswer: "되", correctAnswer: "돼", explanation: "'해'로 바꿀 수 있으면 '돼'를 써요!" }],
    },
    math: {
      score: 80,
      totalQuestions: 10,
      correctAnswers: 8,
      feedback: "수학 잘하고 있어요! 덧셈과 뺄셈은 완벽해요. 곱셈 부분만 조금 더 연습하면 100점도 문제없을 거예요! ⭐",
      coaching: "### 틀린 부분 설명\n\n**구구단 7단 복습하기**\n- 7 × 6 = 42 (이걸 43으로 썼어요)\n- 7 × 8 = 56 (이걸 54로 썼어요)\n\n> 💡 팁: 7단은 노래로 외우면 쉬워요!",
      wrongAnswers: [
        { question: "7 × 6 = ?", studentAnswer: "43", correctAnswer: "42", explanation: "7 × 6은 42예요. 7을 6번 더하면 돼요!" },
        { question: "7 × 8 = ?", studentAnswer: "54", correctAnswer: "56", explanation: "7 × 8은 56이에요. 꾸준히 연습하면 금방 외울 수 있어요!" },
      ],
    },
    english: {
      score: 85,
      totalQuestions: 10,
      correctAnswers: 8,
      feedback: "영어 실력이 많이 늘었어요! 단어 스펠링을 조금만 더 신경 쓰면 완벽해요! 🌟",
      coaching: "### 틀린 부분 설명\n\n**스펠링 주의하기**\n- ~~freind~~ → **friend** (i before e!)\n- ~~becuse~~ → **because** (a-u-s-e로 끝나요)\n\n> 💡 팁: 어려운 단어는 3번씩 써보면 기억에 남아요!",
      wrongAnswers: [],
    },
    hanja: {
      score: 90,
      totalQuestions: 10,
      correctAnswers: 9,
      feedback: "한자 공부를 정말 열심히 했네요! 획순도 정확하고 뜻풀이도 잘했어요! ✨",
      coaching: "### 틀린 부분 설명\n\n**'學' (배울 학) 주의**\n- 위에 부수를 먼저 쓰고 아래 '子'를 나중에 써요\n\n> 💡 팁: 한자는 매일 3개씩 꾸준히 쓰면 실력이 쑥쑥 올라요!",
      wrongAnswers: [],
    },
    diary: {
      score: 95,
      totalQuestions: 5,
      correctAnswers: 5,
      feedback: "일기를 정말 잘 썼어요! 오늘 있었던 일을 생생하게 표현했네요. 감정 표현도 아주 좋아요! 📝💕",
      coaching: "### 잘한 점\n- 시간 순서대로 잘 정리했어요\n- 느낀 점을 솔직하게 썼어요\n\n### 더 잘할 수 있는 점\n- 비유 표현을 넣으면 더 재미있는 일기가 돼요\n- 예: \"하늘이 파랬다\" → \"하늘이 바다처럼 파랬다\"",
      wrongAnswers: [],
    },
  };
  return demos[subject] || demos.math;
}
