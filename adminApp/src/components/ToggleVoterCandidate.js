import React from 'react';
import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

export default function ToggleButtonSizes(props) {
    const {handleToggled} = props;
    const [component, setComponent] = React.useState('addCandidate');

    const handleChange = (event, component) => {
        console.log(component)
        setComponent(component);
        handleToggled(component);
    };

    return (
        <Grid container spacing={2} direction="column" alignItems="center">
        <Grid item>
            <ToggleButtonGroup size="large" value={component} exclusive onChange={handleChange}>
            <ToggleButton value="addVoter">
                Add Voter
            </ToggleButton>
            <ToggleButton value="addCandidate">
                Add Candidate
            </ToggleButton>
            </ToggleButtonGroup>
        </Grid>
        </Grid>
    );
}