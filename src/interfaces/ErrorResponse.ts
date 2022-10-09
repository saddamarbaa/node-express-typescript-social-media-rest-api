import MessageResponse from './MessageResponse';

export default interface ErrorResponse extends MessageResponse<null> {
  stack?: string;
}