import { xibuyjRequest } from "@/utils/request";
import { encryptPwd } from "@/utils/auth";

export const login = (data) => {
  return xibuyjRequest({
    url: "/sportCardApi/auth/merchantLogin",
    method: "post",
    data: {
      meAccount: data.username,
      mePassword: encryptPwd(data.password)
    }
  })
}