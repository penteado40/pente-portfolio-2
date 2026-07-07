export type Testimonial = {
  author: string;
  roleCompany: string;
  message: string;
};

export type ApprovedTestimonial = {
  id: number;
  author: string;
  roleCompany: string;
  message: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
};
