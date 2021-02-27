import { defHttp } from '/@/utils/http/axios';
import {
  LoginParams,
  LoginResultModel,
  GetUserInfoByUserIdParams,
  GetUserInfoModel,
} from './model/userModel';

enum Api {
  Login = '/login',
  GetUserInfo = '/sys/user/getInfo',
  GetPermCodeByUserId = '/getPermCodeByUserId',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams) {
  return defHttp.postForm < LoginResultModel || null > (Api.Login, params);
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>(Api.GetUserInfo);
}

export function getPermCodeByUserId(params: GetUserInfoByUserIdParams) {
  return defHttp.request<string[]>({
    url: Api.GetPermCodeByUserId,
    method: 'GET',
    params,
  });
}
