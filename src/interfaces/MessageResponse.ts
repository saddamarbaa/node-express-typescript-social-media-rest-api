export interface ResponseT<T> {
  data: T | null;
  success: boolean;
  error: boolean;
  message: string;
  status: number;
}

export default ResponseT;
