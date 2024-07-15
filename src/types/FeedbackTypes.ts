export interface FeedbackPayload {
  orderId: string;
  comment: string;
  id?: string;
}
export interface AddFeedbackArgs {
  productId: string;
  data: FeedbackPayload;
}

export interface FeedbackFormPopupProps {
  title: string;
  submitText?: string;
  closeText?: string;
  body: React.ReactNode;
  trigger: React.ReactNode;
  onSubmit?: (data: FeedbackPayload) => void;
  onClose?: () => void;
}

export interface getFeedbackArgs {
  vendorId: string;
}

export interface Feedback {
  id: string;
  comment: string;
}

export interface Data {
  [key: string]: Feedback | string | number;
  comment: string;
  message: string;
}

export interface FeedbackFormProps {
  title: string;
  onSubmit?: (data: FeedbackPayload) => void;
  updateData?: Feedback;
  orderId: string;
}

export interface updateFeedbackArgs {
  comment: string;
}
