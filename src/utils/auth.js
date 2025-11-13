import {JSEncrypt} from "encryptlong"
const TokenKey = 'Admin-Token'
const PUBLIC_KEY_PWD="MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1Tfa1QTkCRLpW+VdYkCDmmi3tvpTLtmILO+O7ZRITL6wUqRCzPtisaFsiIqD31hsHe5hYw5/fBd4mAFSX2OWhn5ltLYOElT8PQ9eaHNzhgP5+NdJEqQ8U2wGRrlfyPwek/inMY+5xSQV/sWQoNOafir2qW5esKVLSfL5UCpIAVwIDAQAB"
export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
} 
export function encryptPwd(pwd) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(PUBLIC_KEY_PWD)
  return encryptor.encryptLong(pwd)
}