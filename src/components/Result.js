import React, { useContext } from "react";

import { ScoreContext } from "../context/Contexts";
import Header from "./Header"

const Result = () =>{
    const contextScore = useContext(ScoreContext)
    console.log(contextScore);
    return (
        <>
            <Header/>
            <div className="resultPage" >
                <h1 className="resultText">Your result is {contextScore.score}/10</h1>
            </div>
        </>
        
        
    )
}

export default Result;