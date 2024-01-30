export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export type Reaction = {
  type: 'error' | 'success' | 'not-performed';
  message: string;
};

export type FormAction = (
  prevState: Reaction | null,
  formData: FormData
) => Reaction | Promise<Reaction>;
