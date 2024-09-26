import { authSlice } from "../Redux/reducers/authReducer"
import { api } from "../Redux/api"

export const actionFullRegister = (login, password) => async dispatch => {
    const register = await dispatch(api.endpoints.register.initiate({login, password}))
    if(register.data.createUser !== null){
        const token = await dispatch(api.endpoints.login.initiate({login, password}))
        if (token?.data?.login){
            dispatch(authSlice.actions.login(token.data.login))
        }
    }else{
        return true
    }
}