
import Reac,{useEffect} from 'react';
import {useDispatch} from 'react-redux'
import {auth}from '../_actions/user_action'


export default function(SpecificComponent,option,adminRoute=null){
    //option 부분
    //null =->아무나 출입가능한 페이지
    //ture =>로그인한 유저만 출입가능한
    //false =>로그인한 유저만 출입불가능한

    //es6문법 adminRoute 어드민만 하려면 설정해주는부분 기본값null


    function AuthenticationCheck(props){


        const dispatch=useDispatch();

        useEffect(()=>{

            dispatch(auth()).then(response=>{
                console.log(response)

                //false면 로그인하지않은상태
                if(!response.payload.isAuth)
                {
                    if(option){
                        props.history.push('/login');

                    }


                }else{//로그인 한 상태
                    if(adminRoute && !response.payload.isAdmin){
                        props.history.push('/');
                    }else{
                        if(option===false){
                            props.history.push('/');

                        }

                    }

                }

            })

           

        },[])

        return(
            <SpecificComponent/>
        )



    }












    return AuthenticationCheck
}