import { Typography } from "@material-ui/core"

const TabPanel = (props) => {
    return(<div hidden={props.value !== props.index}>
        { props.value === props.index &&
            (<Typography component={"span"}> 
                {props.children} 
                </Typography>)}
    </div>)
}

export default TabPanel