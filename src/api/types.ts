export interface Role {
  id: number;
  roleName: string;
}

export interface Activation {
  id: number;
  uuid: string;
  activated: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  createdAt: string;
  updatedAt?: string;
  roles?: Role[];
  activation?: Activation | null;
}

export interface AnswerOption {
  id: number;
  text: string;
  correct?: boolean;
  questionId?: number;
}

export interface Question {
  id: number;
  text: string;
  testId?: number;
  answerOptions?: AnswerOption[];
}

export interface Test {
  id: number;
  title: string;
  description?: string;
  questions?: Question[];
}

export interface Submission {
  id: number;
  userId?: number;
  testId?: number;
  submittedAt?: string;
}

// selectedOption will be null due to known backend bug
export interface SubmissionAnswer {
  id: number;
  submission?: Submission;
  question?: Question;
  selectedOption?: AnswerOption | null;
}

export interface LectureMedia {
  id: number;
  lectureId: number;
  mediaType: string;
  content: string;
  orderIndex: number;
}

export interface Lecture {
  id: number;
  title: string;
  description?: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  lectureMediaList?: LectureMedia[];
}

export interface TestDto {
  title: string;
  description?: string;
  createdBy: number;
}

export interface QuestionDto {
  testId: number;
  questionText: string;
  questionType: string;
  orderIndex: number;
}

export interface AnswerOptionsDto {
  questionId: number;
  optionText: string;
  isCorrect: boolean;
  orderIndex: number;
}

export interface SubmissionAnswersDto {
  submissionId: number;
  questionId: number;
  selectedOptionId: number;
}

export interface LectureDto {
  title: string;
  description?: string;
  createdBy: number;
}
