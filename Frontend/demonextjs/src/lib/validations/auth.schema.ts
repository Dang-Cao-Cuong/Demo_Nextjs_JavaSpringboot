import {z} from"zod";
export const loginSchema= z.object({
    email:z
    .string()
    .min(1,"email là bắt buộc")
    .email("email không hợp lệ"),
    password :z
    .string()
    .min(1,"mật khẩu là bắt buộc")
    .min(6, "mật khẩu có ít nhất 6 ký tự")
});
export type LoginFormData=z.infer<typeof loginSchema>;