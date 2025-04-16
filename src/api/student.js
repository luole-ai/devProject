import {mockRequest} from '@/utils/request'
export const getStudent = () => {
    return mockRequest.get("student/1")
}