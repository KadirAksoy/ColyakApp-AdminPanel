export interface Receipt {
  id: number;
  receiptName: string;
  createdDate: string;
  receiptDetails: string[];
  receiptItems: ReceiptItem[];
  nutritionalValuesList: NutritionalValue[];
  imageId: number;
  deleted: boolean;
}

export interface ReceiptItem {
  id: number;
  productName: string;
  unit: number;
  type: string;
}

export interface NutritionalValue {
  id: number;
  type: string;
  unit: number;
  fatAmount: number;
  carbohydrateAmount: number;
  proteinAmount: number;
  calorieAmount: number;
}

export interface Barcode {
  id: number;
  name: string;
  code: number;
  glutenFree: boolean;
  imageId: number;
  nutritionalValuesList: NutritionalValue[];
}

export interface ChoicesList {
  id: number;
  choice: string;
  imageId: number | null;
}

export interface QuestionList {
  id: number;
  question: string;
  choicesList: ChoicesList[];
  correctAnswer: string;
}

export interface Quiz {
  id: number;
  topicName: string;
  questionList: QuestionList[];
}

export interface User {
  userId: string;
  email: string;
  role: string[];
  userName: string;
}

export interface Suggestion {
  suggestionId: number;
  suggestion: string;
  userName: string;
  createdDate: string;
}
export interface BarcodeItem {
  foodItem: string;
  quantity: number;
}

export interface FoodResponse {
  foodType: string;
  carbonhydrate: number;
  foodName: string;
}

export interface Bolus {
  id: number;
  bloodSugar: number;
  targetBloodSugar: number;
  insulinTolerateFactor: number;
  totalCarbonhydrate: number;
  insulinCarbonhydrateRatio: number;
  bolusValue: number;
  eatingTime: string;
}

export interface Comment {
  commentId: number;
  userName: string;
  receiptName: string;
  createdDate: string;
  comment: string;
}

export interface QuizResult {
  userId: number;
  questionId: number;
  chosenAnswer: string;
  userName: string;
  questionText: string;
  correctAnswer: string;
  correct: boolean;
}

export interface bolus {
  id: number;
  bloodSugar: number;
  targetBloodSugar: number;
  insulinTolerateFactor: number;
  totalCarbonhydrate: number;
  insulinCarbonhydrateRatio: number;
  bolusValue: number;
  eatingTime: string;
}

export interface foodResponseList {
  foodType: string;
  carbonhydrate: number;
  foodName: string;
}

export interface BolusReport {
  userName: string;
  bolus: bolus;
  foodResponseList: foodResponseList[];
  dateTime: string;
}

export interface Report {
  [key: string]: number;
}
