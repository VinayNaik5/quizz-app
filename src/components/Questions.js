import React, { useContext, useEffect, useState, useRef } from "react";
import Axios from "axios";
import { ScoreContext } from "../context/Contexts";
import { useNavigate } from "react-router-dom";
import { Grid, Container } from "@mui/material";
import { decode } from "html-entities";
import Header from "./Header";

//stylings
//imported botstarp
import "bootstrap/dist/css/bootstrap.min.css";

//canvas-confitti
import ReactCanvasConfetti from "react-canvas-confetti";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(-1);
  const context = useContext(ScoreContext);
  const [options, setOptions] = useState([]);
  const [clicked, setClicked] = useState(false);

  //for confitti
  const refAnimationInstance = useRef(null);
  const canvasStyles = {
    position: "fixed",
    pointerEvents: "none",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  };

  useEffect(() => {
    getQuestions();
  }, []);

  useEffect(() => {
    setIndex(0);
    updateOptions();
  }, [questions]);

  useEffect(() => {
    if (index !== null && index !== 0) {
      updateOptions();
    }
    setClicked(false);
  }, [index]);

  const Redirect = () => {
    const navigate = useNavigate();
    useEffect(() => {
      navigate("/Result");
    });
    return null;
  };

  const updateOptions = () => {
    setOptions([]);
    setOptions(
      [
        questions[index]?.correct_answer,
        ...(questions[index]?.incorrect_answers ?? []),
      ].sort(() => Math.random() - 0.5)
    );
    //console.log(questions[index]?.correct_answer,questions[index]?.incorrect_answers);
  };

  const getQuestions = async () => {
    let { data } = await Axios.get("https://opentdb.com/api.php?amount=10");
    await setQuestions(data.results);
    console.log(data.results);
  };

  const compareAnswer = (option) => {
    if (!clicked) {
      if (option === questions[index]?.correct_answer) {
        setClicked(true);
        makeShot(0.75, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2,
        });

        setTimeout(() => {
          if (index <= 9) setIndex(index + 1);
          context.setScore(context.score + 1);
        }, 900);
      } else if (index <= 9) {
        setIndex(index + 1);
      }
    }
  };

  if (index === 10) {
    return <Redirect />;
  }

  //confitti

  const getInstance = (instance) => {
    refAnimationInstance.current = instance;
  };

  const makeShot = (particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      });
  };

  return (
    <div>
      <Header />
      <div className="resultPage">
        <div className="QuestionBox">
          <div className="">
            <Container>
              <div>
                <h2>Question {index + 1}</h2>
              </div>
              <div>
                <h1>
                  <p>{decode(questions[index]?.question)}</p>
                </h1>
              </div>
            </Container>

            <Container>
              <Grid
                container
                columns={{ md: 9, xs: 9, ld: 9 }}
                spacing={{ md: 3, xs: 3, ld: 3 }}
              >
                {options.map((option, key) => {
                  return (
                    <Grid item md={4.5} className="" key={key}>
                      <button
                        className="btn-size"
                        key={key}
                        onClick={(e) => compareAnswer(e.target.value)}
                        value={option}
                      >
                        {decode(option)}
                      </button>
                    </Grid>
                  );
                })}
              </Grid>
            </Container>
            <ReactCanvasConfetti
              refConfetti={getInstance}
              style={canvasStyles}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions;
