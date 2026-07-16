import getAllUsers from "../model/users.js"

async function getUsers(req,res) {
    try{
        const users = await getAllUsers()
        return res.status(200).json(users)
        if(users == 0){
            return res.status(404).json({message:"No se encontraron usuarios"})
        }
    }catch(error){
        return res.status(400).json({error:error.message})
    }
}
export default getUsers