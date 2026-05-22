import { create } from 'zustand';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface QuestionTypeRow {
  id: string;
  questionType: string;
  count: number;   // No. of questions
  marks: number;   // Marks per question
}

// ─── Constants ────────────────────────────────────────────────────────────────
export const QUESTION_TYPE_OPTIONS = [
  'Multiple Choice Questions',
  'Short Questions',
  'Long Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'True/False Questions',
  'Essay Questions',
] as const;

const DEFAULT_QUESTION_TYPES: QuestionTypeRow[] = [
  { id: 'q1', questionType: 'Multiple Choice Questions',      count: 4, marks: 1 },
  { id: 'q2', questionType: 'Short Questions',                count: 3, marks: 2 },
  { id: 'q3', questionType: 'Diagram/Graph-Based Questions',  count: 5, marks: 5 },
  { id: 'q4', questionType: 'Numerical Problems',             count: 5, marks: 5 },
];

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Store Interface ──────────────────────────────────────────────────────────
interface AssignmentFormState {
  /* Fields */
  uploadedFileName: string;
  dueDate: string;           // stored as YYYY-MM-DD (native date input value)
  questionTypes: QuestionTypeRow[];
  additionalInfo: string;

  /* Actions */
  setUploadedFileName: (name: string) => void;
  setDueDate: (date: string) => void;
  setAdditionalInfo: (info: string) => void;
  addQuestionType: () => void;
  removeQuestionType: (id: string) => void;
  updateQuestionType: (
    id: string,
    field: keyof Pick<QuestionTypeRow, 'questionType' | 'count' | 'marks'>,
    value: string | number
  ) => void;
  resetForm: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useAssignmentStore = create<AssignmentFormState>((set) => ({
  uploadedFileName: '',
  dueDate: '',
  questionTypes: DEFAULT_QUESTION_TYPES,
  additionalInfo: '',

  setUploadedFileName: (name) => set({ uploadedFileName: name }),
  setDueDate: (date) => set({ dueDate: date }),
  setAdditionalInfo: (info) => set({ additionalInfo: info }),

  addQuestionType: () =>
    set((s) => ({
      questionTypes: [
        ...s.questionTypes,
        { id: genId(), questionType: QUESTION_TYPE_OPTIONS[0], count: 1, marks: 1 },
      ],
    })),

  removeQuestionType: (id) =>
    set((s) => ({ questionTypes: s.questionTypes.filter((q) => q.id !== id) })),

  updateQuestionType: (id, field, value) =>
    set((s) => ({
      questionTypes: s.questionTypes.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      ),
    })),

  resetForm: () =>
    set({
      uploadedFileName: '',
      dueDate: '',
      questionTypes: DEFAULT_QUESTION_TYPES,
      additionalInfo: '',
    }),
}));
