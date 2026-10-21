import "dotenv/config";
import app from "./app.js";
import { iniciarSchedulerTurnos } from "./turno/turno.scheduler.js";

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is running on port " + (process.env.PORT || 3000));
    console.log("http://localhost:" + (process.env.PORT || 3000));
    iniciarSchedulerTurnos();
})
