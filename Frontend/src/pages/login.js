import React,{useState} from "react";
import axios from "axios";
const Login = () => {


    const [em, setem] = useState("");
    const [ps, setps] = useState("");
    const handleEmail = async(e) => {
        e.preventDefault();
        setem(e.target.value);
        // console.log(e.target.value)
    };
    const handlePass = async (e) => {
        e.preventDefault();
        setps(e.target.value);
        // console.log(e.target.value)
    };
    return (
        <>
            <div style={{backgroundColor:"powderblue",
        height: "100vh",
        width: "100vw",
        padding: "auto",
        display: "flex",
        flexDirection:"column"}}>
                <div style={{display:"flex",margin:"auto",backgroundColor:"white",height:"44vh",width:"30vw",borderRadius:"10px"}}>
                    <form>


                        <input type="email" style={{width:"25vw",height:"6vh",marginTop:"2vh",marginLeft:"2vw",display:"flex",borderRadius:"5px"}} placeholder="Enter email" onChange={handleEmail}/>


                        <input type="password" style={{width:"25vw",height:"6vh",marginTop:"2vh",marginLeft:"2vw",display:"flex",borderRadius:"5px"}} placeholder="Enter Password" onChange={handlePass}/>
                                      

                        <input style={{cursor:"pointer",width:"25vw",height:"6vh",marginTop:"2vh",marginLeft:"2vw",display:"flex",borderRadius:"5px",textAlign:"center",fontSize:"1.6em"}} value = "Log In"
                        onClick={()=>{
                            // console.log(em,"-> em ",ps,"-> ps")
                            axios.post('http://localhost:3001/login',{
                                "email":em,
                                "password":ps,
                            }).then(async(res)=>{console.log(res ," ->res");
                                const token = await res.data.token;
                                // console.log(token," -> token")
                                localStorage.setItem('userDetails',token);
                                window.location.href=`/home`
                            })
                        }}
                        />

                        <p style={{marginLeft:"10vw"}}>----------  or  ----------</p>


                        <input style={{cursor:"pointer",width:"25vw",height:"6vh",marginTop:"2vh",marginLeft:"2vw",display:"flex",borderRadius:"5px",textAlign:"center",fontSize:"1.6em"}} value = "Sign Up"
                        onClick={()=>{window.location.href='/'}}
                        />
                        
                        
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login;