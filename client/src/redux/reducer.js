import { LOGIN, LOGOUT, TOKEN } from "./actionType"

const  initialState={
   login:false  ,
   token:"",    
}

export const ReducerValue = (state = initialState, action) => {
    switch (action.type) {
        case TOKEN:
            return { ...state, token:action.payload };
        case LOGIN:
            return{...state, login:true, token:action.payload };
        case LOGOUT:
            return{ login:false, token:''}
        default:
            return state;
    }
}