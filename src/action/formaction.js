import axios from 'axios';


export const fetchdatabyid = async () =>{
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
        try{
            const res = await axios.get(`http://localhost:8081/todos?id=${storedUserId}`)
   
          //console.log(res,'----------------')
          return res.data
        }catch(err){
            console.log(err);
        }
     
    } 
  }

