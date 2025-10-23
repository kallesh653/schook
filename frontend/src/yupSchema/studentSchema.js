import * as yup from 'yup';

export const studentSchema = yup.object({
    name: yup.string().min(4, "Name must contain 4 characters").required("Name is required"),
    email: yup.string().email("It must be an Email.").min(4, "email must contain 4 characters").required("email is required"),
    student_class: yup.string("Student Class must be string value.").required("Select A Class || Add New Class & Select."),
    gender: yup.string("Gender must be string value.").required("You must select a Gender."),
    date_of_birth: yup.date()
        .max(new Date(), "Date of birth cannot be in the future")
        .test('age', 'Student must be at least 4 years old', function(value) {
            if (!value) return false;
            const today = new Date();
            const birthDate = new Date(value);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age >= 4;
        })
        .required("Date of birth is required"),
    date_of_admission: yup.date()
        .max(new Date(), "Date of admission cannot be in the future")
        .required("Date of admission is required"),
    age: yup.number("Age must be a number."),
    guardian: yup.string().min(4, "Guardian must contain 4 characters").required("Guardian is required"),
    guardian_phone: yup.string().min(10, "Phone must contain 10 characters").required("Phone is required"),
    aadhaar_number: yup.string()
        .matches(/^\d{12}$/, "Aadhaar number must be exactly 12 digits")
        .required("Aadhaar number is required"),
    password: yup.string().required("Password is a required field."),
})