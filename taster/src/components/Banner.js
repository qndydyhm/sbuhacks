export default function Banner(props) {

    let mode1 = (props.mode === 0 ? "on" : "off");
    let mode2 = (props.mode === 0 ? "off" : "on");

    handleCook = (event) => {
        props.setMode(0);
    }

    handleEat = (event) => {
        props.setMode(1);
    }

    return (
        <div id="website-banner">
            <span id="website-name">Taster</span>
            <span id="website-flavors">Flavors</span>
            <div id="searchbar"></div>
            <div id="website-mode">
                <div className={"website-mode-" + mode1} onClick={(e) => handleCook(e)}>
                    Cook
                </div>
                <div className={"website-mode-" + mode2} onClick={(e) => handleEat(e)}>
                    Eat
                </div>
            </div>
        </div>
    )
}
