import KrisKringle from "./components/forms/kris-kringle/KrisKringle";
import { Grid } from "@mui/material";

function App() {
  return (
    <div className="App">
      <Grid container l={12} justifyContent="center">
        <h1>Kris Kringle</h1>
      </Grid>
      <Grid container l={12} justifyContent="center">
        <p>Organise a kris kindle (Secret Santa) gift exchange through sms</p>
      </Grid>
      <KrisKringle />   
    </div>
  );
}

export default App;
