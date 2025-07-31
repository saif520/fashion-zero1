 import { app } from "./app.js";

const PORT = process.env.PORT || 3000;

app.get("/",(req,res)=>{
  res.send('Hello World')
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
}); 