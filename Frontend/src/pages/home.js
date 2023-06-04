import React , {useState} from "react";
import axios from "axios";
import speechRecognition, { useSpeechRecognition } from "react-speech-recognition";
// import Speech from 'react-text-to-speech'
import Speech from 'speak-tts'

// url: 'http://localhost:3001/',



const Home = () => {
    if(!localStorage.getItem('userDetails')){
        window.location.href='/'

    }
    let txt;
    const {transcript,browserSupportsSpeechRecognition} = useSpeechRecognition();
    // const speech = new Speech() // will throw an exception if not browser supported

    const speech = new Speech() // will throw an exception if not browser supported
if(speech.hasBrowserSupport()) { // returns a boolean
    console.log("speech synthesis supported")
}


    speech.init({
        'volume': 1,
         'lang': 'en-GB',
         'rate': 1,
         'pitch': 1,
         'voice':'Google UK English Male',
         'splitSentences': true,
         'listeners': {
             'onvoiceschanged': (voices) => {
                 console.log("Event voiceschanged", voices)
             }
         }
 }).then((data) => {
        // The "data" object contains the list of available voices and the voice synthesis params
        console.log("Speech is ready, voices are available", data)
    }).catch(e => {
        console.error("An error occured while initializing : ", e)
    })

    


    const back = {
        backgroundColor:"powderblue",
        height: "100vh",
        width: "100vw",
        padding: "auto",
        display: "flex",
        flexDirection:"column",
        
    }

    const inn = {
        // display: "flex",
        color: "black",
        zIndex: 2,
        position: "relative",
        margin: "auto",
        height: "35vh",
        width: "30vw",
        borderRadius:"8px",
        backgroundColor: "white",
    }

    const [searchInput, setSearchInput] = useState("");
    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
        console.log(e)
    };

    
    const [save_rsp,setSave_rsp] = useState("");

    const send_txt = async(txt) =>{
        console.log('hello')
        // const temp = await localStorage.getItem('userDetails');
        // console.log(temp);
        // const token =await window.location.href.substring(30);
        const token = await localStorage.getItem('userDetails');
        const header = `Authorization: Bearer ${token}`;
        const rs = await axios.post('http://localhost:3001/',{
            data:{
                id:txt
            }
        },{headers: {header}}).then((res)=>{ 
            setSave_rsp(res.data.data.rsp);
            // console.log(res.data.data.rsp,"->rsp")
            const dem = res.data.data.rsp;
            speech.speak({
                text: `${dem}`,
                queue: false // current speech will be interrupted,
                
            })
            // if(speech.hasBrowserSupport()) { // returns a boolean
            //     console.log("speech synthesis supported")
            // }            
        })
        .catch((err)=>{console.log(err," ->err")})

        // console.log(rs);
    }

    // console.log(window.location.href.substring(30))

    

    return (
        <>
            <div style={back}>
                <div style={{backgroundColor:"white",display:"inline",height:"8vh",width:"60vw",borderRadius:"30px",marginLeft:"auto",marginRight:"auto",marginBottom:"2vh"}} >
                    <button onClick={speechRecognition.startListening} style={{marginRight:"2vw",marginLeft:"2vw",marginTop:"2vh"}}>Voice</button>
                    {/* <p style={{visibility:"hidden"}}>{transcript}
                    </p> */}
                    <input
                        type="search"
                        placeholder="Speak Something"
                        onChange={handleChange}
                        value={transcript}
                        onKeyDown={e => {
                            console.log(e.key)
                            if (e.key === "Enter") { 
                                txt=transcript;
                                send_txt(txt);
                                console.log(txt, "->")
                            }

                        }}
                        style={{overflow:"scroll -y"}}
                    />

                    <textarea
                        type="text"
                        placeholder="Get response"
                        onChange={handleChange}
                        value={save_rsp}
                        style={{width:"50vw",height:"38vh",marginTop:"25%",borderRadius:"8px",marginLeft:"7%",overflow:"scroll"}}
                    ></textarea>
                    {/* <Speech text={save_rsp} /> */}
                </div>
                
                       
                <p style={{display:"inline",backgroundColor:"red",color:"white",width:"10vw",textAlign:"center",height:"6vh",borderRadius:"8px",marginTop:"70vh",marginLeft:"40vw"}}
                onClick={()=>{
                    axios.delete('http://localhost:3001/signOut').then(()=>{console.log("logged out")})
                    window.location.href='/';
                    localStorage.removeItem('userDetails');
                }}
                >Log Out</p>
                      
            </div>
        </>
    )
}

export default Home;