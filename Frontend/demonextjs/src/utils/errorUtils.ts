
import { AxiosError } from 'axios';

/**
 * Lấy translation key từ error object
 * @param error lỗi từ catch block
 * @returns translation key trong common.json (ví dụ: 'error.http_409')
 */
export const getErrorMessageKey = (error: any): string => {
    if (!error) return 'error.default';

    // Xử lý Axios Error
    if (error.isAxiosError) {
        const axiosError = error as AxiosError; // Sửa: Dùng biến trung gian để ép kiểu
        const status = axiosError.response?.status;

        switch (status) {
            case 400:
                return 'error.http_400';
            case 401:
                return 'error.http_401';
            case 403:
                return 'error.http_403';
            case 404:
                return 'error.http_404';
            case 409:
                return 'error.http_409';
            case 500:
                return 'error.http_500';
            default:
                // Nếu backend có trả về message nhưng không match status code nào cụ thể
                // Tuy nhiên ở đây ta ưu tiên dùng key translation chung
                break;
        }
    }

    // Nếu error có message dạng chuỗi và mình muốn map custom logic vào đây
    // Ví dụ: error.message === 'Network Error' -> return ...

    return 'error.default';
};
