import { authSlice } from "../Redux/reducers/authReducer"
import { api } from "../Redux/api"

export const actionFullLogin = (login, password) => async dispatch => {
    const token = await dispatch(api.endpoints.login.initiate({login, password}))
    if (token?.data?.login){
        dispatch(authSlice.actions.login(token.data.login))
    }else{
        return true
    }
}