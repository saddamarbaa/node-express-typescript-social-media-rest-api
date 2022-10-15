import MessageResponse from './MessageResponse';

export interface ErrorResponse extends MessageResponse<null> {
  stack?: string;
}

export default ErrorResponse;
