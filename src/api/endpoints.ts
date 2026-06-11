import { api } from './client';
import type {
  User, Role, Test, Question, AnswerOption, SubmissionAnswer,
  Lecture, LectureMedia, TestDto, QuestionDto, AnswerOptionsDto,
  SubmissionAnswersDto, LectureDto,
} from './types';

// Users
export const users = {
  isActivated: (id: number) => api.get<boolean>(`/users/is_activated/${id}`),
  create: (body: Partial<User>) => api.post<User>('/users', body),
  update: (id: number, body: Partial<User>) => api.put<User>(`/users/${id}`, body),
  delete: (id: number) => api.delete<void>(`/users/${id}`),
  activate: (id: number) => api.put<boolean>(`/users/activate/${id}`),
  // NOTE: deactivate returns wrong value — trust HTTP 200, not body
  deactivate: (id: number) => api.put<boolean>(`/users/deactivate/${id}`),
  assignRole: (id: number, roleId: number) =>
    api.post<string>(`/users/${id}/assign-role/${roleId}`, {}),
};

// Roles
export const roles = {
  list: () => api.get<Role[]>('/roles'),
  get: (id: number) => api.get<Role>(`/roles/${id}`),
  create: (body: Partial<Role>) => api.post<Role>('/roles', body),
  update: (id: number, body: Partial<Role>) => api.put<Role>(`/roles/${id}`, body),
  delete: (id: number) => api.delete<void>(`/roles/${id}`),
};

// Tests
export const tests = {
  list: () => api.get<Test[]>('/tests'),
  get: (id: number) => api.get<Test>(`/tests/${id}`),
  create: (body: TestDto) => api.post<Test>('/tests', body),
  update: (id: number, body: TestDto) => api.put<Test>(`/tests/${id}`, body),
  delete: (id: number) => api.delete<void>(`/tests/${id}`),
};

// Questions — NOTE: GET /tests/questions may 500 due to Jackson bug
export const questions = {
  list: () => api.get<Question[]>('/tests/questions'),
  get: (id: number) => api.get<Question>(`/tests/questions/${id}`),
  create: (body: QuestionDto) => api.post<Question>('/tests/questions', body),
  delete: (id: number) => api.delete<void>(`/tests/questions/${id}`),
};

// Answer options
export const answerOptions = {
  list: () => api.get<AnswerOption[]>('/tests/answer-options'),
  get: (id: number) => api.get<AnswerOption>(`/tests/answer-options/${id}`),
  create: (body: AnswerOptionsDto) => api.post<AnswerOption>('/tests/answer-options', body),
};

// Submission answers — NOTE: POST silently drops selectedOption (backend bug)
export const submissionAnswers = {
  get: (id: number) => api.get<SubmissionAnswer>(`/tests/submission-answers/${id}`),
  create: (body: SubmissionAnswersDto) =>
    api.post<SubmissionAnswer>('/tests/submission-answers', body),
};

// Lectures
export const lectures = {
  create: (body: LectureDto) => api.post<Lecture>('/lectures', body),
  update: (id: number, body: LectureDto) => api.put<Lecture>(`/lectures/${id}`, body),
  delete: (id: number) => api.delete<void>(`/lectures/${id}`),
  assignMedia: (lectureId: number, body: Partial<LectureMedia>) =>
    api.post<void>(`/lectures/media/assign/${lectureId}`, body),
};
