import { Assignment, QuestionPaper } from '@/types';
import Link from 'next/link';

async function getResult(id: string): Promise<{ assignment: Assignment, questionPaper: QuestionPaper } | null> {
  try {
    const base = process.env.BACKEND_URL ?? 'http://localhost:5000';
    const res = await fetch(`${base}/api/assignments/${id}/result`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (err) {
    return null;
  }
}

export default async function AssignmentResultPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const data = await getResult(resolvedParams.id);

  if (!data || !data.questionPaper) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h1 className="text-xl font-bold mb-4">Paper Not Found or Still Generating</h1>
        <Link href="/assignments" className="text-blue-600 hover:underline">Return to Assignments</Link>
      </div>
    );
  }

  const { assignment, questionPaper } = data;

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4 md:p-8 flex justify-center items-start pb-24">
      {/* Outer Dark Container */}
      <div className="w-full max-w-[1000px] bg-[#2A2A2A] rounded-2xl md:rounded-[32px] p-4 md:p-6 lg:p-8 shadow-xl">
        
        {/* Dark Top Section Header */}
        <div className="text-white mb-6 md:mb-8 px-2 md:px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="font-sans text-[15px] md:text-base leading-relaxed flex-1">
            Certainly! Here is the customized Question Paper for your {assignment.subject || 'class'} on the requested topics:
          </p>
          <button className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-sans text-sm font-semibold hover:bg-gray-100 transition-colors shadow-sm shrink-0 w-fit">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download as PDF
          </button>
        </div>

        {/* White Paper Section */}
        <div className="bg-white rounded-xl md:rounded-[24px] p-6 md:p-12 lg:p-16 font-serif text-black min-h-[800px] shadow-inner">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">Delhi Public School, Sector-4, Bokaro</h1>
            <h2 className="text-xl md:text-2xl font-semibold mb-1">Subject: {assignment.subject || 'English'}</h2>
            <h3 className="text-lg md:text-xl font-semibold">Class: 5th</h3>
          </div>

          {/* Info Row */}
          <div className="flex justify-between items-end mb-6 font-semibold text-base md:text-lg">
            <div>Time Allowed: {questionPaper.duration || 45} minutes</div>
            <div>Maximum Marks: {questionPaper.totalMarks}</div>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <p className="font-bold text-base md:text-lg">All questions are compulsory unless stated otherwise.</p>
          </div>

          {/* Student Info Lines */}
          <div className="mb-12 space-y-4 text-base md:text-lg">
            <div>Name: ____________________________________</div>
            <div>Roll Number: ____________________________________</div>
            <div>Class: 5th Section: ____________________________________</div>
          </div>

          {/* Sections */}
          {questionPaper.sections.map((section, sIndex) => (
            <div key={section._id || sIndex} className="mb-12">
              <h4 className="text-xl md:text-2xl font-bold text-center mb-3">{section.title}</h4>
              {section.instructions && (
                <p className="text-center italic text-base md:text-lg mb-8 text-gray-800">{section.instructions}</p>
              )}

              {/* Added pl-8 and list-outside for proper number rendering */}
              <ol className="list-decimal list-outside pl-8 md:pl-10 space-y-6">
                {section.questions.map((q, qIndex) => (
                  <li key={q._id || qIndex} className="text-base md:text-lg leading-relaxed pl-2">
                    [{capitalize(q.difficulty)}] {q.text} [{q.marks} Marks]
                    
                    {q.options && q.options.length > 0 && (
                      <ul className="list-[lower-alpha] list-outside pl-8 mt-3 space-y-2">
                        {q.options.map((opt, oIndex) => (
                          <li key={oIndex} className="pl-1">{opt}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ))}

          <div className="font-bold text-base md:text-lg mt-12 mb-16">
            End of Question Paper
          </div>

          {/* Answer Key */}
          <div className="mt-16 pt-10 border-t-2 border-gray-300">
            <h4 className="text-xl md:text-2xl font-bold mb-8">Answer Key:</h4>
            {/* Added pl-8 and list-outside for proper number rendering */}
            <ol className="list-decimal list-outside pl-8 md:pl-10 space-y-6 text-base md:text-lg text-gray-800">
              {questionPaper.sections.flatMap(s => s.questions).map((q, qIndex) => (
                <li key={q._id || qIndex} className="pl-2 leading-relaxed">
                  {q.correctAnswer && <span className="font-bold text-black">{q.correctAnswer}. </span>}
                  {q.explanation && <span>{q.explanation}</span>}
                  {!q.correctAnswer && !q.explanation && <span>No answer provided.</span>}
                </li>
              ))}
            </ol>
          </div>
          
        </div>
      </div>
    </div>
  );
}
