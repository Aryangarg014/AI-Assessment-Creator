import { Assignment, QuestionPaper } from '@/types';
import Link from 'next/link';

// ─── Data Fetching (unchanged) ────────────────────────────────────────────────
async function getResult(
  id: string,
): Promise<{ assignment: Assignment; questionPaper: QuestionPaper } | null> {
  try {
    const base = process.env.BACKEND_URL ?? 'http://localhost:5000';
    const res = await fetch(`${base}/api/assignments/${id}/result`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

/**
 * Returns the lower-alpha letter for an MCQ correct answer, e.g. "c"
 * Returns '' if the question is not MCQ or the answer can't be matched.
 */
function getOptionLetter(q: any): string {
  if (!q.options?.length || !q.correctAnswer) return '';
  const idx = q.options.findIndex(
    (opt: string) => opt.trim() === q.correctAnswer.trim(),
  );
  return idx === -1 ? '' : String.fromCharCode(97 + idx);
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default async function AssignmentResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getResult(id);

  if (!data?.questionPaper) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h1 className="text-xl font-bold mb-4">
          Paper Not Found or Still Generating
        </h1>
        <Link href="/assignments" className="text-blue-600 hover:underline">
          Return to Assignments
        </Link>
      </div>
    );
  }

  const { assignment, questionPaper } = data;

  return (
    /*
     * PAGE WRAPPER
     * ───────────────────────────────────────────────────────────────────────
     * This div is a direct child of <main> (the scroll container in layout.tsx).
     * It MUST NOT have overflow-hidden or min-h-full — those would fight the
     * parent's overflow-y-auto and make padding invisible.
     *
     * Instead: `w-full p-4 md:p-6` provides the gap between the content card
     * and the edges of the scroll container.  `pb-24` keeps items clear of
     * the mobile bottom nav.
     */
    <div className="w-full p-3 md:p-4 pb-20 flex flex-col items-center">
      {/*
       * DARK OUTER CARD
       * ─────────────────────────────────────────────────────────────────────
       * Contains the AI response message and the white question-paper card.
       * `w-full max-w-4xl` centres it and limits its maximum width.
       */}
      <div className="w-full max-w-4xl bg-[#252525] rounded-2xl md:rounded-3xl shadow-xl overflow-hidden">

        {/* ── Dark header: AI message + Download ──────────────────────── */}
        <div className="px-5 py-4 md:px-6 md:py-5 flex flex-col sm:flex-row sm:items-start gap-3">
          <p
            className="text-white text-sm md:text-base leading-relaxed flex-1"
            style={{ fontFamily: 'Segoe UI, system-ui, sans-serif' }}
          >
            Certainly! Here is the customized Question Paper for your{' '}
            <strong>{assignment.subject || 'class'}</strong> on the requested topics:
          </p>

          <button
            type="button"
            className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 active:scale-95 transition-all shadow-sm shrink-0 self-start"
            style={{ fontFamily: 'Segoe UI, system-ui, sans-serif' }}
          >
            {/* Download icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download as PDF
          </button>
        </div>

        {/*
         * WHITE QUESTION-PAPER CARD
         * ───────────────────────────────────────────────────────────────────
         * Simulates an MS Word / printed document.
         *
         * KEY FIX: `mx-4 mb-4 md:mx-6 md:mb-6` gives the card a visible gap
         * from the dark outer card's edges on all sides, so it "floats" inside.
         *
         * `p-8 md:p-12 lg:p-16` provides the ~1-inch margin simulation.
         * No negative margins anywhere inside.
         */}
        <div
          className="bg-white rounded-xl md:rounded-2xl mx-3 mb-3 md:mx-4 md:mb-4 p-6 md:p-10 text-black shadow-sm"
          style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}
        >
          {/* ── School / Exam Header ─────────────────────────────────── */}
          <div className="text-center mb-5">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 tracking-tight">
              Delhi Public School, Sector-4, Bokaro
            </h1>
            <p className="text-base md:text-lg font-semibold mb-0.5">
              Subject: {assignment.subject || 'English'}
            </p>
            <p className="text-sm md:text-base font-semibold">Class: 5th</p>
          </div>

          {/* ── Time / Marks ─────────────────────────────────────────── */}
          <div className="flex justify-between items-baseline mb-3 font-semibold text-sm md:text-base">
            <span>Time Allowed: {questionPaper.duration || 45} minutes</span>
            <span>Maximum Marks: {questionPaper.totalMarks}</span>
          </div>

          {/* ── General Instructions ──────────────────────────────────── */}
          <p className="font-bold text-sm md:text-base mb-4" style={{ lineHeight: '1.6' }}>
            All questions are compulsory unless stated otherwise.
          </p>

          {/* ── Student Details ──────────────────────────────────────── */}
          <div className="mb-6 space-y-2 text-sm md:text-base" style={{ lineHeight: '1.6' }}>
            <div>
              Name:{' '}
              <span className="inline-block border-b border-black w-44 md:w-60">&nbsp;</span>
            </div>
            <div>
              Roll Number:{' '}
              <span className="inline-block border-b border-black w-36 md:w-52">&nbsp;</span>
            </div>
            <div>
              Class: 5th &nbsp; Section:{' '}
              <span className="inline-block border-b border-black w-28 md:w-44">&nbsp;</span>
            </div>
          </div>

          {/* ── Question Sections ────────────────────────────────────── */}
          {questionPaper.sections.map((section, sIndex) => (
            <div key={section._id || sIndex} className="mb-6">

              {/* Section title */}
              <h2 className="text-lg md:text-xl font-bold text-center mb-2">
                {section.title}
              </h2>

              {/* Section instructions */}
              {section.instructions && (
                <p
                  className="text-center italic text-xs md:text-sm mb-4 text-gray-600"
                  style={{ lineHeight: '1.6' }}
                >
                  {section.instructions}
                </p>
              )}

              {/*
               * QUESTION LIST
               * ─────────────────────────────────────────────────────────
               * Using a manual flex-row layout instead of CSS list markers.
               *
               * WHY: `list-decimal list-inside` in Tailwind v4 can still
               * bleed the marker if the parent has padding constraints.
               * A flex layout with an explicit number span is bulletproof —
               * the number is always inside the white box.
               */}
              <div className="space-y-4">
                {section.questions.map((q, qIndex) => (
                  <div key={q._id || qIndex} className="flex gap-3 items-start">

                    {/* Number badge — always inside the padded container */}
                    <span
                      className="shrink-0 font-semibold text-sm md:text-base mt-0.5 w-7 text-right"
                    >
                      {qIndex + 1}.
                    </span>

                    {/* Question body */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm md:text-base text-black"
                        style={{ lineHeight: '1.6' }}
                      >
                        [{capitalize(q.difficulty)}] {q.text}{' '}
                        <span className="font-semibold">[{q.marks} Marks]</span>
                      </p>

                      {/* MCQ Options — indented under the question */}
                      {q.options && q.options.length > 0 && (
                        <div className="ml-1 mt-2 space-y-1">
                          {q.options.map((opt: string, oIndex: number) => (
                            <div
                              key={oIndex}
                              className="flex gap-2 items-start text-sm md:text-base"
                              style={{ lineHeight: '1.6' }}
                            >
                              <span className="shrink-0 w-6 text-right font-medium">
                                {String.fromCharCode(97 + oIndex)}.
                              </span>
                              <span className="flex-1">{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* ── End of Paper Marker ──────────────────────────────────── */}
          <div
            className="text-center font-bold text-sm md:text-base mt-8 mb-0"
            style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}
          >
            — End of Question Paper —
          </div>

          {/* ── Answer Key ───────────────────────────────────────────── */}
          {/*
           * mt-24 → large deliberate gap so the Answer Key feels like it is
           * on a separate "page" of the document.
           * border-t separates it visually from the paper body.
           */}
          <div className="mt-10 pt-5 border-t-2 border-gray-200">
            <h2
              className="text-lg md:text-xl font-bold mb-5"
              style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}
            >
              Answer Key:
            </h2>

            <div className="space-y-4">
              {questionPaper.sections
                .flatMap((s) => s.questions)
                .map((q, qIndex) => {
                  const letter = getOptionLetter(q);
                  return (
                    <div key={q._id || qIndex} className="flex gap-3 items-start">
                      {/* Number */}
                      <span className="shrink-0 font-semibold text-sm md:text-base mt-0.5 w-7 text-right text-gray-800">
                        {qIndex + 1}.
                      </span>

                      {/* Answer body */}
                      <div
                        className="flex-1 min-w-0 text-sm md:text-base text-gray-700"
                        style={{ lineHeight: '1.6' }}
                      >
                        {q.correctAnswer ? (
                          <>
                            {letter && (
                              <span className="font-bold text-black">
                                {letter}.{' '}
                              </span>
                            )}
                            <span className="font-bold text-black">
                              {q.correctAnswer}
                            </span>
                            {q.explanation && (
                              <span className="text-gray-600">
                                {' '}— {q.explanation}
                              </span>
                            )}
                          </>
                        ) : q.explanation ? (
                          <span>{q.explanation}</span>
                        ) : (
                          <span className="italic text-gray-400">
                            No answer provided.
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {/* end white paper card */}
      </div>
      {/* end dark outer card */}
    </div>
  );
}