export interface Question {
    id: number;
    quiz_id: number;
    text: string;
    type: 'multiple_choice' | 'true_false' | 'short_answer';
    options?: string[];
    correct_answer?: string;
    points: number;
  }
  