import * as Yup from "yup";

export const leadFormPageValidation = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  linkedIn: Yup.string()
    .url("Invalid URL")
    .required("LinkedIn profile is required"),
  visas: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one visa")
    .required(),
  resume: Yup.mixed()
    .test("file-required", "Resume is required", (value) => {
      return value instanceof FileList && value.length > 0;
    })
    .required("Resume is required"),
  additionalInfo: Yup.string().required("Additional info is required"),
  country: Yup.string().required("Country is required"),
});

export type LeadFormSchema = Yup.InferType<typeof leadFormPageValidation>;
