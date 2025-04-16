import { localRequest } from '@/utils/request'

export const getList = ()=>{
    return localRequest.post('broadcast/getList')
}
