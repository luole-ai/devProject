import { xibuyjRequest } from "@/utils/request";

// 投诉分页列表
export const pageComplaint = (data) => {
    return xibuyjRequest({
        url: "/sportCardApi/serviceApply/pageComplaint",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data
    })
}

// 获取申请详情(applyType - 2(投诉) 1(报修))
export const getServiceApplyDetails = (data) => {
    return xibuyjRequest({
        url: "/sportCardApi/serviceApply/getServiceApplyDetails",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data
    })
}

// 投诉列表统计
export const complaintCount = (data) => {
    return xibuyjRequest({
        url: "/sportCardApi/serviceApply/complaintCount",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data
    })
}

// 投诉申请保存
export const saveComplaintDetail = (data) => {
    return xibuyjRequest({
        url: "/sportCardApi/serviceApply/saveComplaintDetail",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data
    })
}