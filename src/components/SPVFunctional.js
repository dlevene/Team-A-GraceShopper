import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  ButtonBase,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  MenuItem,
  Fab,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  spacing: {
    padding: theme.spacing(3, 2),
    maxWidth: '300',
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: '80em',
    maxHeight: 'auto',
  },
  img: {
    margin: '1em',
    maxHeight: '300px',
    maxWidth: '300px',
  },
  labelWidth: {
    width: '100%',
    height: '100px',
  },
}));

const SPVFunctional = props => {
  const classes = useStyles();
  const { product, addToCart } = props;
  const { supplier, category } = product;
  return product && category ? (
    <Paper className={classes.paper}>
      <Grid container spacing={3}>
        <ButtonBase>
          <img className={classes.img} alt="complex" src={product.imageUrl} />
        </ButtonBase>
        <Grid item sm>
          <Grid item sm container direction="column" spacing={2}>
            <Typography variant="h2">{product.name}</Typography>
            <Typography variant="subtitle1" style={{ marginLeft: '5px' }}>
              {category.name}
            </Typography>
            <Typography variant="subtitle2" style={{ marginLeft: '5px' }}>
              {`By: ${supplier.name}`}
            </Typography>
            <Grid item>
              <Typography gutterBottom variant="body1">
                {product.description}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={2}>
          <Typography
            variant="subtitle1"
            style={{ marginBottom: '10px' }}
          >{`Price: $${product.price}`}</Typography>
          {/* no state at the moment to hold the value */}
          <FormControl className={classes.labelWidth} variant="outlined">
            <InputLabel htmlFor="outlined-quant-simple">Quantity</InputLabel>
            <Select
              value="1"
              input={
                <OutlinedInput name="quantity" id="outlined-quant-simple" />
              }
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {[1, 2, 3, 4, 5].map((quant, ind) => {
                return (
                  <MenuItem key={ind} value={quant}>
                    {quant}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Grid item container justify="center">
            <Typography variant="subtitle1">Add</Typography>
          </Grid>
          <Grid item container justify="center">
            <Fab
              size="large"
              color="secondary"
              aria-label="add"
              onClick={() => {
                addToCart({orderProducts: [{product, quantity: 1}]});
              }}
            >
              <AddIcon />
            </Fab>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  ) : (
    <div />
  );
};

export default SPVFunctional;
