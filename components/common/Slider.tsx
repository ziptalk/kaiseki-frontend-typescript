import { useState } from "react";

interface SliderProps {
  elements: React.ReactNode[];
}

const Slider = ({ elements }: SliderProps) => {
  const [animate, setAnimate] = useState(true);
  const onStop = () => setAnimate(false);
  const onRun = () => setAnimate(true);

  return (
    <div className="wrapper">
      <div className="slide_container">
        <div
          className="slide_wrapper"
          onMouseEnter={onStop}
          onMouseLeave={onRun}
        >
          <div className={"slide original" + (animate ? "" : " stop")}>
            {elements.map((element) => element)}
          </div>
          <div className={"slide clone" + (animate ? "" : " stop")}>
            {elements.map((element) => element)}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Slider;
